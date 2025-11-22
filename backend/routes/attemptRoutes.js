import express from 'express';
import {
  startAttempt,
  submitAttempt,
  getAttempt,
  getQuizAttempts,
  getAttemptDetails,
  getAllMyAttempts
} from '../controllers/attemptController.js';
import { protect, hrOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes (for candidates)
router.post('/start', startAttempt);
router.post('/:attemptId/submit', submitAttempt);
router.get('/:attemptId', getAttempt);

// Protected routes (HR only)
router.get('/quiz/:quizId', protect, hrOnly, getQuizAttempts);
router.get('/:attemptId/details', protect, hrOnly, getAttemptDetails);
router.get('/my-quizzes/all', protect, hrOnly, getAllMyAttempts);

export default router;
