import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [guess, setGuess] = useState(['', '', '', '']);
  const [guessHistory, setGuessHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(6);
  const [targetNumber] = useState(generateTargetNumber());
  const [showPopup, setShowPopup] = useState(false);
  const [mathConcept, setMathConcept] = useState('');
  const inputsRef = useRef([]);

  const mathConcepts = [
    "Pythagorean Theorem: a² + b² = c²",
    "Euler's Formula: e^(iπ) + 1 = 0",
    "Area of a Circle: πr²",
    "Fibonacci Sequence: 0, 1, 1, 2, 3, 5, 8...",
    "Quadratic Formula: (-b ± √(b²-4ac)) / 2a",
    "Prime Numbers: 2, 3, 5, 7, 11, 13...",
    "Golden Ratio: φ = (1 + √5) / 2"
  ];

  function generateTargetNumber() {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleArray(digits);
    return digits.slice(0, 4);
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  function checkGuess() {
    const guessString = guess.join('');
    if (!isValidGuess(guessString)) {
      setMessage('Please enter a valid 4-digit number.');
      return;
    }

    setAttemptsLeft(attemptsLeft - 1);
    const feedback = provideFeedback(guessString);
    setGuessHistory([...guessHistory, { guess: guessString, feedback }]);

    if (guessString === targetNumber.join('')) {
      setMessage(`Congratulations! You guessed the correct number: ${guessString}.`);
      showMathConceptPopup(); // Show popup when the guess is correct
      disableInputAndButton();
    } else if (attemptsLeft === 1) {
      setMessage(`Sorry, you're out of attempts. The correct number was: ${targetNumber.join('')}.`);
      disableInputAndButton();
    } else {
      setMessage(`Incorrect guess. Attempts left: ${attemptsLeft - 1}.`);
    }

    setGuess(['', '', '', '']);
    inputsRef.current[0].focus();
  }

  function isValidGuess(guess) {
    return /^\d{4}$/.test(guess);
  }

  function provideFeedback(guessString) {
    let feedback = [];
    for (let i = 0; i < guessString.length; i++) {
      if (parseInt(guessString[i]) === targetNumber[i]) {
        feedback.push({ color: 'green', digit: guessString[i] }); // Correct digit in correct position
      } else if (targetNumber.includes(parseInt(guessString[i]))) {
        feedback.push({ color: 'yellow', digit: guessString[i] }); // Correct digit in wrong position
      } else {
        feedback.push({ color: 'red', digit: guessString[i] }); // Incorrect digit
      }
    }
    return feedback;
  }

  function disableInputAndButton() {
    document.querySelectorAll('.guess-input').forEach(input => input.disabled = true);
    document.getElementsByTagName('button')[0].disabled = true;
  }

  function handleInputChange(index, e) {
    const value = e.target.value;
    if (value.length === 1 && /^\d$/.test(value)) {
      const newGuess = [...guess];
      newGuess[index] = value;
      setGuess(newGuess);
      if (index < 3) {
        inputsRef.current[index + 1].focus(); // Move focus to the next input
      }
    }
  }
  
  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && guess[index] === '' && index > 0) {
      const newGuess = [...guess];
      newGuess[index - 1] = ''; // Clear the previous digit
      setGuess(newGuess);
      inputsRef.current[index - 1].focus(); // Move focus to the previous input
    }
  }

function handleKeypadClick(value) {
  const currentIndex = guess.findIndex((digit) => digit === '');
  if (currentIndex !== -1 && /^\d$/.test(value)) {
    const newGuess = [...guess];
    newGuess[currentIndex] = value;
    setGuess(newGuess);
    if (currentIndex < 3) {
      inputsRef.current[currentIndex + 1].focus(); // Move focus to the next input
    }
  }
}
function handleBackspaceClick() {
  const currentIndex = guess.findLastIndex((digit) => digit !== '');
  if (currentIndex !== -1) {
    const newGuess = [...guess];
    newGuess[currentIndex] = '';
    setGuess(newGuess);
    inputsRef.current[currentIndex].focus(); // Move focus to the current input
  }
}

function showMathConceptPopup() {
  // Pick a random math concept
  const randomConcept = mathConcepts[Math.floor(Math.random() * mathConcepts.length)];
  setMathConcept(randomConcept);
  setShowPopup(true); // Show popup
}

function handleClosePopup() {
  setShowPopup(false);
  // You can redirect or refresh here if necessary
}
  

return (
  <div className="App">
    <h1>Number Wordle</h1>
    <p>Guess a 4-digit number:</p>

    <div className="guess-grid">
      {guessHistory.map((entry, rowIndex) => (
        <div key={rowIndex} className="guess-row">
          {entry.feedback.map((item, colIndex) => (
            <div key={colIndex} className={`guess-cell ${item.color}`}>
              {item.digit}
            </div>
          ))}
        </div>
      ))}

      {/* Current guess */}
      <div className="guess-row">
        {guess.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            className="guess-input"
            value={digit}
            onChange={(e) => handleInputChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            ref={(input) => (inputsRef.current[index] = input)}
          />
        ))}
      </div>
    </div>

    {/* Keypad */}
    <div className="numpad">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <button
          key={num}
          className="numpad-button"
          onClick={() => handleKeypadClick(num.toString())}
        >
          {num}
        </button>
      ))}
      <button className="numpad-button backspace-button" onClick={handleBackspaceClick}>
        ←
      </button>
      <button className="numpad-button" onClick={() => handleKeypadClick("0")}>
        0
      </button>
      <button className="numpad-button enter-button" onClick={checkGuess}>
      ↵ 
      </button>
            {/* Math Concept Popup */}
            {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Math Concept</h2>
            <p>{mathConcept}</p>
            <button onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </div>

    <p id="message">{message}</p>
  </div>
);
}

export default App;
