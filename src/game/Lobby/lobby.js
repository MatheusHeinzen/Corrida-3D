import React from 'react';
import { CarPreview } from './carPreview';

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
                <img
                    src="/assets/imgs/title.png"
                    alt="Título"
                    style={{ width: 500, marginBottom: 10 }}
                />
                <div style={{ zIndex: 2 }}>
                    <CarPreview />
                </div>
                <h1>Bem-vindo a Radiator Springs!</h1>

                <button style={{ fontSize: 24, padding: '12px 24px', borderRadius: '7px', border: '0px' }} onClick={onStart}>
                    Iniciar Corrida
                </button>
                <button>
                    Criar Sala
                </button>
                <button>
                    Escolher Carro
                </button>
            </div>
        </div>
    );
}
