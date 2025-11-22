import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionIndex: {
    type: Number,
    required: true
  },
  selectedOption: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    default: false
  }
});

const attemptSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  candidateName: {
    type: String,
    required: [true, 'Candidate name is required'],
    trim: true
  },
  candidateEmail: {
    type: String,
    required: [true, 'Candidate email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  answers: [answerSchema],
  score: {
    type: Number,
    default: 0
  },
  timeTakenSeconds: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'timeout'],
    default: 'in-progress'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  submittedAt: {
    type: Date
  }
}, {
  timestamps: true
});

const Attempt = mongoose.model('Attempt', attemptSchema);

export default Attempt;
