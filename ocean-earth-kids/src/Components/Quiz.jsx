import '.././App.css';
import octopusImg from '../assets/octopus.webp';
import fishImg from '../assets/fish.png';

import { useEffect, useState } from 'react';

import { supabase } from '../lib/supabaseClient';

function Quiz() {
    const[difficulty, setDifficulty] = useState(1);

    const difficultyMap = {
        1: "Easy",
        2: "Medium",
        3: "Hard"
    }

    const[quizOn, toggleQuiz] = useState(false);
    
    // ---------------------
    // Deals with fish logic
    // ---------------------
    const[numFish, setNumFish] = useState(
        Number(localStorage.getItem("numFish")) || 0

        // for (int i = 0; i < numFish; i++) {
        //     addFish();
        // }
    );

    useEffect(() => {
        const restoredFish = Array.from({ length: numFish }).map((_, i) => ({
            id: i,
            bottom: 30 + Math.random() * 60,
            delay: 0,
            duration: 4 + Math.random() * 4
        }));

        setFishes(restoredFish);
    }, []);
    
    const[fishes, setFishes] = useState([]);

    const addFish = () => {
        const newFish = Array.from({ length: 1}).map(() => ({
            id: numFish,
            bottom: 30 + Math.random() * 60,
            delay: 0,
            duration: 4 + Math.random() * 4
        }));

        setFishes([...fishes, ...newFish]);
        setNumFish(numFish + 1);
        localStorage.setItem("numFish", numFish + 1);
    };

    const removeFish = () => {
        setFishes(fishes.slice(0, -1));
        setNumFish(Math.max(numFish - 1, 0));
        localStorage.setItem("numFish", Math.max(numFish - 1, 0));
    };
    
    // ---------------------
    // Deals with quiz logic
    // ---------------------

    const [question, setQuestion] = useState([]);
    const [randomQuestion, setRandomQuestion] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [isSubmitted, setSubmitted] = useState(false);

    // Submits the question
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedAnswer === randomQuestion.correct_answer)
            addFish();
        else
            removeFish();

        setSubmitted(true);
    };

    useEffect(() => {
        getQuestion();
    }, [difficulty]);

    // Generates a random question
    const getQuestion = async () => {
        const { data, error } = await supabase.from('questions')
                                              .select('*')
                                              .eq('difficulty', difficulty);

        if (error) {
            console.error(error);
            return;
        }

        const question = data[Math.floor(Math.random() * data.length)];
        
        setRandomQuestion(question);
        if (question.correct_answer === "A")
            setCorrectAnswer(question.option_a);
        else if (question.correct_answer === "B")
            setCorrectAnswer(question.option_b);
        else if (question.correct_answer === "C")
            setCorrectAnswer(question.option_c);
    }
    
    // Accesses the next question
    const nextQuestion = () => {
        setSubmitted(false);
        setRandomQuestion(null);
        getQuestion();
    }

    const changeAnswer = (e) => {
        setSelectedAnswer(e.target.value);
    }

    const displayQuestion = () => {
        if (!randomQuestion) {
            return (
                <div className='question-form'>
                    Loading...
                </div>
            )
        }

        if (!isSubmitted) {
            return (
                <div className='question-form'>
                    <form onSubmit={handleSubmit}>
                        {randomQuestion.question_text} <br/> <br/>

                        Question Difficulty: {difficultyMap[randomQuestion.difficulty]} <br/> <br/>

                        <button
                            className={"answer-button"}
                            onClick={() => setSelectedAnswer("A")}>
                            {"    " + randomQuestion.option_a}
                        </button> <br/>

                        <button
                            className={"answer-button"}
                            onClick={() => setSelectedAnswer("B")}>
                            {"    " + randomQuestion.option_b}
                        </button> <br/>

                        <button
                            className={"answer-button"}
                            onClick={() => setSelectedAnswer("C")}>
                            {"    " + randomQuestion.option_c}
                        </button> <br/>
                        <br/>
                    </form>
                </div>
            )
        } else {
            return (
                <div className='question-form'>
                    {selectedAnswer === randomQuestion.correct_answer ?
                    "CORRECT" : (
                        <>
                            NO NO NO MY FRIEND <br/> <br/>
                            {"The correct answer is \"" + correctAnswer + "\""}
                        </>
                    )} <br/> <br/>

                    { "Explanation: " + randomQuestion.explanation } <br/> <br/>

                    <button className='submit-quiz' onClick={nextQuestion}>Next Question</button>
                </div>
            )
        }
    }

    return (
        <div className="animals">
            <div className='octopus'>
                <img src={octopusImg} className="octopus-image" onClick={() => toggleQuiz(true)}/>
            </div>

            <div className="quiz-area">
                {quizOn && displayQuestion()}
            </div>

            <div className='fishes'>
                {fishes.map((fish) => (
                    <div
                        key={fish.id}
                        className='fish'
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
                {numFish == 1 ? "Score: " + numFish + " fish" :
                                "Score: " + numFish + " fishes" }
            </div>
            
            <div className='difficulty-button-container'>
                <button
                    className={`difficulty-button ${difficulty === 1 ? " selected" : ""}`}
                    onClick={() => setDifficulty(1)}>Easy</button>
                <button
                    className={`difficulty-button ${difficulty === 2 ? " selected" : ""}`}
                    onClick={() => setDifficulty(2)}>Medium</button>
                <button
                    className={`difficulty-button ${difficulty === 3 ? " selected" : ""}`}
                    onClick={() => setDifficulty(3)}>Hard</button>
            </div>
        </div>
    )
}

export default Quiz;