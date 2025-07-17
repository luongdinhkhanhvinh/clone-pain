import { and, desc, eq, sql } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { media, users } from '../db/schema';
import { ApiError, catchAsync } from '../middleware/error';

const pump = promisify(pipeline);

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Allowed file types
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
];

// Max file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// @desc    Upload media file
// @route   POST /api/media/upload
// @access  Private/Admin
export const uploadMedia = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(new ApiError(400, 'No file uploaded'));
  }

  const { originalname, mimetype, size, path: filePath } = req.file;
  const { altText } = req.body;
  
  // Validate file type
  if (!ALLOWED_FILE_TYPES.includes(mimetype)) {
    // Delete the uploaded file
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
    return next(new ApiError(400, 'File type not allowed'));
  }
  
  // Validate file size
  if (size > MAX_FILE_SIZE) {
    // Delete the uploaded file
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
    return next(new ApiError(400, 'File size exceeds the maximum limit of 10MB'));
  }
  
  // Generate a unique filename
  const fileExt = path.extname(originalname).toLowerCase();
  const fileName = `${uuidv4()}${fileExt}`;
  const destinationPath = path.join(uploadDir, fileName);
  
  try {
    // Move the file to the uploads directory
    await fs.promises.rename(filePath, destinationPath);
    
    // Get file dimensions for images
    let width = null;
    let height = null;
    
    if (mimetype.startsWith('image/') && !mimetype.endsWith('svg+xml')) {
      const sizeOf = (await import('image-size')).default;
      const dimensions = sizeOf(fs.readFileSync(destinationPath));
      width = dimensions.width || null;
      height = dimensions.height || null;
    }
    
    // Create media record in the database
    const [newMedia] = await db
      .insert(media)
      .values({
        id: uuidv4(),
        name: originalname,
        url: `/uploads/${fileName}`,
        mimeType: mimetype,
        fileSize: size,
        width,
        height,
        altText: altText || '',
        createdById: req.user.id,
      })
      .returning();
    
    res.status(201).json({
      success: true,
      data: newMedia,
    });
  } catch (error) {
    // Clean up the file if something went wrong
    if (fs.existsSync(destinationPath)) {
      await fs.promises.unlink(destinationPath);
    }
    throw error;
  }
});

// @desc    Get all media files
// @route   GET /api/media
// @access  Private/Admin
export const getMedia = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { page = 1, limit = 20, search, type } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  
  // Build base query with all conditions
  const conditions = [];
  
  if (search) {
    const searchTerm = `%${search}%`;
    conditions.push(sql`${media.name} ILIKE ${searchTerm}`);
  }
  
  if (type === 'image') {
    conditions.push(sql`${media.mimeType} LIKE 'image/%'`);
  } else if (type === 'document') {
    conditions.push(sql`${media.mimeType} IN (
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    )`);
  }
  
  // Execute query with all conditions
  const mediaList = await db
    .select({
      id: media.id,
      name: media.name,
      url: media.url,
      mimeType: media.mimeType,
      fileSize: media.fileSize,
      width: media.width,
      height: media.height,
      altText: media.altText,
      createdAt: media.createdAt,
      createdBy: {
        id: users.id,
        name: users.fullName, // Using fullName instead of name to match the schema
        email: users.email,
      },
    })
    .from(media)
    .leftJoin(users, eq(media.createdById, users.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(media.createdAt))
    .limit(Number(limit))
    .offset(offset);
  
  // Get total count for pagination
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(media);
  
  res.status(200).json({
    success: true,
    count: mediaList.length,
    total: Number(count),
    page: Number(page),
    pages: Math.ceil(Number(count) / Number(limit)),
    data: mediaList,
  });
});

// @desc    Get single media file
// @route   GET /api/media/:id
// @access  Private/Admin
export const getMediaById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  const [mediaItem] = await db
    .select({
      id: media.id,
      name: media.name,
      url: media.url,
      mimeType: media.mimeType,
      fileSize: media.fileSize,
      width: media.width,
      height: media.height,
      altText: media.altText,
      createdAt: media.createdAt,
      createdBy: {
        id: users.id,
        email: users.email,
        fullName: users.fullName,
      },
    })
    .from(media)
    .leftJoin(users, eq(media.createdById, users.id))
    .where(eq(media.id, id));
  
  if (!mediaItem) {
    return next(new ApiError(404, 'Media not found'));
  }
  
  res.status(200).json({
    success: true,
    data: mediaItem,
  });
});

// @desc    Update media file
// @route   PUT /api/media/:id
// @access  Private/Admin
export const updateMedia = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name, altText } = req.body;
  
  // Check if media exists
  const [mediaItem] = await db
    .select()
    .from(media)
    .where(eq(media.id, id));
  
  if (!mediaItem) {
    return next(new ApiError(404, 'Media not found'));
  }
  
  // Update media
  const [updatedMedia] = await db
    .update(media)
    .set({
      name: name || mediaItem.name,
      altText: altText !== undefined ? altText : mediaItem.altText,
      // updatedAt is handled by the database with a default value
    })
    .where(eq(media.id, id))
    .returning();
  
  res.status(200).json({
    success: true,
    data: updatedMedia,
  });
});

// @desc    Delete media file
// @route   DELETE /api/media/:id
// @access  Private/Admin
export const deleteMedia = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  // Check if media exists
  const [mediaItem] = await db
    .select()
    .from(media)
    .where(eq(media.id, id));
  
  if (!mediaItem) {
    return next(new ApiError(404, 'Media not found'));
  }
  
  // Delete file from filesystem
  const filePath = path.join(process.cwd(), mediaItem.url);
  if (fs.existsSync(filePath)) {
    await fs.promises.unlink(filePath);
  }
  
  // Delete media record from database
  await db
    .delete(media)
    .where(eq(media.id, id));
  
  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Serve media file
// @route   GET /uploads/:filename
// @access  Public
export const serveMedia = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { filename } = req.params;
  const filePath = path.join(uploadDir, filename);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return next(new ApiError(404, 'File not found'));
  }
  
  // Set appropriate headers
  const ext = path.extname(filename).toLowerCase();
  let contentType = 'application/octet-stream';
  
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      contentType = 'image/jpeg';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.gif':
      contentType = 'image/gif';
      break;
    case '.webp':
      contentType = 'image/webp';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
    case '.pdf':
      contentType = 'application/pdf';
      break;
    case '.doc':
      contentType = 'application/msword';
      break;
    case '.docx':
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      break;
    case '.xls':
      contentType = 'application/vnd.ms-excel';
      break;
    case '.xlsx':
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      break;
    case '.txt':
      contentType = 'text/plain';
      break;
  }
  
  // Set cache control headers (1 year)
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  res.setHeader('Content-Type', contentType);
  
  // Stream the file
  const fileStream = fs.createReadStream(filePath);
  await pump(fileStream, res);
});
