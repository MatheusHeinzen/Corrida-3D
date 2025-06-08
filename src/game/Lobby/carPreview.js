import React, { useRef } from 'react';
import Sketch from 'react-p5';
import { Car } from '../car';

export function CarPreview({ color }) {
  const rotationRef = useRef(0);
  const carRef = useRef(null);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(100, 100, p5.WEBGL).parent(canvasParentRef);
    carRef.current = new Car(0, 0, 0, p5);
    carRef.current.color = color;
  };

  const draw = (p5) => {
    p5.background(0, 0, 0, 0); // Não use clear junto
    p5.noStroke();

    p5.ambientLight(150);
    p5.directionalLight(255, 255, 255, 0.5, -1, -1);

    rotationRef.current += 0.01;

    const car = carRef.current;
    if (car) {
      car.color = color;
      car.rotation.y = rotationRef.current;
      p5.rotateX(Math.PI); // Inclina a visão para baixo
      car.display(p5);
    }
  };

  return <Sketch setup={setup} draw={draw} />;
}
