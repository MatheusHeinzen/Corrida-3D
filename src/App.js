// App.js
import React, { useState } from 'react';
import Sketch from 'react-p5';
import LobbyRouterPage from './game/lobbyRouterPage'; // Importa o router
import { setup, draw } from './game/sketch';

function App() {
  const [started, setStarted] = useState(false);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {!started ? (
        <LobbyRouterPage onStart={() => setStarted(true)} />
      ) : (
        <Sketch setup={setup} draw={draw} />
      )}
    </div>
  );
}

export default App;
