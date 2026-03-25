import './App.css'
import Animals from './Components/Animals.jsx'
import { useState } from 'react';

function App() {
  const bubbleCount = Array.from({ length: 80});

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

      <div>
        <Animals />
      </div>

      <footer className='ocean-floor'>
        <div className='sand'>
          
        </div>
        
      </footer>
    </main>
  );
}

export default App

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'

// const [count, setCount] = useState(0)

// return (
//   <>
//     <section id="center">
//       <div className="hero">
//         <img src={heroImg} className="base" width="170" height="179" alt="" />
//         <img src={reactLogo} className="framework" alt="React logo" />
//         <img src={viteLogo} className="vite" alt="Vite logo" />
//       </div>
//       <div>
//         <h1>Get started</h1>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
//         </p>
//       </div>
//       <button
//         className="counter"
//         onClick={() => setCount((count) => count + 1)}
//       >
//         Count is {count}
//       </button>
//     </section>

//     <div className="ticks"></div>

//     <section id="next-steps">
//       <div id="docs">
//         <svg className="icon" role="presentation" aria-hidden="true">
//           <use href="/icons.svg#documentation-icon"></use>
//         </svg>
//         <h2>Documentation</h2>
//         <p>Your questions, answered</p>
//         <ul>
//           <li>
//             <a href="https://vite.dev/" target="_blank">
//               <img className="logo" src={viteLogo} alt="" />
//               Explore Vite
//             </a>
//           </li>
//           <li>
//             <a href="https://react.dev/" target="_blank">
//               <img className="button-icon" src={reactLogo} alt="" />
//               Learn more
//             </a>
//           </li>
//         </ul>
//       </div>
//       <div id="social">
//         <svg className="icon" role="presentation" aria-hidden="true">
//           <use href="/icons.svg#social-icon"></use>
//         </svg>
//         <h2>Connect with us</h2>
//         <p>Join the Vite community</p>
//         <ul>
//           <li>
//             <a href="https://github.com/vitejs/vite" target="_blank">
//               <svg
//                 className="button-icon"
//                 role="presentation"
//                 aria-hidden="true"
//               >
//                 <use href="/icons.svg#github-icon"></use>
//               </svg>
//               GitHub
//             </a>
//           </li>
//           <li>
//             <a href="https://chat.vite.dev/" target="_blank">
//               <svg
//                 className="button-icon"
//                 role="presentation"
//                 aria-hidden="true"
//               >
//                 <use href="/icons.svg#discord-icon"></use>
//               </svg>
//               Discord
//             </a>
//           </li>
//           <li>
//             <a href="https://x.com/vite_js" target="_blank">
//               <svg
//                 className="button-icon"
//                 role="presentation"
//                 aria-hidden="true"
//               >
//                 <use href="/icons.svg#x-icon"></use>
//               </svg>
//               X.com
//             </a>
//           </li>
//           <li>
//             <a href="https://bsky.app/profile/vite.dev" target="_blank">
//               <svg
//                 className="button-icon"
//                 role="presentation"
//                 aria-hidden="true"
//               >
//                 <use href="/icons.svg#bluesky-icon"></use>
//               </svg>
//               Bluesky
//             </a>
//           </li>
//         </ul>
//       </div>
//     </section>

//     <div className="ticks"></div>
//     <section id="spacer"></section>
//   </>
// )