import React, { useState, useEffect } from 'react';

function NumberOperator() {
  const [targetNumber, setTargetNumber] = useState(0); // Target 3-digit number
  const [expression, setExpression] = useState({ n1: '', op1: '', n2: '', op2: '', n3: '' }); // Player's inputs
  const [message, setMessage] = useState(''); // Win/lose message
  const [attempts, setAttempts] = useState(0); // Track number of attempts
  const [gameOver, setGameOver] = useState(false);

  // Generate a new target number when the game starts
  useEffect(() => {
    startNewGame();
  }, []);

  // Start a new game by generating a random target number
  function startNewGame() {
    const randomNumber = Math.floor(Math.random() * (999 - 100 + 1)) + 100; // Random 3-digit number
    setTargetNumber(randomNumber);
    setExpression({ n1: '', op1: '', n2: '', op2: '', n3: '' });
    setMessage('');
    setAttempts(0);
    setGameOver(false);
  }

  // Handle changes in player inputs for each part of the expression
  function handleChange(e) {
    const { name, value } = e.target;
    setExpression(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  // Calculate the result based on the expression
  function evaluateExpression() {
    const { n1, op1, n2, op2, n3 } = expression;
    if (!n1 || !n2 || !n3 || !op1 || !op2) {
      setMessage("Please complete the expression.");
      return;
    }

    const num1 = parseInt(n1, 10);
    const num2 = parseInt(n2, 10);
    const num3 = parseInt(n3, 10);
    let result;

    try {
      // Evaluate the first operation
      result = performOperation(num1, op1, num2);
      if (result === null) {
        setMessage("Invalid operation. Check operators and numbers.");
        return;
      }

      // Evaluate the second operation
      result = performOperation(result, op2, num3);
      if (result === null) {
        setMessage("Invalid operation. Check operators and numbers.");
        return;
      }
    } catch (error) {
      setMessage("Error in calculation. Please try again.");
      return;
    }

    setAttempts(attempts + 1);

    if (result === targetNumber) {
      setMessage(`Congratulations! You've matched the target number: ${targetNumber}`);
      setGameOver(true);
    } else if (attempts >= 5) {
      setMessage(`Game over! You've run out of attempts. The target number was ${targetNumber}.`);
      setGameOver(true);
    } else {
      setMessage(`Result: ${result}. Try again!`);
    }
  }

  // Perform operation helper function
  function performOperation(a, op, b) {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case 'x':
        return a * b;
      case '/':
        return b !== 0 ? a / b : null; // Avoid division by zero
      default:
        return null;
    }
  }

  return (
    <div className="App">
      <h1>Equation Matching Game</h1>
      <p>Target Number: <strong>{targetNumber}</strong></p>
      <p>Form an equation that equals the target number using single-digit numbers and operations.</p>

      <div className="game-container">
        {message && <p className="message">{message}</p>}

        {!gameOver && (
          <div className="expression-inputs">
            <input
              type="text"
              name="n1"
              value={expression.n1}
              onChange={handleChange}
              maxLength="1"
              placeholder="n1"
            />
            <select name="op1" value={expression.op1} onChange={handleChange}>
              <option value="">Select</option>
              <option value="+">+</option>
              <option value="-">-</option>
              <option value="x">x</option>
              <option value="/">/</option>
            </select>
            <input
              type="text"
              name="n2"
              value={expression.n2}
              onChange={handleChange}
              maxLength="1"
              placeholder="n2"
            />
            <select name="op2" value={expression.op2} onChange={handleChange}>
              <option value="">Select</option>
              <option value="+">+</option>
              <option value="-">-</option>
              <option value="x">x</option>
              <option value="/">/</option>
            </select>
            <input
              type="text"
              name="n3"
              value={expression.n3}
              onChange={handleChange}
              maxLength="1"
              placeholder="n3"
            />
            <button onClick={evaluateExpression}>Submit Equation</button>
          </div>
        )}

        {gameOver && (
          <button onClick={startNewGame} className="restart-button">
            Play Again
          </button>
        )}
      </div>
    </div>
  );
}

export default NumberOperator;