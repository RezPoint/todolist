import { useTaskStore } from '../store/taskStore';
import { TaskItem } from './TaskItem';

export function TaskList() {
  const { tasks, loading, error } = useTaskStore();

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mx-4 my-2">
        {error}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-gray-500 text-lg">Нет задач</p>
        <p className="text-gray-400 text-sm mt-2">Добавьте первую задачу</p>
      </div>
    );
  }

  const pendingTasks = tasks.filter((t) => t.status === 'PENDING');
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter((t) => t.status === 'DONE');

  return (
    <div className="space-y-6 p-4">
      {pendingTasks.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">⏳ В ожидании</h2>
          <div className="space-y-2">
            {pendingTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {inProgressTasks.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">🔄 В работе</h2>
          <div className="space-y-2">
            {inProgressTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {doneTasks.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">✅ Выполнено</h2>
          <div className="space-y-2">
            {doneTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

