// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(6);
  const [targetNumber] = useState(generateTargetNumber());

  function generateTargetNumber() {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleArray(digits);
    return digits.slice(0, 4).join('');
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
    if (guess.length === 4) {
      checkGuess();
    }
  }, [guess]);

  function checkGuess() {
    if (!isValidGuess(guess)) {
      setMessage('Please enter a valid 4-digit number.');
      return;
    }

    setAttemptsLeft(attemptsLeft - 1);

    if (guess === targetNumber) {
      setMessage(`Congratulations! You guessed the correct number: ${targetNumber}.`);
      disableInputAndButton();
    } else if (attemptsLeft === 1) {
      setMessage(`Sorry, you're out of attempts. The correct number was: ${targetNumber}.`);
      disableInputAndButton();
    } else {
      const feedback = provideFeedback(guess);
      setMessage(`Incorrect guess. ${feedback} Attempts left: ${attemptsLeft - 1}.`);
    }
    setGuess('');
  }

  function isValidGuess(guess) {
    return /^\d{4}$/.test(guess);
  }

  function provideFeedback(guess) {
    let feedback = '';
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === targetNumber[i]) {
        feedback += '🟩'; // Correct digit in correct position
      } else if (targetNumber.includes(guess[i])) {
        feedback += '🟨'; // Correct digit in wrong position
      } else {
        feedback += '🟥'; // Incorrect digit
      }
    }
    return feedback;
  }

  function disableInputAndButton() {
    document.getElementById('guessInput').disabled = true;
    document.getElementsByTagName('button')[0].disabled = true;
  }

  function handleInputChange(e) {
    const value = e.target.value;
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setGuess(value);
    }
  }

  return (
    <div className="App">
      <h1>Number Wordle</h1>
      <p>Guess a 4-digit number:</p>
      <div>
        {[1, 2, 3, 4].map((index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={guess[index - 1] || ''}
            onChange={handleInputChange}
          />
        ))}
      </div>
      <button onClick={checkGuess}>Submit Guess</button>
      <p id="message">{message}</p>
    </div>
  );
}

export default App;
