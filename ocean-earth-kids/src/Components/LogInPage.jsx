import '../styles/Login.css';
import octopusImg from '../assets/octopus.webp';
import turtleImg from '../assets/turtle.webp';
import { useAuth } from './AuthContext.jsx';

import { useState } from 'react';

function LogInPage() {
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const [logInSignUpPhase, setLogInSignUpPhase] = useState('log_in');

    const handleLogIn = (e) => {
        e.preventDefault();
        setIsLoggedIn(true);
    };

    const handleSignIn = (e) => {
        e.preventDefault();
        setIsLoggedIn(true);
    };

    return (
        <>
            {logInSignUpPhase === 'log_in' ? (
                <div className='logInPage'>
                    <h1>Welcome to Ocean Learning!</h1> < br/>

                    <p>Sign in to learn about the ocean and its inhabitants through fun quizzes and activities.</p>
                    
                    <form className='logInForm' onSubmit={handleLogIn}>
                        <input type='text' placeholder='Username' required />
                        <input type='password' placeholder='Password' required />
                        <button type='submit' className='logInButton' >Log In</button>
                    </form>

                    Need to create an account? <br />
                    <button className='signUpButton' onClick={() => setLogInSignUpPhase('sign_up')}>Sign Up</button>
                </div>
            ) : (
                <div className='signUpPage'>
                    <h1>Create an account</h1> < br/>

                    <p>Sign in to learn about the ocean and its inhabitants through fun quizzes and activities.</p>
                    
                    <form className='signUpForm' onSubmit={handleLogIn}>
                        <input type='text' placeholder='Username' required />
                        <input type='password' placeholder='Password' required />
                        <button type='submit' className='signUpButton' >Sign Up</button>
                    </form>

                    Already have an account? <br />
                    <button className='logInButton' onClick={() => setLogInSignUpPhase('log_in')}>Log In</button>                    {/* </div> */}
                </div>
            )}

            <div className='octopus'>
                <img src={octopusImg} className='octopus-image' onClick={() => toggleQuiz(true)}/>
            </div>

            <div className='turtle'>
                <img src={turtleImg} className='turtle-image' onClick={() => toggleQuiz(true)}/>
            </div>
        </>
    );
}

export default LogInPage;