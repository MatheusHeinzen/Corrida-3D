// RaceStart.js
import React, { useRef, useEffect, useState } from 'react';
import Sketch from 'react-p5';
import { StartLights } from './Lobby/startLights';

export function RaceStartSequence({ onStart }) {
  const lightsRef = useRef(null);
  const [done, setDone] = useState(false);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL).parent(canvasParentRef);
    lightsRef.current = new StartLights(0, 0, 0, p5);
    lightsRef.current.start(p5);
  };

  const draw = (p5) => {
    p5.clear(); // Limpa o fundo
    if (lightsRef.current) {
      lightsRef.current.update(p5);
      lightsRef.current.display(p5);

      if (lightsRef.current.state === 'green' && !done) {
        setDone(true);
        setTimeout(() => onStart(), 500); // Pequeno delay antes de iniciar corrida
      }
    }
  };

  return <Sketch setup={setup} draw={draw} />;
}
