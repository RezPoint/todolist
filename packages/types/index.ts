/**
 * Shared types for TodoList project
 */

export interface Task {
  id: string
  title: string
  description?: string | null
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  dueDate?: string | null
  createdAt: string
  updatedAt: string
  projectId?: string | null
  ownerId: number
  orderIndex: number
}

export interface CreateTaskInput {
  title: string
  description?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH'
  dueDate?: string
  projectId?: string
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  status?: 'PENDING' | 'IN_PROGRESS' | 'DONE'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH'
  dueDate?: string
  projectId?: string
}

export interface UserInfo {
  id: number
  firstName?: string
  lastName?: string
  username?: string
  languageCode?: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

