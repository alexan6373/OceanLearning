import '.././App.css';
import octopusImg from '../assets/octopus.webp';
import turtleImg from '../assets/turtle.webp';

function LogInPage() {
    return (
        <div className="login-page">
            <h1>Welcome to Ocean Learning!</h1>

            

            <p>Learn about the ocean and its inhabitants through fun quizzes and activities.</p>
            <div className="login-options">
                <button className="login-button">Log In</button>
                <button className="signup-button">Sign Up</button>
            </div>

            <div className='octopus'>
                <img src={octopusImg} className="octopus-image" onClick={() => toggleQuiz(true)}/>
            </div>

            <div className='turtle'>
                <img src={turtleImg} className="turtle-image" onClick={() => toggleQuiz(true)}/>
            </div>
        </div>
    );
}

export default LogInPage;