import React, { useState, useEffect } from 'react';

function NumberClue() {
  const [targetNumber, setTargetNumber] = useState(null); // Secret number to guess
  const [guess, setGuess] = useState(''); // Current guess input
  const [attempts, setAttempts] = useState(0); // Count of attempts
  const [clue, setClue] = useState(''); // Clue for the player
  const [message, setMessage] = useState(''); // Message for win/lose status
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  // Generate a new target number (3 or 4 digits) and reset game state
  function startNewGame() {
    const isThreeDigit = Math.random() < 0.5;
    const min = isThreeDigit ? 100 : 1000;
    const max = isThreeDigit ? 999 : 9999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    setTargetNumber(randomNumber);
    setAttempts(0);
    setClue('');
    setMessage('');
    setGameOver(false);
    setGuess('');
  }

  // Handle each guess submission
  function handleGuess() {
    const numGuess = parseInt(guess, 10);
    if (isNaN(numGuess)) {
      setClue('Please enter a valid number.');
      return;
    }
    setAttempts(attempts + 1);

    if (numGuess === targetNumber) {
      setMessage(`Congratulations! You guessed the correct number: ${targetNumber}`);
      setGameOver(true);
    } else if (attempts >= 5) {
      setMessage(`Game over! The correct number was: ${targetNumber}`);
      setGameOver(true);
    } else {
      generateClue(numGuess);
    }

    setGuess(''); // Clear input after guess
  }

  // Generate clues based on the player's guess
  function generateClue(numGuess) {
    let newClue = '';
    if (targetNumber % numGuess === 0) {
      newClue = `${numGuess} is a factor of the number.`;
    } else if (isPrime(targetNumber)) {
      newClue = 'The number is prime.';
    } else if (targetNumber % 2 === 0) {
      newClue = 'The number is even.';
    } else {
      newClue = 'The number is odd.';
    }
    setClue(newClue);
  }

  // Helper function to check if a number is prime
  function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  }

  return (
    <div className="NumberClue">
      <h1>Number Guessing Game</h1>
      <p>Guess the 3 or 4-digit number within 6 attempts!</p>

      <div className="game-container">
        {message ? (
          <p className="message">{message}</p>
        ) : (
          <>
            <p>Clue: {clue}</p>
            <p>Attempts Left: {6 - attempts}</p>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              disabled={gameOver}
            />
            <button onClick={handleGuess} disabled={gameOver}>
              Submit Guess
            </button>
          </>
        )}
      </div>

      {gameOver && (
        <button onClick={startNewGame} className="restart-button">
          Play Again
        </button>
      )}
    </div>
  );
}

export default NumberClue;
