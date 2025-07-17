import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import { db } from '../db';
import { settings } from '../db/schema';
import { ApiError, catchAsync } from '../middleware/error';

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private/Admin
export const getSettings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const settingsList = await db
    .select()
    .from(settings);
  
  // Convert array of settings to an object
  const settingsObject = settingsList.reduce((acc: any, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {});
  
  res.status(200).json({
    success: true,
    data: settingsObject,
  });
});

// @desc    Get single setting
// @route   GET /api/settings/:key
// @access  Private/Admin
export const getSetting = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { key } = req.params;
  
  const [setting] = await db
    .select()
    .from(settings)
    .where(eq(settings.key, key));
  
  if (!setting) {
    return next(new ApiError(404, 'Setting not found'));
  }
  
  res.status(200).json({
    success: true,
    data: {
      [setting.key]: setting.value,
    },
  });
});

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const updates = req.body;
  
  if (!updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
    return next(new ApiError(400, 'No settings provided for update'));
  }
  
  // Get all existing settings
  const existingSettings = await db
    .select()
    .from(settings);
  
  const existingKeys = existingSettings.map(s => s.key);
  const updatePromises = [];
  const currentTime = new Date();
  
  // Process each setting in the request
  for (const [key, value] of Object.entries(updates)) {
    if (existingKeys.includes(key)) {
      // Update existing setting
      updatePromises.push(
        db
          .update(settings)
          .set({
            value: value as any,
            updatedAt: currentTime,
          })
          .where(eq(settings.key, key))
      );
    } else {
      // Create new setting
      updatePromises.push(
        db
          .insert(settings)
          .values({
            key,
            value: value as any,
            createdAt: currentTime,
            updatedAt: currentTime,
          })
          .onConflictDoUpdate({
            target: settings.key,
            set: {
              value: value as any,
              updatedAt: currentTime,
            },
          })
      );
    }
  }
  
  // Execute all updates
  await Promise.all(updatePromises);
  
  // Get updated settings
  const updatedSettingsList = await db
    .select()
    .from(settings);
  
  // Convert to object
  const updatedSettings = updatedSettingsList.reduce((acc: any, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {});
  
  res.status(200).json({
    success: true,
    data: updatedSettings,
  });
});

// @desc    Update single setting
// @route   PUT /api/settings/:key
// @access  Private/Admin
export const updateSetting = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const { key } = req.params;
  const { value } = req.body;
  
  if (value === undefined) {
    return next(new ApiError(400, 'Value is required'));
  }
  
  // Check if setting exists
  const [existingSetting] = await db
    .select()
    .from(settings)
    .where(eq(settings.key, key));
  
  let result;
  const currentTime = new Date();
  
  if (existingSetting) {
    // Update existing setting
    [result] = await db
      .update(settings)
      .set({
        value,
        updatedAt: currentTime,
      })
      .where(eq(settings.key, key))
      .returning();
  } else {
    // Create new setting
    [result] = await db
      .insert(settings)
      .values({
        key,
        value,
        createdAt: currentTime,
        updatedAt: currentTime,
      })
      .returning();
  }
  
  res.status(200).json({
    success: true,
    data: {
      [result.key]: result.value,
    },
  });
});

// @desc    Delete setting
// @route   DELETE /api/settings/:key
// @access  Private/Admin
export const deleteSetting = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const { key } = req.params;
  
  // Check if setting exists
  const [setting] = await db
    .select()
    .from(settings)
    .where(eq(settings.key, key));
  
  if (!setting) {
    return next(new ApiError(404, 'Setting not found'));
  }
  
  // Delete setting
  await db
    .delete(settings)
    .where(eq(settings.key, key));
  
  res.status(200).json({
    success: true,
    data: {},
  });
});
