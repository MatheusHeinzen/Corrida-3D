// App.js
import React, { useState } from 'react';
import Sketch from 'react-p5';
import { Lobby } from './game/Lobby/lobby';
import { setup, draw } from './game/sketch';

function App() {
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    setStarted(true);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {!started ? (
        <Lobby onStart={handleStart} />
      ) : (
        <Sketch setup={setup} draw={draw} />
      )}
    </div>
  );
}

export default App;
