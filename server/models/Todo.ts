import mongoose from 'mongoose';

export interface ITodo extends mongoose.Document {
  text: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Todo text is required'],
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true,
  },
}, {
  timestamps: true,
});

// Add indexes for better query performance
todoSchema.index({ userId: 1, completed: 1 });
todoSchema.index({ createdAt: -1 });

export default mongoose.model<ITodo>('Todo', todoSchema);