import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['mcq', 'open'],
    default: 'mcq'
  },
  options: {
    type: [String],
    validate: {
      validator: function (arr) {
        return this.type === 'mcq' ? arr.length >= 2 : true;
      },
      message: 'MCQ questions must have at least 2 options'
    }
  },
  correctAnswer: {
    type: String,
    required: function () {
      return this.type === 'mcq';
    }
  },
  timeLimitSeconds: {
    type: Number,
    default: 60
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true
  },
  jobProfile: {
    type: String,
    required: [true, 'Job profile is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timeLimitMinutes: {
    type: Number,
    required: [true, 'Time limit is required'],
    min: 5,
    max: 60
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  questions: {
    type: [questionSchema],
    validate: {
      validator: function (arr) {
        return arr.length >= 1;
      },
      message: 'Quiz must have at least 1 question'
    }
  }
}, {
  timestamps: true
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
