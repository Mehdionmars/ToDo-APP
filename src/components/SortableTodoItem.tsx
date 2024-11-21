import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CheckSquare, Square, Trash2, GripVertical } from 'lucide-react';
import type { Todo } from '../types/todo';

interface SortableTodoItemProps {
  todo: Todo;
  column: string;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const SortableTodoItem: React.FC<SortableTodoItemProps> = ({
  todo,
  column,
  onToggle,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: todo.id,
    data: {
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div {...attributes} {...listeners}>
            <GripVertical size={20} className="text-gray-400 cursor-grab" />
          </div>
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
          <span className={todo.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
            {todo.text}
          </span>
        </div>
        <button
          onClick={() => onDelete(todo.id)}
          className="text-gray-400 hover:text-red-600"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};