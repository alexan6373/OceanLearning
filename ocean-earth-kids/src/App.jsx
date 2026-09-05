import './styles/App.css';
import LogInPage from './components/LogInPage.jsx';
import Quiz from './components/Quiz.jsx'
import { useAuth } from './components/AuthContext.jsx';

import { useState } from 'react';

function App() {
    const bubbleCount = Array.from({ length: 80});
    const { isLoggedIn, setIsLoggedIn } = useAuth();

    return (
        <main className='ocean-container'>
            <div className='water' />

            <div className='bubbles' >
                {bubbleCount.map((_, index) => (
                    <div 
                        key={index}
                        className='bubble'
                        style={{
                            left: `${Math.random() * 100}%`,
                            height: `${10 + Math.random() * 20}px`,
                            aspectRatio: 1 / 1,
                            animationDelay: `${Math.random() * -6}s`,
                            animationDuration: `${3 + Math.random() * 5}s`,
                        }}
                    />
                ))}
            </div>
            
            {isLoggedIn ?
            <Quiz /> : 
            <LogInPage />}

            <footer className='ocean-floor'>
                <div className='sand'></div>
            </footer>
        </main>
    );
}

export default App