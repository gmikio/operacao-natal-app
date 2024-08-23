import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchTask,
  completeTask,
  getCompletedTasks,
  cancelTask,
  getRanking,
} from '../services/taskService';
import Notification from '../components/Notification';

interface Task {
  id: number;
  userId: string;
  amount: number;
  status: number;
  creationTime: string;
  conclusionTime: string | null;
  cancelTime: string | null;
  productId: number;
  product: {
    id: number;
    name: string;
    initialAmount: number;
    currentAmount: number;
  };
  institutionId: number;
  institution: {
    id: number;
    name: string;
  };
  taskId: number;
  completedTasks: number;
  cancelledTasks: number;
}


const Tasks: React.FC = () => {
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<string>('task');

  const userName = localStorage.getItem('userName');
  const idn = localStorage.getItem('idn');
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    if (!token || !idn) {
      navigate('/'); // Redirect to login if not authenticated
    } else {
      loadTask(token, idn);
    }
  }, [navigate, idn, token]);

  const loadTask = async (token: string, idn: string) => {
    setLoading(true);
    try {
      const data = await fetchTask(token, idn);
      setTask(data); // Store the single task object
    } catch (err) {
      setError('Failed to fetch tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async () => {
    try {
      await completeTask(idn!);
      setTask(null);
      setNotification({ message: 'Task completed!', type: 'success' });
    } catch (err) {
      console.error(err);
      setNotification({ message: 'Failed to complete task.', type: 'error' });
    }
  };

  const handleGetCompletedTasks = async () => {
    try {
      const tasks = await getCompletedTasks(idn!);
      setCompletedTasks(tasks);
      setActiveView('completedTasks');
    } catch (err) {
      console.error(err);
      setNotification({
        message: 'Failed to fetch completed tasks.',
        type: 'error',
      });
    }
  };

  const handleCancelTask = async () => {
    try {
      await cancelTask(idn!);
      setTask(null);
      setNotification({ message: 'Task cancelled.', type: 'success' });
    } catch (err) {
      console.error(err);
      setNotification({ message: 'Failed to cancel task.', type: 'error' });
    }
  };

  const handleGetRanking = async () => {
    try {
      const data = await getRanking();
      setRanking(data);
      setActiveView('ranking');
    } catch (err) {
      console.error(err);
      setNotification({ message: 'Failed to fetch ranking.', type: 'error' });
    }
  };

  const handleViewTask = () => {
    setActiveView('task');
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('idn');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 text-xl">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {userName} 👋
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-2xl font-semibold mb-4">Your Task</h2>
          {task ? (
            <div className="border-b border-gray-200 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-medium text-gray-800">
                  {task.product.name} - {task.amount} units
                </h3>
                <p className="text-gray-600">
                  Institution: {task.institution.name}
                </p>
                <p className="text-gray-600">
                  Status:{' '}
                  {task.status === 1 ? 'Pending' : task.status === 2 ? 'Completed' : 'Cancelled'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-gray-600">No task assigned.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
