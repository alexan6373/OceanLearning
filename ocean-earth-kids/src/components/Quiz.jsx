import '../styles/Quiz.css';
import octopusImg from '../assets/octopus.webp';
import turtleImg from '../assets/turtle.webp';
import fishImg from '../assets/fish.png';
import squidImg from '../assets/squid.webp';
import { useAuth } from './AuthContext.jsx';
import { supabase } from '../lib/supabaseClient.js';

import { useEffect, useState } from 'react';

function Quiz() {
    const { setIsLoggedIn, userData, setUserData } = useAuth();
    
    // Clicking the squid to enable subscribe box
    const [displaySubscribe, setDisplaySubscribe] = useState(false);
    
    const openSubscribeBox = () => {
        setDisplayQuiz(false);
        setDisplayLogOut(false);
        setDisplaySubscribe(prev => !prev);
    }

    const handleSubscribe = (e) => {
        e.preventDefault();
        setDisplaySubscribe(false);
        setDisplayQuiz(false);
    }

    // Clicking the turtle to enable log out box
    const logout = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error(error);
            return;
        }

        setUserData(null);
        setIsLoggedIn(false);
    };
    
    const [displayLogOut, setDisplayLogOut] = useState(false);

    const openLogoutBox = () => {
        setDisplaySubscribe(false);
        setDisplayQuiz(false);
        setDisplayLogOut(prev => !prev);
    }

    const handleLogOut = (e) => {
        e.preventDefault();
        setDisplaySubscribe(false);
        setDisplayQuiz(false);
        setDisplayLogOut(false);
        logout();
    }

    // ---------------------
    // Deals with fish logic
    // ---------------------
    const[numFish, setNumFish] = useState(null);
    const[fishes, setFishes] = useState([]);

    useEffect(() => {
        const loadFish = async () => {
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError || !user) {
                console.error(userError);
                return;
            }

            const { data, dataRetrievalError } = await supabase
                .from('profiles')
                .select('num_fish')
                .eq('user_id', user.id)
                .single();

            if (dataRetrievalError) {
                console.error(dataRetrievalError);
                return;
            }

            setNumFish(data.num_fish);
        };

        loadFish();
    }, []);

    const addFish = async () => {
        const newFish = Array.from({ length: 1}).map(() => ({
            id: numFish,
            bottom: 30 + Math.random() * 60,
            delay: 0,
            duration: 4 + Math.random() * 4
        }));

        const {data, error: addFishError } = await supabase
            .from('profiles')
            .update({ num_fish: numFish + 1})
            .eq('user_id', userData.user.id);
        
        if (addFishError) {
            console.error(addFishError);
            return;
        }

        setNumFish(numFish + 1);
        setFishes([...fishes, ...newFish]);
        
        // setNumFish(numFish + 1);
        // localStorage.setItem('numFish', numFish + 1);
    };

    const removeFish = async () => {
        const {data, error: removeFishError } = await supabase
            .from('profiles')
            .update({ num_fish: Math.max(numFish - 1, 0)})
            .eq('user_id', userData.user.id);
        
        if (removeFishError) {
            console.error(removeFishError);
            return;
        }

        setNumFish(Math.max(numFish - 1, 0));
        setFishes(fishes.slice(0, -1));
        // localStorage.setItem('numFish', Math.max(numFish - 1, 0));
    };
    
    // ---------------------
    // Deals with quiz logic
    // ---------------------

    const[difficulty, setDifficulty] = useState(1);
    const difficultyMap = {
        1: 'Easy',
        2: 'Medium',
        3: 'Hard'
    }

    const[displayQuiz, setDisplayQuiz] = useState(false);
    const [randomQuestion, setRandomQuestion] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [isSubmitted, setSubmitted] = useState(false);

    const startQuiz = () => {
        setDisplaySubscribe(false);
        setDisplayLogOut(false);
        setDisplayQuiz(true);
    }

    // Submits the question
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedAnswer === randomQuestion.correct_answer)
            await addFish();
        else
            await removeFish();

        setSubmitted(true);
    };

    useEffect(() => {
        getQuestion();
    }, [difficulty]);

    // Generates a random question
    const getQuestion = async () => {
        const { data: questionData, error } = await supabase.from('questions')
                                              .select('*')
                                              .eq('difficulty', difficulty);

        if (error) {
            console.error(error);
            return;
        }

        const question = questionData[Math.floor(Math.random() * questionData.length)];

        setRandomQuestion(question);
        if (question.correct_answer === 'A')
            setCorrectAnswer(question.option_a);
        else if (question.correct_answer === 'B')
            setCorrectAnswer(question.option_b);
        else if (question.correct_answer === 'C')
            setCorrectAnswer(question.option_c);
    }
    
    // Accesses the next question
    const nextQuestion = () => {
        setSubmitted(false);
        setRandomQuestion(null);
        getQuestion();
    }

    const displayQuestion = () => {
        if (!randomQuestion) {
            return (
                <div className='question-form'>
                    Loading...
                </div>
            )
        }

        const answerChoices = ['A', 'B', 'C'];

        if (!isSubmitted) {
            return (
                <div className='question-form'>
                    <form onSubmit={handleSubmit}>
                        {randomQuestion.question_text} <br/> <br/>

                        Difficulty: {difficultyMap[randomQuestion.difficulty]} <br/> <br/>

                        {answerChoices.map((answerChoice) => (
                            <button
                                key={answerChoice} className='answer-button'
                                onClick={() => setSelectedAnswer(answerChoice)}>
                                {'    ' + randomQuestion[`option_${answerChoice.toLowerCase()}`]}
                            </button>
                        ))}
                    </form>
                </div>
            )
        } else {
            return (
                <div className='question-form'>
                    {selectedAnswer === randomQuestion.correct_answer ?
                    'CORRECT' : (
                        <>
                            Unforunately that is not correct. <br/> <br/>
                            {'The correct answer is \'' + correctAnswer + '\''}
                        </>
                    )} <br/> <br/>

                    { 'Explanation: ' + randomQuestion.explanation } <br/> <br/>

                    <button className='submit-quiz' onClick={nextQuestion}>Next Question</button>
                </div>
            )
        }
    }

    const difficultyChoices = [1, 2, 3];
    const difficulties = ["Easy", "Medium", "Hard"];
    
    return (
        <div className='animals'>
            <div className='octopus'>
                <img src={octopusImg} className='octopus-image' onClick={startQuiz}/>
            </div>

            <div className='quiz-area'>
                {displayQuiz && displayQuestion()}
            </div>

            {displayLogOut && (
                <div className='logout-box'>
                    <h1>Would you like to log out?</h1>
                    <button className='submit-button' onClick={handleLogOut}>Yes</button> <br/>
                    <button className='submit-button' onClick={() => setDisplayLogOut(false)}>No</button>
                </div>
            )}

            <div className='turtle'>
                <img src={turtleImg} className='turtle-image' onClick={openLogoutBox}/>
            </div>

            {displaySubscribe && (
                <div className='subscribe-box'>
                    <h1>Subscribe to receive fun emails about the environment and sustainability.</h1>

                    <form className='subscribeForm' onSubmit={handleSubscribe}>
                        <input type='email' placeholder='Email' required />
                        <button type='submit' className='submit-button' >Submit</button>
                    </form>
                </div>
            )}

            <div className='squid'>
                <img src={squidImg} className='squid-image' onClick={openSubscribeBox}/>
            </div>

            <div className='fishes'>
                {fishes.map((fish) => (
                    <div
                        key={fish.id} className='fish'
                        style={{
                            fontSize: `50px`,
                            left:`100%`,
                            bottom: `${fish.bottom}%`,
                            animationDelay: `${fish.delay}s`,
                            animationDuration: `${fish.duration}s`
                        }}>
                        <img src={fishImg}/>
                    </div>
                ))}
            </div>

            <div className='scoreboard'>
                { 'Score: ' + numFish } 
                {numFish == 1 ? ' fish' : ' fishes' }
            </div>
            
            <div className='difficulty-button-container'>
                {difficultyChoices.map((difficultyChoice) => (
                    <button
                        key={difficultyChoice}
                        className={`difficulty-button ${difficulty === difficultyChoice ? ' selected' : ''}`}
                        onClick={() => setDifficulty(difficultyChoice)}
                    >
                        { difficulties[difficultyChoice - 1] }
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Quiz;