import express from 'express';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../controllers/todoController';
import { auth } from 'express-oauth2-jwt-bearer';

const router = express.Router();

// Auth middleware
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: 'RS256'
});

// Routes
router.get('/', checkJwt, getTodos);
router.post('/', checkJwt, createTodo);
router.patch('/:id', checkJwt, updateTodo);
router.delete('/:id', checkJwt, deleteTodo);

export default router;