import '../styles/Login.css';
import '../styles/Quiz.css';
import octopusImg from '../assets/octopus.webp';
import turtleImg from '../assets/turtle.webp';
import squidImg from '../assets/squid.webp';
import { useAuth } from './AuthContext.jsx';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js';

function LogInPage() {
    const { setIsLoggedIn, userData, setUserData } = useAuth();
    const [authMode, setAuthMode] = useState('log_in');
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    useEffect(() => {
        const checkData = async () => {
            const { data, error } = await supabase.auth.getSession();
            setUserData(data);
        }

        checkData();
    }, []);

    async function signUp() {
        const {data, error: signUpError} = await supabase.auth.signUp({
            email: email,
            password: password
        })

        if (signUpError) {
            console.error(signUpError);
            return;
        }

        const { error: profileCreationError } = await supabase
            .from('profiles')
            .insert({
                user_id: data.user.id,
                num_fish: 0
            });

        if (profileCreationError) {
            console.error(profileCreationError);
            return;
        }

        setUserData(data);
        setIsLoggedIn(true);
    }

    async function logIn() {
        const {data, logInError} = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if (logInError) {
            console.error(logInError);
            return;
        }

        setUserData(data);
        setIsLoggedIn(true);
    }
    
    return (
        <>
            <div className='auth-page'>
                {authMode === 'log_in' ? (
                    <>
                        <h1>Welcome to Ocean Learning!</h1> < br/>
                        <p>Sign in to learn about the ocean and its inhabitants through fun quizzes and activities.</p>    
                    </>
                ) : (
                    <>
                        <h1>Create an account</h1> < br/>
                        <p>Enter an email and password to make an account.</p>    
                    </>
                )}

                <input type='email' onChange={(e) => setEmail(e.target.value)} placeholder='Email' required />
                <input type='password' onChange={(e) => setPassword(e.target.value)}  placeholder='Password' required />
                
                {authMode === 'log_in' ? (
                    <>
                        <button type='submit' onClick={logIn} className='logInButton' >Log In</button>
                        Need to create an account? <br />
                        <button className='signUpButton' onClick={() => setAuthMode('sign_up')}>Sign Up</button>
                    </>
                ) : (
                    <>
                        <button type='submit' onClick={signUp} className='signUpButton' >Sign Up</button>
                        Already have an account? <br />
                        <button className='logInButton' onClick={() => setAuthMode('log_in')}>Log In</button>                    {/* </div> */}
                    </>
                )}
            </ div>

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