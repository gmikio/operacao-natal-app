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
import opnIcon from '../assets/opnIcon.svg';

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
  const [activeView, setActiveView] = useState<'task' | 'completed' | 'ranking'>('task');
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

  const loadTask = async (token: string, idn: string, retry = true) => {
    setLoading(true);
    try {
      const data = await fetchTask(token, idn);
      setTask(data);
      setActiveView('task'); // Set view to 'task' after loading
      setError(''); // Clear any previous errors
    } catch (err) {
      if (retry) {
        setTimeout(() => loadTask(token, idn, false), 1000); // Retry after 1 second
      } else {
        setError('Falha ao buscar tarefas. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async () => {
    try {
      await completeTask(idn!);
      setTask(null);
      setNotification({ message: 'Tarefa completada!', type: 'success' });
    } catch (err) {
      console.error(err);
      setNotification({ message: 'Falha ao completar tarefa.', type: 'error' });
    }
  };

  const handleCancelTask = async () => {
    try {
      await cancelTask(idn!);
      setTask(null);
      setNotification({ message: 'Tarefa cancelada.', type: 'success' });
    } catch (err) {
      console.error(err);
      setNotification({ message: 'Falha ao cancelar tarefa.', type: 'error' });
    }
  };

  const handleGetCompletedTasks = async () => {
    try {
      const tasks = await getCompletedTasks(idn!);
      setCompletedTasks(tasks);
      setActiveView('completed'); // Set view to 'completed'
    } catch (err) {
      console.error(err);
      setNotification({
        message: 'Falha ao buscar tarefas completadas.',
        type: 'error',
      });
    }
  };

  const handleGetRanking = async () => {
    try {
      const data = await getRanking();
      setRanking(data);
      setActiveView('ranking'); // Set view to 'ranking'
    } catch (err) {
      console.error(err);
      setNotification({ message: 'Falha ao buscar ranking.', type: 'error' });
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
      <div className="flex items-center justify-center h-1/2 bg-gray-200">
        <div className="text-gray-600 text-xl">Carregando tarefas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-1/2 bg-gray-200">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white p-4 md:p-4 shadow-lg flex flex-col border-r border-gray-300">
        <div className="flex justify-center mb-6">
          <img src={opnIcon} alt="Operação Natal Icon" className="w-24" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Bem-vindo, {userName} 👋
        </h1>
        <button
          onClick={() => loadTask(token!, idn!)}
          className="bg-blue-500 text-white py-2 rounded-md mb-4 hover:bg-blue-600"
        >
          Receber tarefa
        </button>
        <button
          onClick={handleCompleteTask}
          className="bg-green-500 text-white py-2 rounded-md mb-4 hover:bg-green-600"
        >
          Acabei a tarefa!
        </button>
        <button
          onClick={handleGetCompletedTasks}
          className="bg-yellow-500 text-white py-2 rounded-md mb-4 hover:bg-yellow-600"
        >
          Ver Minhas Tarefas Completadas
        </button>
        <button
          onClick={handleGetRanking}
          className="bg-purple-500 text-white py-2 rounded-md mb-4 hover:bg-purple-600"
        >
          Acessar Ranking
        </button>
        <button
          onClick={handleCancelTask}
          className="bg-orange-500 text-white py-2 rounded-md mb-4 hover:bg-orange-600"
        >
          Cancelar Tarefa
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:w-3/4 p-4 md:p-6">
        {activeView === 'task' && task && (
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 text-center">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Você tem que levar</h2>
            <div className="py-2 md:py-4">
              <h3 className="text-lg md:text-xl font-medium text-gray-800">
                <span className="font-normal">{task.product.name}:</span> {task.amount} unidades
              </h3>
              <h3 className="text-lg md:text-xl font-medium text-gray-800">
                <span className="font-normal">Para uma caixa da Instituição:</span> {task.institution.name}
              </h3>
            </div>
          </div>
        )}

        {activeView === 'completed' && completedTasks.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Tarefas Completadas</h2>
            <ul>
              {completedTasks.map((task) => (
                <li key={task.id} className="border-b border-gray-200 py-2">
                  {task.product.name} - {task.amount} unidades (
                  {task.institution.name})
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeView === 'ranking' && ranking.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Ranking</h2>
            <ul>
              {ranking.map((rank, index) => (
                <li key={index} className="border-b border-gray-200 py-2">
                  {rank.name} - {rank.completedTasks} tarefas
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
