import { createRoot } from 'react-dom/client';
import App from './app/App';
import './styles/global.css';
import './App.css';
import { AuthProvider } from './app/auth/AuthProvider';
import { ToastProvider } from './components/ui/ToastContext';

createRoot(document.getElementById('root')).render(
    <ToastProvider>
        <AuthProvider>
            <App />
        </AuthProvider>
    </ToastProvider>,
);
