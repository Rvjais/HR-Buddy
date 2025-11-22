import Quiz from '../models/Quiz.js';
import Attempt from '../models/Attempt.js';

// @desc    Create new quiz
// @route   POST /api/quizzes
// @access  Private (HR only)
export const createQuiz = async (req, res) => {
  try {
    const { title, jobProfile, description, timeLimitMinutes, questions } = req.body;

    // Validate input
    if (!title || !jobProfile || !timeLimitMinutes || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const quiz = await Quiz.create({
      title,
      jobProfile,
      description,
      timeLimitMinutes,
      questions,
      createdBy: req.user._id,
      isPublished: false
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all quizzes for HR
// @route   GET /api/quizzes
// @access  Private (HR only)
export const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id })
      .sort('-createdAt')
      .populate('createdBy', 'name email');

    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single quiz by ID
// @route   GET /api/quizzes/:id
// @access  Private (HR only) or Public (for candidates via different route)
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name email');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // If user is HR, check ownership
    if (req.user && quiz.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this quiz' });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get public quiz (for candidates - no auth required)
// @route   GET /api/quizzes/public/:id
// @access  Public
export const getPublicQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (!quiz.isPublished) {
      return res.status(403).json({ message: 'Quiz is not published' });
    }

    // Return quiz without correct answers for candidates
    const publicQuiz = {
      _id: quiz._id,
      title: quiz.title,
      jobProfile: quiz.jobProfile,
      description: quiz.description,
      timeLimitMinutes: quiz.timeLimitMinutes,
      questions: quiz.questions.map(q => ({
        _id: q._id,
        questionText: q.questionText,
        type: q.type,
        options: q.options
        // Don't send correctAnswer to candidates
      }))
    };

    res.json(publicQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private (HR only)
export const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check ownership
    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this quiz' });
    }

    const { title, jobProfile, description, timeLimitMinutes, questions, isPublished } = req.body;

    quiz.title = title || quiz.title;
    quiz.jobProfile = jobProfile || quiz.jobProfile;
    quiz.description = description !== undefined ? description : quiz.description;
    quiz.timeLimitMinutes = timeLimitMinutes || quiz.timeLimitMinutes;
    quiz.questions = questions || quiz.questions;
    quiz.isPublished = isPublished !== undefined ? isPublished : quiz.isPublished;

    const updatedQuiz = await quiz.save();

    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (HR only)
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check ownership
    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this quiz' });
    }

    await quiz.deleteOne();

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Publish/unpublish quiz
// @route   PATCH /api/quizzes/:id/publish
// @access  Private (HR only)
export const togglePublish = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check ownership
    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to publish this quiz' });
    }

    quiz.isPublished = !quiz.isPublished;
    const updatedQuiz = await quiz.save();

    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get quiz statistics
// @route   GET /api/quizzes/:id/stats
// @access  Private (HR only)
export const getQuizStats = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check ownership
    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this quiz stats' });
    }

    const attempts = await Attempt.find({ quizId: req.params.id, status: { $in: ['completed', 'timeout'] } });

    const stats = {
      totalAttempts: attempts.length,
      averageScore: attempts.length > 0
        ? attempts.reduce((sum, att) => sum + att.score, 0) / attempts.length
        : 0,
      averageTime: attempts.length > 0
        ? attempts.reduce((sum, att) => sum + att.timeTakenSeconds, 0) / attempts.length
        : 0,
      completionRate: attempts.length > 0
        ? (attempts.filter(att => att.status === 'completed').length / attempts.length) * 100
        : 0
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
