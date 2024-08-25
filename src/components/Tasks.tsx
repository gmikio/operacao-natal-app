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
}

const Tasks: React.FC = () => {
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);

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

  const handleGetCompletedTasks = async () => {
    try {
      const tasks = await getCompletedTasks(idn!);
      setCompletedTasks(tasks);
    } catch (err) {
      console.error(err);
      setNotification({
        message: 'Failed to fetch completed tasks.',
        type: 'error',
      });
    }
  };

  const handleGetRanking = async () => {
    try {
      const data = await getRanking();
      setRanking(data);
    } catch (err) {
      console.error(err);
      setNotification({ message: 'Failed to fetch ranking.', type: 'error' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('idn');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="text-gray-600 text-xl">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white p-4 shadow-lg flex flex-col border-r border-gray-300">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome, {userName} 👋
        </h1>
        <button
          onClick={() => {
            if (token && idn) {
              loadTask(token, idn);
            } else {
              console.error('Token or idn is missing!');
            }
          }}
          className="bg-blue-500 text-white py-2 rounded-md mb-4"
        >
          Receive Task
        </button>
        <button
          onClick={handleCompleteTask}
          className="bg-green-500 text-white py-2 rounded-md mb-4"
        >
          Task Completed
        </button>
        <button
          onClick={handleGetCompletedTasks}
          className="bg-yellow-500 text-white py-2 rounded-md mb-4"
        >
          Get Completed Tasks
        </button>
        <button
          onClick={handleCancelTask}
          className="bg-orange-500 text-white py-2 rounded-md mb-4"
        >
          Cancel Task
        </button>
        <button
          onClick={handleGetRanking}
          className="bg-purple-500 text-white py-2 rounded-md mb-4"
        >
          Get Ranking
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 rounded-md"
        >
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {task && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Your Task</h2>
            <div className="py-4">
              <h3 className="text-xl font-medium text-gray-800">
                {task.product.name} ({task.product.initialAmount}kg) - {task.amount} units
              </h3>
              <p className="text-gray-600">
                Institution: {task.institution.name}
              </p>
              <p className="text-gray-600">
                Status:{' '}
                {task.status === 1
                  ? 'Pending'
                  : task.status === 2
                  ? 'Completed'
                  : 'Cancelled'}
              </p>
            </div>
          </div>
        )}

        {!task && (
          <div className="text-gray-500 text-center">
            No active task. Please receive a task.
          </div>
        )}

        {completedTasks.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mt-6">
            <h2 className="text-2xl font-semibold mb-4">Completed Tasks</h2>
            <ul>
              {completedTasks.map((task) => (
                <li key={task.id} className="border-b border-gray-200 py-2">
                  {task.product.name} - {task.amount} units (
                  {task.institution.name})
                </li>
              ))}
            </ul>
          </div>
        )}

        {ranking.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mt-6">
            <h2 className="text-2xl font-semibold mb-4">Ranking</h2>
            <ul>
              {ranking.map((rank, index) => (
                <li key={index} className="border-b border-gray-200 py-2">
                  {rank.name} - {rank.completedTasks} tasks
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default Tasks;
