import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Tasks from './components/Tasks';
import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/tasks" element={<Tasks />} />
            </Routes>
        </Router>
    </StrictMode>
);
