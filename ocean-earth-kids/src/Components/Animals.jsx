import '.././App.css'
import octopus from '../assets/octopus.webp'
import React, { useState } from 'react';

function Animals() {
    const[quizOn, toggleQuiz] = useState(false);
    const questions = [["Question 1", ["A", "B", "C"], 2],
                       ["Question 2", ["A", "B", "C"], 0],
                       ["Question 3", ["A", "B", "C"], 2],
                       ["Question 4", ["A", "B", "C"], 1],
                       ["Question 5", ["A", "B", "C"], 1],
                       ["Question 6", ["A", "B", "C"], 0],
                       ["Question 7", ["A", "B", "C"], 2],
                       ["Question 8", ["A", "B", "C"], 2]];

    const[questionIndex, setQuestionIndex] = useState(Math.floor(Math.random() * questions.length))
    const[selectedAnswer, setSelectedAnswer] = useState("")

    const[numFish, setNumFish] = useState(1);
    const[fishes, setFishes] = useState([]);
    // counter for fish: correct = more fish, incorrect = less fish

    const changeAnswer = (e) => {
        setSelectedAnswer(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const correctAnswer = questions[questionIndex][2]

        if (selectedAnswer == questions[questionIndex][1][correctAnswer]) {
            addFish();
            alert("Correct!!!!");
        } else {
            removeFish();
            alert("wrong, L bozo");
        }

        setQuestionIndex(Math.floor(Math.random() * questions.length))
        askQuestion();
    };

    const askQuestion = () => {
        // var questionIndex = Math.floor(Math.random() * questions.length)

        return (
            <div className='question'>
                <form onSubmit={handleSubmit}>
                    {questions[questionIndex][0]} <br/>
                    
                    {questions[questionIndex][1].map((option) => (
                        <label key={option}>
                            <input type='radio' name='quiz' value={option} onChange={changeAnswer} required/>
                            {option} <br/>
                        </label>
                    ))}

                    {/* <label>
                        <input type='radio' name='quiz' required/> Correct <br/>
                    </label>
                    <label>
                        <input type='radio' name='quiz' required/> Incorrect <br/>
                    </label> */}

                    <button type="submit">Submit answer</button>
                </form>
            </div>
        )
    }

    const addFish = () => {
        const newFish = Array.from({ length: 1}).map(() => ({
            id: numFish,
            bottom: 30 + Math.random() * 60,
            delay: 0,
            duration: 4 + Math.random() * 4
        }));

        setFishes([...fishes, ...newFish]);
        setNumFish(numFish + 1)
    };

    const removeFish = () => {
        setFishes(fishes.slice(0, -1));
        setNumFish(Math.max(numFish - 1, 0))
    };

    return (
        <div className="animals">
            <div className='octopus'>
                <img src={octopus} className="octopus-image" onClick={() => toggleQuiz(true)}/>
            </div>

            <div>
                {quizOn && askQuestion()}
            </div>
{/*             
            <div className='octopus2'>
                <img src={octopus} className="octopus-image" onClick={() => removeFish()}/>
            </div> */}

            <div className='fishes'>
                {numFish}
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
                        🐟
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Animals