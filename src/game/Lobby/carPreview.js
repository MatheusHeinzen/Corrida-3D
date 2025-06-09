import React, { useRef } from 'react';
import Sketch from 'react-p5';
import { McQueen, ChickHicks, ORei } from '../car';
export function CarPreview({ carClass, color }) {
  const rotationRef = useRef(0);
  const carRef = useRef(null);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(100, 100, p5.WEBGL).parent(canvasParentRef);

 // Instancia o carro correto
    carRef.current = new carClass(0, 0, 0, p5);
    if (color) carRef.current.color = color;
  };

  const draw = (p5) => {
    p5.background(0, 0, 0, 0); // Fundo transparente
    p5.noStroke();

    p5.ambientLight(150);
    p5.directionalLight(255, 255, 255, 0.5, -1, -1);

    rotationRef.current += 0.01;

    const car = carRef.current;
    if (car) {
      car.rotation.y = rotationRef.current;
      p5.rotateX(Math.PI); 
      car.display(p5);
    }
  };

  return <Sketch setup={setup} draw={draw} />;
}