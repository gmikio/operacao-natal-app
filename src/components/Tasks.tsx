import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTasks } from '../services/taskService';

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
  const [task, setTask] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const userName = localStorage.getItem('userName');
  const idn = localStorage.getItem('idn'); // Retrieve the idn from localStorage

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token || !idn) {
      navigate('/'); // Redirect to login if not authenticated
    } else {
      loadTask(token, idn);
    }
  }, [navigate, idn]);

  const loadTask = async (token: string, idn: string) => {
    try {
      const data = await fetchTasks(token, idn);
      setTask(data); // Store the single task object
    } catch (err) {
      setError('Failed to fetch tasks. Please try again later.');
    } finally {
      setLoading(false);
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
