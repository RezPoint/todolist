export interface Task {
  id: string
  title: string
  description?: string
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  dueDate?: string
  createdAt: string
  updatedAt: string
  projectId?: string
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
}

