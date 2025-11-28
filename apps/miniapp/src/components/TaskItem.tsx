import type { Task } from '../types'
import { useTaskStore } from '../store/taskStore'

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { updateTask, deleteTask } = useTaskStore();

  const handleToggleStatus = async () => {
    const newStatus =
      task.status === 'DONE' ? 'PENDING' : task.status === 'PENDING' ? 'IN_PROGRESS' : 'DONE';
    await updateTask(task.id, { status: newStatus });
  };

  const handleDelete = async () => {
    if (confirm('Удалить задачу?')) {
      await deleteTask(task.id);
    }
  };

  const statusColors: Record<Task['status'], string> = {
    PENDING: 'bg-yellow-50 border-yellow-200',
    IN_PROGRESS: 'bg-blue-50 border-blue-200',
    DONE: 'bg-green-50 border-green-200',
  }

  const statusIcons: Record<Task['status'], string> = {
    PENDING: '⏳',
    IN_PROGRESS: '🔄',
    DONE: '✅',
  }

  return (
    <div
      className={`border rounded-lg p-4 ${statusColors[task.status]} transition-all hover:shadow-md`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">{statusIcons[task.status]}</span>
            <h3 className="font-medium text-gray-900">{task.title}</h3>
          </div>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          )}
          {task.dueDate && (
            <p className="text-xs text-gray-500 mt-2">
              📅 {new Date(task.dueDate).toLocaleDateString('ru-RU')}
            </p>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={handleToggleStatus}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {task.status === 'DONE' ? '↩️' : '✓'}
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

