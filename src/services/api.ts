import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:5000/api';

export const useApi = () => {
  const { getAccessToken } = useAuth();

  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const token = await getAccessToken();
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    return response.json();
  };

  return {
    // Todos
    getTodos: () => fetchWithAuth('/todos'),
    createTodo: (text: string) => fetchWithAuth('/todos', {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),
    updateTodo: (id: string, updates: any) => fetchWithAuth(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),
    deleteTodo: (id: string) => fetchWithAuth(`/todos/${id}`, {
      method: 'DELETE',
    }),

    // User Profile
    getProfile: () => fetchWithAuth('/users/profile'),
    updateProfile: (updates: any) => fetchWithAuth('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

    // File Upload
    getUploadUrl: (fileName: string, fileType: string) => fetchWithAuth('/uploads/presigned-url', {
      method: 'POST',
      body: JSON.stringify({ fileName, fileType }),
    }),
  };
};