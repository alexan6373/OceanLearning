import '.././App.css';
import octopusImg from '../assets/octopus.webp';
import fishImg from '../assets/fish.png';

import { useEffect, useState } from 'react';

import { supabase } from '../lib/supabaseClient';

function Animals() {
    const[quizOn, toggleQuiz] = useState(false);
    
    // Counter for fish: correct = more fish, incorrect = less fish
    const[numFish, setNumFish] = useState(
        Number(localStorage.getItem("numFish")) || 0
    );
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
    }, [])

    // Generates a random question
    const getQuestion = async () => {
        const { data, error } = await supabase.from('questions').select('*')

        if (error) {
            console.error(error);
            return;
        }

        const question = data[Math.floor(Math.random() * data.length)];
        
        setRandomQuestion(question);
        if (question.correctAnswer === "A")
            setCorrectAnswer(question.option_a);
        else if (question.correctAnswer === "B")
            setCorrectAnswer(question.option_b);
        else
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
                <div className='question'>
                    Loading...
                </div>
            )
        }

        if (!isSubmitted) {
            return (
                <div className='question'>
                    <form onSubmit={handleSubmit}>
                        {randomQuestion.question_text} <br/> <br/>

                        <label>
                            <input type='radio' name='quiz' value={"A"} onChange={changeAnswer} required/>
                            {"    " + randomQuestion.option_a} <br/>
                            <input type='radio' name='quiz' value={"B"} onChange={changeAnswer} required/>
                            {"    " + randomQuestion.option_b} <br/>
                            <input type='radio' name='quiz' value={"C"} onChange={changeAnswer} required/>
                            {"    " + randomQuestion.option_c} <br/>
                        </label>

                        <br/>

                        <button type="submit">Submit answer</button>
                    </form>
                </div>
            )
        } else {
            return (
                <div className='question'>
                    {selectedAnswer === randomQuestion.correct_answer ?
                    "CORRECT" : (
                        <>
                            NO NO NO MY FRIEND <br/> <br/>
                            {"The correct answer is \"" + correctAnswer + "\""}
                        </>
                    )} <br/> <br/>

                    { "Explanation: " + randomQuestion.explanation } <br/> <br/>

                    <button onClick={nextQuestion}>Next Question</button>
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
        </div>
    )
}

export default Animals;