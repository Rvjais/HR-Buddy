import express from 'express';
import {
  createQuiz,
  getQuizzes,
  getQuizById,
  getPublicQuiz,
  updateQuiz,
  deleteQuiz,
  togglePublish,
  getQuizStats
} from '../controllers/quizController.js';
import { protect, hrOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes (for candidates)
router.get('/public/:id', getPublicQuiz);

// Protected routes (HR only)
router.route('/')
  .get(protect, hrOnly, getQuizzes)
  .post(protect, hrOnly, createQuiz);

router.route('/:id')
  .get(protect, hrOnly, getQuizById)
  .put(protect, hrOnly, updateQuiz)
  .delete(protect, hrOnly, deleteQuiz);

router.patch('/:id/publish', protect, hrOnly, togglePublish);
router.get('/:id/stats', protect, hrOnly, getQuizStats);

export default router;
