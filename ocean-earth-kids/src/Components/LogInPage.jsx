import '../styles/Login.css';
import '../styles/Quiz.css';
import octopusImg from '../assets/octopus.webp';
import turtleImg from '../assets/turtle.webp';
import squidImg from '../assets/squid.webp';
import { useAuth } from './AuthContext.jsx';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js';

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
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userData, setUserData] = useState(null);
    
    useEffect(() => {
        const checkData = async () => {
            const { data, error } = await supabase.auth.getSession();
            setUserData(data);
        }

        checkData();
    }, []);

    async function signUp() {
        const {data, error} = await supabase.auth.signUp({
            email: email,
            password: password
        })

        if (error) {
            console.error(error);
            alert("Error signing up"); 
        } else {
            setUserData(data);
            setIsLoggedIn(true);
        }
    }

    async function logIn() {
        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if (error) {
            console.error(error);
            alert("Error logging in"); 
        } else {
            setUserData(data);
            setIsLoggedIn(true);
        }
    }
    
    return (
        <>
            {logInSignUpPhase === 'log_in' ? (
                <div className='logInPage'>
                    <h1>Welcome to Ocean Learning!</h1> < br/>

                    <p>Sign in to learn about the ocean and its inhabitants through fun quizzes and activities.</p>
                    
                    <input type='email' onChange={(e) => setEmail(e.target.value)} placeholder='Email' required />
                    <input type='password' onChange={(e) => setPassword(e.target.value)} placeholder='Password' required />
                    <button type='submit' onClick={logIn} className='logInButton' >Log In</button>

                    Need to create an account? <br />
                    <button className='signUpButton' onClick={() => setLogInSignUpPhase('sign_up')}>Sign Up</button>
                </div>
            ) : (
                <div className='signUpPage'>
                    <h1>Create an account</h1> < br/>

                    <p>Sign in to learn about the ocean and its inhabitants through fun quizzes and activities.</p>
                    
                    <input type='email' onChange={(e) => setEmail(e.target.value)} placeholder='Email' required />
                    <input type='password' onChange={(e) => setPassword(e.target.value)}  placeholder='Password' required />
                    <button type='submit' onClick={signUp} className='signUpButton' >Sign Up</button>

                    Already have an account? <br />
                    <button className='logInButton' onClick={() => setLogInSignUpPhase('log_in')}>Log In</button>                    {/* </div> */}
                </div>
            )}

            <div className='octopus'>
                <img src={octopusImg} className='octopus-image' />
            </div>

            <div className='turtle'>
                <img src={turtleImg} className='turtle-image'/>
            </div>

            <div className='squid'>
                <img src={squidImg} className='squid-image'/>
            </div>
        </>
    );
}

export default LogInPage;