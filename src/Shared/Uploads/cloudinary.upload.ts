import multer from 'multer';

const storage = multer.memoryStorage(); 

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG, and PDF files are allowed'));
    }
    cb(null, true);
  },
});