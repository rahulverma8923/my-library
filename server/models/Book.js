const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Book must belong to a user'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
      maxlength: [150, 'Author name cannot exceed 150 characters']
    },
    coverImage: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      trim: true,
      default: 'English'
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      default: 'Fiction'
    },
    status: {
      type: String,
      enum: {
        values: ['Not Started', 'Reading', 'Finished'],
        message: '{VALUE} is not a valid reading status'
      },
      default: 'Not Started',
      index: true
    },
    progress: {
      type: Number,
      min: [0, 'Progress cannot be less than 0%'],
      max: [100, 'Progress cannot exceed 100%'],
      default: 0
    },
    notes: {
      type: String,
      default: '',
      maxlength: [10000, 'Notes cannot exceed 10,000 characters']
    },
    isFavourite: {
      type: Boolean,
      default: false,
      index: true
    },
    tags: {
      type: [String],
      default: []
    },
    startedAt: {
      type: Date,
      default: null
    },
    finishedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Synchronize status, progress, and date timestamps before save
bookSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === 'Finished') {
      this.progress = 100;
      if (!this.finishedAt) {
        this.finishedAt = new Date();
      }
    } else if (this.status === 'Not Started') {
      this.progress = 0;
      this.finishedAt = null;
    } else if (this.status === 'Reading') {
      if (!this.startedAt) {
        this.startedAt = new Date();
      }
      this.finishedAt = null;
      if (this.progress === 100) {
        this.progress = 50; // default to midway if changing from finished back to reading without setting progress
      }
    }
  }

  // If progress is set to 100 manually
  if (this.isModified('progress')) {
    if (this.progress === 100 && this.status !== 'Finished') {
      this.status = 'Finished';
      if (!this.finishedAt) {
        this.finishedAt = new Date();
      }
    } else if (this.progress > 0 && this.progress < 100 && this.status === 'Not Started') {
      this.status = 'Reading';
      if (!this.startedAt) {
        this.startedAt = new Date();
      }
    }
  }

  next();
});

// Compound indexes for optimal scoped queries
bookSchema.index({ userId: 1, createdAt: -1 });
bookSchema.index({ userId: 1, status: 1 });
bookSchema.index({ userId: 1, category: 1 });
bookSchema.index({ userId: 1, language: 1 });
bookSchema.index({ userId: 1, isFavourite: 1 });
bookSchema.index(
  { userId: 1, title: 'text', author: 'text', category: 'text', tags: 'text' },
  { default_language: 'none', language_override: 'none' }
);

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;

