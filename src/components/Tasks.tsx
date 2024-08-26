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

    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false); // State to manage sidebar visibility

    const userName = localStorage.getItem('userName');
    const idn = localStorage.getItem('idn');
    const token = localStorage.getItem('userToken');

    useEffect(() => {
        if (!token || !idn) {
        navigate('/'); // Redirect to login if not authenticated
        } else {
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
        setShowCompleteModal(false);
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
        setShowCancelModal(false);
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
        <div
            className={`fixed inset-y-0 left-0 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:relative md:translate-x-0 w-64 bg-white p-4 shadow-lg flex flex-col border-r border-gray-300 transition-transform duration-300 ease-in-out z-50`}
        >
            <div className="flex justify-center mb-6">
            <img src={opnIcon} alt="Operação Natal Icon" className="w-24" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Bem-vindo, {userName} 👋
            </h1>
            <button
            onClick={() => setShowCompleteModal(true)}
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
            onClick={() => setShowCancelModal(true)}
            className="bg-orange-500 text-white py-2 rounded-md mb-4 hover:bg-orange-600"
            >
            Cancelar Tarefa
            </button>
            <button
            onClick={() => setShowLogoutModal(true)}
            className="bg-red-500 text-white py-2 rounded-md hover:bg-red-600 mt-auto"
            >
            Logout
            </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 md:w-3/4 p-4 md:p-6 flex items-center justify-center">
        {/* Toggle Button for Sidebar */}
        <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden fixed bottom-5 right-5 bg-red-500 text-white p-3 rounded-full shadow-lg z-50 focus:outline-none"
        >
            <span className="material-icons">menu</span>
        </button>

        {!task && (
            <button
            onClick={() => loadTask(token!, idn!)}
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 mx-auto w-full sm:w-3/4 md:w-1/2 lg:w-1/3"
            >
            Receber tarefa
            </button>
        )}

        {activeView === 'task' && task && (
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 text-center w-full sm:w-3/4 md:w-1/2 lg:w-1/3 overflow-wrap break-word">
                <h2 className="text-xl md:text-2xl font-semibold mb-4">Você tem que levar</h2>
                <div className="py-2 md:py-4">
                    <h3 className="text-lg md:text-xl font-medium text-gray-800">
                    <span className="font-normal">{task.product.name}:</span> {task.amount} unidades
                    </h3>
                    <h3 className="text-lg md:text-xl font-medium text-gray-800">
                    <span className="font-normal">Para a Instituição:</span> {task.institution.name}
                    </h3>
                </div>
            </div>
        )}

        {activeView === 'completed' && completedTasks.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-8 w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
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
            <div className="bg-white rounded-lg shadow-lg p-8 w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
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

        {/* Complete Task Modal */}
        {showCompleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Terminou a tarefa? Mesmo? Checou? 🤨</h3>
                <div className="flex justify-end space-x-4">
                <button
                    onClick={handleCompleteTask}
                    className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                >
                    Sim
                </button>
                <button
                    onClick={() => setShowCompleteModal(false)}
                    className="bg-gray-300 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                    Cancelar
                </button>
                </div>
            </div>
            </div>
        )}

        {/* Cancel Task Modal */}
        {showCancelModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Você tem certeza que quer cancelar esta tarefa?</h3>
                <div className="flex justify-end space-x-4">
                <button
                    onClick={handleCancelTask}
                    className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600"
                >
                    Sim
                </button>
                <button
                    onClick={() => setShowCancelModal(false)}
                    className="bg-gray-300 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                    Cancelar
                </button>
                </div>
            </div>
            </div>
        )}
        {/* Logout Modal */}
        {showLogoutModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">Você tem certeza que quer fazer logout?</h3>
                    <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleLogout}
                        className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600"
                    >
                        Sim
                    </button>
                    <button
                        onClick={() => setShowCancelModal(false)}
                        className="bg-gray-300 py-2 px-4 rounded-md hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                    </div>
                </div>
            </div>
        )}
        
        </div>
    );
    };

    export default Tasks;
