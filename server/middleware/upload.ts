import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { ApiError } from './error';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    cb(null, uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `file-${uniqueSuffix}${ext}`);
  },
});

// File filter function
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = [
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
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Invalid file type'));
  }
};

// Initialize multer with configuration
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
});

// Single file upload middleware
export const singleUpload = (fieldName: string) => 
  (req: Request, res: any, next: any) => {
    upload.single(fieldName)(req, res, (err: any) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new ApiError(400, 'File size exceeds the maximum limit of 10MB'));
        } else if (err.message === 'Invalid file type') {
          return next(new ApiError(400, 'Invalid file type'));
        }
        return next(err);
      }
      next();
    });
  };

// Multiple files upload middleware
export const multipleUpload = (fieldName: string, maxCount: number = 5) => 
  (req: Request, res: any, next: any) => {
    upload.array(fieldName, maxCount)(req, res, (err: any) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new ApiError(400, 'File size exceeds the maximum limit of 10MB'));
        } else if (err.message === 'Invalid file type') {
          return next(new ApiError(400, 'Invalid file type'));
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(new ApiError(400, `Maximum ${maxCount} files allowed`));
        }
        return next(err);
      }
      next();
    });
  };

// Fields upload middleware
export const fieldsUpload = (fields: { name: string; maxCount?: number }[]) => 
  (req: Request, res: any, next: any) => {
    upload.fields(fields)(req, res, (err: any) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new ApiError(400, 'File size exceeds the maximum limit of 10MB'));
        } else if (err.message === 'Invalid file type') {
          return next(new ApiError(400, 'Invalid file type'));
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(new ApiError(400, 'Unexpected file field'));
        }
        return next(err);
      }
      next();
    });
  };
