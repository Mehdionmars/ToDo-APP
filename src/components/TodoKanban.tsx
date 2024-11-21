import React, { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CheckSquare, Square, Trash2, GripVertical } from 'lucide-react';
import { io } from 'socket.io-client';
import type { Todo } from '../types/todo';
import { useApi } from '../services/api';
import { SortableTodoItem } from './SortableTodoItem';

interface TodoKanbanProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoKanban: React.FC<TodoKanbanProps> = ({ todos, onToggle, onDelete }) => {
  const [columns, setColumns] = useState({
    todo: {
      title: 'To Do',
      items: todos.filter(t => !t.completed)
    },
    completed: {
      title: 'Completed',
      items: todos.filter(t => t.completed)
    }
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const api = useApi();
  const socket = io('http://localhost:5000');

  useEffect(() => {
    setColumns({
      todo: {
        title: 'To Do',
        items: todos.filter(t => !t.completed)
      },
      completed: {
        title: 'Completed',
        items: todos.filter(t => t.completed)
      }
    });
  }, [todos]);

  useEffect(() => {
    socket.on('todoUpdated', (updatedTodo: Todo) => {
      setColumns(prev => {
        const newColumns = { ...prev };
        const sourceColumn = updatedTodo.completed ? 'todo' : 'completed';
        const destColumn = updatedTodo.completed ? 'completed' : 'todo';

        newColumns[sourceColumn].items = newColumns[sourceColumn].items.filter(
          item => item.id !== updatedTodo.id
        );
        newColumns[destColumn].items.push(updatedTodo);

        return newColumns;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    if (active.id !== over.id) {
      const activeColumn = active.data.current?.column;
      const overColumn = over.data.current?.column;

      if (activeColumn === overColumn) {
        // Same column sorting
        const column = columns[activeColumn as keyof typeof columns];
        const oldIndex = column.items.findIndex(item => item.id === active.id);
        const newIndex = column.items.findIndex(item => item.id === over.id);

        const newItems = arrayMove(column.items, oldIndex, newIndex);
        setColumns({
          ...columns,
          [activeColumn]: {
            ...column,
            items: newItems
          }
        });
      } else {
        // Moving between columns
        const sourceColumn = columns[activeColumn as keyof typeof columns];
        const destColumn = columns[overColumn as keyof typeof columns];
        
        const todoId = active.id as number;
        const completed = overColumn === 'completed';

        try {
          await api.updateTodo(todoId.toString(), { completed });
          socket.emit('updateTodo', { id: todoId, completed });
          onToggle(todoId);
        } catch (error) {
          console.error('Failed to update todo:', error);
        }
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(columns).map(([columnId, column]) => (
          <div key={columnId} className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              {column.title} ({column.items.length})
            </h3>
            <SortableContext
              items={column.items.map(item => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3 min-h-[200px]">
                {column.items.map((todo) => (
                  <SortableTodoItem
                    key={todo.id}
                    todo={todo}
                    column={columnId}
                    onToggle={onToggle}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>
    </DndContext>
  );
};

export default TodoKanban;