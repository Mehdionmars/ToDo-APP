import React, { useState, useEffect } from 'react';
import { List, Grid3X3, Kanban, Table2, CheckSquare, Square, Trash2 } from 'lucide-react';
import TodoTable from '../components/TodoTable';
import TodoKanban from '../components/TodoKanban';
import { useApi } from '../services/api';
import type { Todo } from '../types/todo';

type ViewMode = 'list' | 'grid' | 'kanban' | 'table';

const TodoPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const api = useApi();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await api.getTodos();
      setTodos(response);
    } catch (err) {
      setError('Failed to fetch todos');
      console.error('Error fetching todos:', err);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.createTodo(newTodo);
      setTodos(prevTodos => [...prevTodos, response]);
      setNewTodo('');
    } catch (err) {
      setError('Failed to add todo');
      console.error('Error adding todo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTodo = async (id: number) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const response = await api.updateTodo(id.toString(), {
        completed: !todo.completed
      });

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? response : todo
        )
      );
    } catch (err) {
      setError('Failed to update todo');
      console.error('Error updating todo:', err);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await api.deleteTodo(id.toString());
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
      console.error('Error deleting todo:', err);
    }
  };

  const viewOptions = [
    { mode: 'list' as const, icon: List, label: 'List' },
    { mode: 'grid' as const, icon: Grid3X3, label: 'Grid' },
    { mode: 'kanban' as const, icon: Kanban, label: 'Kanban' },
    { mode: 'table' as const, icon: Table2, label: 'Table' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Todo List</h1>
        <div className="flex space-x-2">
          {viewOptions.map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`p-2 rounded-lg flex items-center space-x-2 ${
                viewMode === mode ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
              }`}
              title={label}
            >
              <Icon size={20} />
              <span className="hidden md:inline text-sm">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={addTodo} className="flex space-x-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`px-6 py-2 bg-blue-600 text-white rounded-lg transition-colors ${
            isLoading 
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-blue-700'
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add'}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm">
        {viewMode === 'table' && (
          <TodoTable
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        )}
        {viewMode === 'kanban' && (
          <div className="p-6">
            <TodoKanban
              todos={todos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          </div>
        )}
        {(viewMode === 'list' || viewMode === 'grid') && (
          <div className={`p-6 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}`}>
            {todos.map(todo => (
              <div
                key={todo.id}
                className={`bg-gray-50 rounded-lg p-4 ${
                  todo.completed ? 'bg-opacity-50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className="text-gray-500 hover:text-blue-600"
                    >
                      {todo.completed ? (
                        <CheckSquare className="text-green-500" size={20} />
                      ) : (
                        <Square size={20} />
                      )}
                    </button>
                    <span className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                      {todo.text}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoPage;