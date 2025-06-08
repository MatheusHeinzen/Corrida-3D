import React from 'react';
import { CarPreview } from './carPreview';
import './lobby.css';

export function Lobby({ onStart }) {
    return (
        <div style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
            {/* Fundo com blur */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'url("/assets/imgs/radiator-bg.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(6px)',
                    zIndex: 0,
                }}
            />

            {/* Conteúdo por cima */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                }}
            >
                <audio autoPlay loop>
                    <source src="/assets/songs/Sade - Smooth Operator.mp3" type="audio/mpeg" />
                </audio>
                <img
                    src="/assets/imgs/title.png"
                    alt="Título"
                    style={{ width: 500, marginBottom: 10 }}
                />
                <div style={{ zIndex: 2, display: 'flex', scale: 2, gap: 20, marginBottom: 20 }}>
                    <CarPreview color={{ r: 200, g: 30, b: 30 }} />
                    <CarPreview color={{ r: 30, g: 120, b: 200 }} />
                    <CarPreview color={{ r: 30, g: 200, b: 80 }} />
                </div>
                <h1>Bem-vindo a Radiator Springs!</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button className='lobby-btn' onClick={onStart}>
                        Iniciar Corrida
                    </button>
                    <button className='lobby-btn' onClick={onStart}>
                        Criar Sala
                    </button>
                    <button className='lobby-btn' onClick={onStart}>
                        Escolher Carro
                    </button>
                </div>
            </div>
        </div>
    );
}
