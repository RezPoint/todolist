import { useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { useTaskStore } from './store/taskStore';
import { TaskList } from './components/TaskList';
import { AddTaskForm } from './components/AddTaskForm';

function App() {
  const { fetchTasks } = useTaskStore();

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">📝 Мои задачи</h1>
        </div>
      </div>
      <AddTaskForm />
      <TaskList />
    </div>
  );
}

export default App;
