export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  userId?: string;
  createdAt?: Date;
}