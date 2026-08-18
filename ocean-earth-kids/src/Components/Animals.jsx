import '.././App.css'
import octopus from '../assets/octopus.webp'
import fish_img from '../assets/fish.png'

import { useEffect, useState } from 'react'

import { supabase } from '../lib/supabaseClient'

function Animals() {
    const[quizOn, toggleQuiz] = useState(false);
    // const questions = [
    //     {
    //         id: 1,
    //         text: "What is the 'Great Pacific Garbage Patch' mostly made of?",
    //         options: ["Sunken ships", "Plastic waste", "Oil spills"],
    //         correct: "Plastic waste"
    //     },
    //     {
    //         id: 2,
    //         text: "Which of these helps protect coastlines from storms and filtering water?",
    //         options: ["Mangrove forests", "Concrete piers", "Speed boats"],
    //         correct: "Mangrove forests"
    //     },
    //     {
    //         id: 3,
    //         text: "What happens when coral reefs get too stressed by warm water?",
    //         options: ["They turn blue", "They grow faster", "They turn white (bleaching)"],
    //         correct: "They turn white (bleaching)"
    //     },
    //     {
    //         id: 4,
    //         text: "Which animal is famous for keeping kelp forests healthy by eating sea urchins?",
    //         options: ["Sea Otter", "Seahorse", "Great White Shark"],
    //         correct: "Sea Otter"
    //     },
    //     {
    //         id: 5,
    //         text: "What are 'Ghost Nets' in the ocean?",
    //         options: ["Transparent jellyfish", "Abandoned fishing nets", "Fog over the water"],
    //         correct: "Abandoned fishing nets"
    //     },
    //     {
    //         id: 6,
    //         text: "Why are microplastics dangerous to ocean animals?",
    //         options: ["They are too salty", "They are mistaken for food", "They block the sun"],
    //         correct: "They are mistaken for food"
    //     },
    //     {
    //         id: 7,
    //         text: "Which of these is a way to reduce ocean plastic?",
    //         options: ["Using reusable bags", "Throwing trash in rivers", "Buying more bottled water"],
    //         correct: "Using reusable bags"
    //     },
    //     {
    //         id: 8,
    //         text: "How much of the Earth's oxygen is produced by the ocean (phytoplankton)?",
    //         options: ["About 10%", "About 50%", "About 90%"],
    //         correct: "About 50%"
    //     }
    // ];

    // const[questionIndex, setQuestionIndex] = useState(Math.floor(Math.random() * questions.length))
    
    // counter for fish: correct = more fish, incorrect = less fish
    const[numFish, setNumFish] = useState(0);
    const[fishes, setFishes] = useState([]);

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
    
    const [question, setQuestion] = useState([]);
    const [randomQuestion, setRandomQuestion] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [isSubmitted, setSubmitted] = useState(false);
    
    const changeAnswer = (e) => {
        setSelectedAnswer(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedAnswer === randomQuestion.correct_answer) {
            addFish();
            // alert("Good job. That is correct.");
        } else {
            removeFish();
            // alert("Sorry, the correct answer is option " + correctAnswer);
        }

        setSubmitted(true);

        // setQuestionIndex(Math.floor(Math.random() * questions.length))
        // getQuestion();
        // askQuestion();
    };

    useEffect(() => {
        getQuestion();
    }, [])

    const getQuestion = async () => {
        const { data, error } = await supabase.from('questions').select('*')

        if (error) {
            console.error(error);
            return;
        }

        const question = data[Math.floor(Math.random() * data.length)];
        
        setRandomQuestion(question);
        if (question.correctAnswer == "A")
            setCorrectAnswer(question.option_a);
        else if (question.correctAnswer == "A")
            setCorrectAnswer(question.option_b);
        else
            setCorrectAnswer(question.option_c);
    }
    
    const nextQuestion = () => {
        setSubmitted(false);
        setRandomQuestion(null);
        getQuestion();
        // askQuestion();
    }

    const askQuestion = () => {
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
                <img src={octopus} className="octopus-image" onClick={() => toggleQuiz(true)}/>
            </div>

            <div className="quiz-area">
                {quizOn && askQuestion()}
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
                        <img src={fish_img}/>
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

export default Animals