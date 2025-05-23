// App.js
import React from 'react';
import Sketch from 'react-p5';
import { setup, draw } from './game/sketch';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Sketch setup={setup} draw={draw} />
    </div>
  );
}

export default App;