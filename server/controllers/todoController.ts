import { Request, Response } from 'express';
import Todo from '../models/Todo';

export const getTodos = async (req: Request, res: Response) => {
  try {
    const userId = req.auth?.payload.sub;
    const todos = await Todo.find({ userId })
      .sort({ createdAt: -1 })
      .select('text completed createdAt updatedAt');

    res.json(todos);
  } catch (error) {
    console.error('Error in getTodos:', error);
    res.status(500).json({ message: 'Error fetching todos' });
  }
};

export const createTodo = async (req: Request, res: Response) => {
  try {
    const userId = req.auth?.payload.sub;
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ message: 'Todo text is required' });
    }

    const todo = new Todo({
      text: text.trim(),
      userId,
    });

    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    console.error('Error in createTodo:', error);
    res.status(500).json({ message: 'Error creating todo' });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const userId = req.auth?.payload.sub;
    const { id } = req.params;
    const updates = req.body;

    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    console.error('Error in updateTodo:', error);
    res.status(500).json({ message: 'Error updating todo' });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const userId = req.auth?.payload.sub;
    const { id } = req.params;

    const todo = await Todo.findOneAndDelete({ _id: id, userId });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error in deleteTodo:', error);
    res.status(500).json({ message: 'Error deleting todo' });
  }
};