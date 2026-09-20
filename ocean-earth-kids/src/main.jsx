import './styles/index.css';
import App from './App.jsx'
import { AuthProvider } from './Components/AuthContext.jsx'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </StrictMode>,
)
