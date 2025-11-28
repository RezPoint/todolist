import fetch from 'node-fetch'
import { env } from '../config/env'
import type { Task, CreateTaskInput, UpdateTaskInput } from '../types'

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = env.BACKEND_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & {
      headers?: Record<string, string>;
      userId: string;
      username?: string;
      firstName?: string;
      lastName?: string;
      languageCode?: string;
    }
  ): Promise<T> {
    const { userId, username, firstName, lastName, languageCode, headers, ...fetchOptions } = options;

    try {
      const url = `${this.baseUrl}${endpoint}`;
      const method = fetchOptions.method || 'GET';
      const hasBody = fetchOptions.body !== undefined && fetchOptions.body !== null;
      
      console.log(`API Request: ${method} ${url}${hasBody ? ' (with body)' : ''}`);
      
      // Only set Content-Type for requests with body
      const requestHeaders: Record<string, string> = {
        'x-user-id': userId
      };
      
      if (username) requestHeaders['x-user-username'] = username;
      if (firstName) requestHeaders['x-user-first-name'] = firstName;
      if (lastName) requestHeaders['x-user-last-name'] = lastName;
      if (languageCode) requestHeaders['x-user-language-code'] = languageCode;
      
      if (headers) {
        Object.assign(requestHeaders, headers);
      }
      
      if (hasBody) {
        requestHeaders['Content-Type'] = 'application/json';
      }
      
      const response = await fetch(url, {
        ...fetchOptions,
        headers: requestHeaders
      } as any);

      console.log(`API Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText);
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        console.error(`API Error: ${errorMessage}`);
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json() as T;
        console.log(`API Success:`, data);
        return data;
      } else {
        const text = await response.text();
        console.log(`API Success (text):`, text);
        return { success: true } as T;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`API request failed: ${error.message}`);
        console.error(`Stack:`, error.stack);
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  }

  async getTasks(userId: string, userInfo?: { username?: string; firstName?: string; lastName?: string; languageCode?: string }): Promise<Task[]> {
    return this.request<Task[]>('/api/tasks', {
      method: 'GET',
      userId,
      ...userInfo
    });
  }

  async createTask(
    userId: string,
    data: CreateTaskInput,
    userInfo?: { username?: string; firstName?: string; lastName?: string; languageCode?: string }
  ): Promise<Task> {
    return this.request<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
      userId,
      ...userInfo
    });
  }

  async updateTask(
    userId: string,
    taskId: string,
    data: UpdateTaskInput,
    userInfo?: { username?: string; firstName?: string; lastName?: string; languageCode?: string }
  ): Promise<Task> {
    return this.request<Task>(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      userId,
      ...userInfo
    });
  }

  async deleteTask(
    userId: string,
    taskId: string,
    userInfo?: { username?: string; firstName?: string; lastName?: string; languageCode?: string }
  ): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/tasks/${taskId}`, {
      method: 'DELETE',
      userId,
      ...userInfo
    });
  }
}

export const api = new ApiClient();

