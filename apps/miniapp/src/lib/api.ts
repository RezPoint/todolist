import axios from 'axios';
import WebApp from '@twa-dev/sdk';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
  dueDate: string | null;
  priority: number;
  projectId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskInput = {
  title: string;
  description?: string;
  dueDate?: string;
  projectId?: string;
  priority?: number;
};

export type UpdateTaskInput = Partial<CreateTaskInput> & {
  status?: 'PENDING' | 'IN_PROGRESS' | 'DONE';
};

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = BACKEND_URL;
  }

  private getHeaders() {
    const initData = WebApp.initData;
    const user = WebApp.initDataUnsafe?.user;

    if (!user) {
      throw new Error('User not authenticated');
    }

    return {
      'Content-Type': 'application/json',
      'x-user-id': String(user.id),
      'x-user-username': user.username,
      'x-user-first-name': user.first_name,
      'x-user-last-name': user.last_name,
      'x-user-language-code': user.language_code,
      ...(initData && { 'x-telegram-init-data': initData }),
    };
  }

  async getTasks(): Promise<Task[]> {
    const response = await axios.get<Task[]>(`${this.baseURL}/api/tasks`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async createTask(data: CreateTaskInput): Promise<Task> {
    const response = await axios.post<Task>(`${this.baseURL}/api/tasks`, data, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async updateTask(taskId: string, data: UpdateTaskInput): Promise<Task> {
    const response = await axios.patch<Task>(
      `${this.baseURL}/api/tasks/${taskId}`,
      data,
      {
        headers: this.getHeaders(),
      }
    );
    return response.data;
  }

  async deleteTask(taskId: string): Promise<{ success: boolean }> {
    const response = await axios.delete<{ success: boolean }>(
      `${this.baseURL}/api/tasks/${taskId}`,
      {
        headers: this.getHeaders(),
      }
    );
    return response.data;
  }
}

export const api = new ApiClient();

