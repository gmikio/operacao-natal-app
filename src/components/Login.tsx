import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const Login: React.FC = () => {
  const [idn, setIdn] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const success = await login({ idn, userName });

    if (success) {
      navigate('/tasks'); // Redirect to tasks page on successful login
    } else {
      alert('Login failed. Please check your credentials and try again.');
    }

    console.log({ idn, userName });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <div className="mb-4">
          <label htmlFor="idn" className="block text-sm font-medium text-gray-700">
            ID Number
          </label>
          <input
            type="text"
            id="idn"
            value={idn}
            onChange={(e) => setIdn(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
