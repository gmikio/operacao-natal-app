import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

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
      <h1>Bem vindo ao OPN Tasks!</h1>
    </div>
  );
};

export default App;
