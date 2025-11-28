import { create } from 'zustand';
import type { Task, CreateTaskInput, UpdateTaskInput } from '../lib/api';
import { api } from '../lib/api';

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (data: CreateTaskInput) => Promise<void>;
  updateTask: (taskId: string, data: UpdateTaskInput) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const tasks = await api.getTasks();
      set({ tasks, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch tasks',
        loading: false,
      });
    }
  },

  createTask: async (data) => {
    set({ loading: true, error: null });
    try {
      const newTask = await api.createTask(data);
      set((state) => ({
        tasks: [newTask, ...state.tasks],
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create task',
        loading: false,
      });
      throw error;
    }
  },

  updateTask: async (taskId, data) => {
    set({ loading: true, error: null });
    try {
      const updatedTask = await api.updateTask(taskId, data);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? updatedTask : task
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update task',
        loading: false,
      });
      throw error;
    }
  },

  deleteTask: async (taskId) => {
    set({ loading: true, error: null });
    try {
      await api.deleteTask(taskId);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete task',
        loading: false,
      });
      throw error;
    }
  },
}));

