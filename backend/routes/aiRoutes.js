import express from 'express';
import { generateQuestions } from '../controllers/aiController.js';
import { protect, hrOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate-questions', protect, hrOnly, generateQuestions);

export default router;
