import React from 'react';

export function Lobby({ onStart }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: '#222', color: '#fff'
    }}>
      <h1>Bem-vindo à Corrida 3D!</h1>
      <button style={{ fontSize: 24, padding: '12px 32px' }} onClick={onStart}>
        Iniciar Corrida
      </button>
    </div>
  );
}