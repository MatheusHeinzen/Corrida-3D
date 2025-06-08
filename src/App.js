// App.js
import React, { useEffect, useState } from 'react';
import Sketch from 'react-p5';
// Corrija os imports para apontar para o local correto dos arquivos:
import { setup, draw } from './sketch'; // <-- estava './game/sketch'
import { db, auth } from './firebase/firebaseConfig'; // <-- estava './firebaseConfig'
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";

function App() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Gera um ID único para cada jogador (poderia ser auth.uid se usar login)
    let uid = localStorage.getItem('car_uid');
    if (!uid) {
      uid = Math.random().toString(36).substring(2, 12);
      localStorage.setItem('car_uid', uid);
    }
    setUserId(uid);

    // Remova o listener antigo de "cars" e setRemoteCarState
    // O multiplayer agora é feito via joinRoom/syncRoom/updatePlayer em sketch.js

    // ...não precisa mais do onSnapshot nem do setRemoteCarState...
  }, []);

  // Não precisa mais de window.sendCarStateToFirebase

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Sketch setup={setup} draw={draw} />
    </div>
  );
}

export default App;