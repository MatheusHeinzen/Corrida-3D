import React, { useRef } from 'react';
import Sketch from 'react-p5';
import { Car } from '../car';

export function CarPreview() {
  const rotationRef = useRef(0);
  const carRef = useRef(null);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(300, 200, p5.WEBGL).parent(canvasParentRef);
    carRef.current = new Car(0, 0, 0, p5);
  };

  const draw = (p5) => {
    p5.background(0, 0, 0, 0 ); // Não use clear junto
    p5.noStroke();

    p5.ambientLight(150);
    p5.directionalLight(255, 255, 255, 0.5, -1, -1);

    rotationRef.current += 0.01;

    const car = carRef.current;
    if (car) {
      car.rotation.y = rotationRef.current;
      car.display(p5); 
    }
  };

  return <Sketch setup={setup} draw={draw} />;
}
