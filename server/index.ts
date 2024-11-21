import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db';
import todoRoutes from './routes/todos';
import userRoutes from './routes/users';
import uploadRoutes from './routes/uploads';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Socket.IO
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('updateTodo', (todo) => {
    socket.broadcast.emit('todoUpdated', todo);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Routes
app.use('/api/todos', todoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/uploads', uploadRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});