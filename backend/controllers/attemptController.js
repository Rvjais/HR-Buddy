import Attempt from '../models/Attempt.js';
import Quiz from '../models/Quiz.js';
import { evaluateAnswer } from './aiController.js';

// @desc    Start a new quiz attempt
// @route   POST /api/attempts/start
// @access  Public
export const startAttempt = async (req, res) => {
  try {
    const { quizId, candidateName, candidateEmail } = req.body;

    if (!quizId || !candidateName || !candidateEmail) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if quiz exists and is published
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (!quiz.isPublished) {
      return res.status(403).json({ message: 'Quiz is not available' });
    }

    // Create new attempt
    const attempt = await Attempt.create({
      quizId,
      candidateName,
      candidateEmail,
      status: 'in-progress',
      startedAt: new Date()
    });

    res.status(201).json({
      _id: attempt._id,
      quizId: attempt.quizId,
      candidateName: attempt.candidateName,
      candidateEmail: attempt.candidateEmail,
      status: attempt.status,
      startedAt: attempt.startedAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit quiz attempt
// @route   POST /api/attempts/:attemptId/submit
// @access  Public
export const submitAttempt = async (req, res) => {
  try {
    const { answers, timeTakenSeconds, isTimeout } = req.body;

    const attempt = await Attempt.findById(req.params.attemptId);

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    if (attempt.status !== 'in-progress') {
      return res.status(400).json({ message: 'Attempt already submitted' });
    }

    // Get quiz to check correct answers
    const quiz = await Quiz.findById(attempt.quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Calculate score
    let correctCount = 0;

    const processedAnswers = await Promise.all(answers.map(async (answer) => {
      const question = quiz.questions[answer.questionIndex];

      if (!question) return { ...answer, isCorrect: false };

      let isCorrect = false;

      if (question.type === 'mcq') {
        isCorrect = answer.selectedOption === question.correctAnswer;
      } else if (question.type === 'open') {
        // AI Evaluation for open questions
        const evaluation = await evaluateAnswer(question.questionText, answer.selectedOption);
        isCorrect = evaluation.isCorrect;
        // You might want to store the feedback/score too, but for now we just use isCorrect
      }

      if (isCorrect) {
        correctCount++;
      }

      return {
        questionIndex: answer.questionIndex,
        selectedOption: answer.selectedOption,
        isCorrect
      };
    }));

    const score = (correctCount / quiz.questions.length) * 100;

    // Update attempt
    attempt.answers = processedAnswers;
    attempt.score = Math.round(score * 100) / 100; // Round to 2 decimal places
    attempt.timeTakenSeconds = timeTakenSeconds;
    attempt.status = isTimeout ? 'timeout' : 'completed';
    attempt.submittedAt = new Date();

    await attempt.save();

    // Return attempt with score
    res.json({
      _id: attempt._id,
      score: attempt.score,
      totalQuestions: quiz.questions.length,
      correctAnswers: correctCount,
      timeTakenSeconds: attempt.timeTakenSeconds,
      status: attempt.status,
      answers: attempt.answers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single attempt (for candidate to view results)
// @route   GET /api/attempts/:attemptId
// @access  Public
export const getAttempt = async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.attemptId).populate('quizId', 'title jobProfile questions');

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    res.json(attempt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all attempts for a quiz (HR only)
// @route   GET /api/attempts/quiz/:quizId
// @access  Private (HR only)
export const getQuizAttempts = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check ownership
    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these attempts' });
    }

    const attempts = await Attempt.find({
      quizId: req.params.quizId,
      status: { $in: ['completed', 'timeout'] }
    })
      .sort('-createdAt')
      .select('-answers'); // Don't send detailed answers in list view

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get detailed attempt (HR only)
// @route   GET /api/attempts/:attemptId/details
// @access  Private (HR only)
export const getAttemptDetails = async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.attemptId)
      .populate('quizId', 'title jobProfile questions createdBy');

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    // Check ownership of the quiz
    if (attempt.quizId.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this attempt' });
    }

    res.json(attempt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all attempts by HR (across all their quizzes)
// @route   GET /api/attempts/my-quizzes
// @access  Private (HR only)
export const getAllMyAttempts = async (req, res) => {
  try {
    // Get all quizzes created by this HR
    const quizzes = await Quiz.find({ createdBy: req.user._id }).select('_id');
    const quizIds = quizzes.map(q => q._id);

    // Get all attempts for these quizzes
    const attempts = await Attempt.find({
      quizId: { $in: quizIds },
      status: { $in: ['completed', 'timeout'] }
    })
      .populate('quizId', 'title jobProfile')
      .sort('-createdAt')
      .select('-answers');

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
