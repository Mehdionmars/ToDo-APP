import React from 'react';
import { CheckSquare, Square, Trash2, GripVertical } from 'lucide-react';
import type { Todo } from '../types/todo';

interface TodoTableProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoTable: React.FC<TodoTableProps> = ({ todos, onToggle, onDelete }) => {
  const handleDragStart = (e: React.DragEvent, todo: Todo) => {
    e.dataTransfer.setData('text/plain', todo.id.toString());
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const row = (e.target as HTMLElement).closest('tr');
    if (row) {
      row.classList.add('bg-blue-50');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const row = (e.target as HTMLElement).closest('tr');
    if (row) {
      row.classList.remove('bg-blue-50');
    }
  };

  const handleDrop = (e: React.DragEvent, targetTodo: Todo) => {
    e.preventDefault();
    const row = (e.target as HTMLElement).closest('tr');
    if (row) {
      row.classList.remove('bg-blue-50');
    }

    const sourceId = parseInt(e.dataTransfer.getData('text/plain'));
    const sourceTodo = todos.find(t => t.id === sourceId);
    
    if (sourceTodo && sourceTodo.completed !== targetTodo.completed) {
      onToggle(sourceId);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-10"></th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {todos.map((todo) => (
            <tr
              key={todo.id}
              draggable
              onDragStart={(e) => handleDragStart(e, todo)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, todo)}
              className="hover:bg-gray-50 cursor-move"
            >
              <td className="px-2">
                <GripVertical size={20} className="text-gray-400" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => onToggle(todo.id)}
                  className="text-gray-500 hover:text-blue-600"
                >
                  {todo.completed ? (
                    <CheckSquare className="text-green-500" size={20} />
                  ) : (
                    <Square size={20} />
                  )}
                </button>
              </td>
              <td className="px-6 py-4">
                <span className={todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}>
                  {todo.text}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(todo.id).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button
                  onClick={() => onDelete(todo.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodoTable;