import React, { useEffect, useState } from 'react';
import Sketch from 'react-p5';
import LobbyRouterPage from './game/lobbyRouterPage';
import { setup, draw } from '../src/sketch';
import { db, auth } from './firebase/firebaseConfig';
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";

function App() {
  const [started, setStarted] = useState(false);
  const [userId, setUserId] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [roomId, setRoomId] = useState(null); // <-- Adicione isso

  useEffect(() => {
    // Gera um ID único para cada jogador (poderia ser auth.uid se usar login)
    let uid = localStorage.getItem('car_uid');
    if (!uid) {
      uid = Math.random().toString(36).substring(2, 12);
      localStorage.setItem('car_uid', uid);
    }
    setUserId(uid);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {!started ? (
        <LobbyRouterPage
          onStart={(roomId, carType) => {
            setRoomId(roomId);
            setSelectedCar(carType);
            setStarted(true);
          }}
          userId={userId}
        />
      ) : (
        <Sketch
          setup={(p5, canvasParentRef) =>
            setup(p5, canvasParentRef, roomId, userId, selectedCar)
          }
          draw={draw}
        />
      )}
    </div>
  );
}

export default App;