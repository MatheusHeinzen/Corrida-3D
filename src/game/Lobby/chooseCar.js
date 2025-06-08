import React, { useRef, useState } from 'react';
import { CarPreview } from './carPreview';
import './lobby.css';

export function ChooseCar({ carColor, setCarColor, onConfirm, onBack }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleToggleAudio = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.volume = 0.1;
            audio.play();
        }

        setIsPlaying(!isPlaying);
    };

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
                <audio ref={audioRef} loop>
                    <source src="/assets/songs/Sade - Smooth Operator.mp3" type="audio/mpeg" />
                </audio>

                <div style={{ display: 'flex', gap: 20 }}>
                    <CarPreview color={carColor} />
                    {/* Adicione botões para mudar a cor, ex: */}
                    <button onClick={() => setCarColor({ r: 200, g: 30, b: 30 })}>Vermelho</button>
                    <button onClick={() => setCarColor({ r: 30, g: 120, b: 200 })}>Azul</button>
                    <button onClick={() => setCarColor({ r: 30, g: 200, b: 80 })}>Verde</button>
                </div>
                <button onClick={onConfirm}>Confirmar</button>
                <button onClick={onBack}>Voltar</button>



                <div className='radio-control'>
                    <img
                        src={isPlaying ? '/assets/imgs/pause.png' : '/assets/imgs/play.png'}
                        style={{ width: 60, cursor: 'pointer' }}
                        onClick={handleToggleAudio}
                        alt="Play/Pause"
                    />
                    <img
                        src='/assets/imgs/next.png'
                        style={{ width: 70, height: 50, cursor: 'pointer' }}
                        onClick={onStart}
                        alt="Next"
                    />
                </div>
            </div>
        </div>
    );
}
