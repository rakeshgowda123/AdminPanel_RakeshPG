import express from 'express';
import { 
  uploadList, 
  getDistributedLists, 
  getListByAgent 
} from '../controllers/listController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();

// Setup file upload with multer
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported. Please upload CSV, XLS, or XLSX files only.'), false);
    }
  }
});

// Protect all routes
router.use(protect);
router.use(admin);

router.post('/upload', upload.single('file'), uploadList);
router.get('/', getDistributedLists);
router.get('/agent/:agentId', getListByAgent);

export default router;