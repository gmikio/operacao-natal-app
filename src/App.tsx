import { useState, useEffect  } from 'react'
import { useNavigate } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const App: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/'); // Redirect to login if not logged in
    }
  }, [navigate]);
  
  return (
    <div>
      {/* Your main app content */}
      <h1>Welcome to the Tasks page!</h1>
    </div>
  );
};

export default App
