// App.js
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [guess, setGuess] = useState(['', '', '', '']);
  const [guessHistory, setGuessHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(6);
  const [targetNumber] = useState(generateTargetNumber());
  const inputsRef = useRef([]);

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

  useEffect(() => {
    if (guess.every(digit => digit !== '')) {
      checkGuess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps,
  }, [guess]);

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
      disableInputAndButton();
    } else if (attemptsLeft === 1) {
      setMessage(`Sorry, you're out of attempts. The correct number was: ${targetNumber.join('')}.`);
      disableInputAndButton();
    } else {
      setMessage(`Incorrect guess. ${feedback} Attempts left: ${attemptsLeft - 1}.`);
    }
  
    setGuess(['', '', '', '']);
    inputsRef.current[0].focus();
  }
  

  function isValidGuess(guess) {
    return /^\d{4}$/.test(guess);
  }

  function provideFeedback(guessString) {
    let feedback = '';
    for (let i = 0; i < guessString.length; i++) {
      if (parseInt(guessString[i]) === targetNumber[i]) {
        feedback += '🟩'; // Correct digit in correct position
      } else if (targetNumber.includes(parseInt(guessString[i]))) {
        feedback += '🟨'; // Correct digit in wrong position
      } else {
        feedback += '🟥'; // Incorrect digit
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
        inputsRef.current[index + 1].focus();
      }
    } else if (value.length === 0) {
      const newGuess = [...guess];
      newGuess[index] = '';
      setGuess(newGuess);
      if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }
  }

  return (
    <div className="App">
      <h1>Number Wordle</h1>
      <p>Guess a 4-digit number:</p>
      <div className="guess-container">
        {guess.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            className="guess-input"
            value={digit}
            onChange={(e) => handleInputChange(index, e)}
            ref={(input) => inputsRef.current[index] = input}
          />
        ))}
      </div>
      <button onClick={checkGuess}>Submit Guess</button>
      <p id="message">{message}</p>
    <div className="guess-history">
      {guessHistory.map((entry, index) => (
        <div key={index} className="guess-entry">
          <span>{entry.guess}</span> - <span>{entry.feedback}</span>
        </div>
      ))}
    </div>
    </div>
  );
}

export default App;
