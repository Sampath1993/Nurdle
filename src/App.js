import React, { useState } from 'react';
import './App.css';
import NumberClue from './NumberClue/NumberClue';
import NumberOperator from './NumberOperator/NumberOperator';
import NumberWordle from './NumberWordle/NumberWordle';

function App() {
  const [activeTab, setActiveTab] = useState("Nurdle"); // Default tab
  
  const renderGameComponent = () => {
    switch (activeTab) {
      case "Nurdle":
        return <NurdleGame />;
      case "Cluedle":
        return <NumberClueGame />;
      case "NoOp":
        return <NumberOperatorGame />;
      default:
        return <NurdleGame />;
    }
  };

function NurdleGame() {
  return NumberWordle();
}

function NumberClueGame() {
  return NumberClue();
}

function NumberOperatorGame() {
  return NumberOperator();
}

return (
  <div className="App">
      {/* Tabs Navigation */}
      <div className="tabs">
        <button onClick={() => setActiveTab("Nurdle")} className={activeTab === "Nurdle" ? "active" : ""}>Nurdle</button>
        <button onClick={() => setActiveTab("Cluedle")} className={activeTab === "Cluedle" ? "active" : ""}>Clueder</button>
        <button onClick={() => setActiveTab("NoOp")} className={activeTab === "NoOp" ? "active" : ""}>NoOp</button>
      </div>

      {/* Render the selected game */}
      <div className="game-container">
        {renderGameComponent()}
      </div>
    
  </div>
);
}

export default App;
