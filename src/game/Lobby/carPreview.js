import React, { useRef } from 'react';
import Sketch from 'react-p5';
import { McQueen, ChickHicks, ORei } from '../car';
export function CarPreview({ carClass, color, p5 }) {
  const rotationRef = useRef(0);
  const carRef = useRef(null);

  const setup = (p5Instance, canvasParentRef) => {
    p5Instance.createCanvas(100, 100, p5Instance.WEBGL).parent(canvasParentRef);

    // Instancia o carro correto usando o p5 recebido por props ou do Sketch
    carRef.current = new carClass(0, 0, 0, p5 || p5Instance);
    if (color) carRef.current.color = color;
  };

  const draw = (p5Instance) => {
    p5Instance.background(0, 0, 0, 0); // Fundo transparente
    p5Instance.noStroke();

    p5Instance.ambientLight(150);
    p5Instance.directionalLight(255, 255, 255, 0.5, -1, -1);

    rotationRef.current += 0.01;

    const car = carRef.current;
    if (car) {
      car.rotation.y = rotationRef.current;
      p5Instance.rotateX(Math.PI); 
      car.display(p5Instance);
    }
  };

  return <Sketch setup={setup} draw={draw} />;
}