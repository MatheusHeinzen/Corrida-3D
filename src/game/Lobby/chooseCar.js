import React, { useRef, useState } from 'react';
import { CarPreview } from './carPreview';
import { McQueen, ORei, ChickHicks } from '../car';
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
    const [selectedCarClass, setSelectedCarClass] = useState(McQueen);

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

                <div style={{ display: 'flex', gap: 100, }}>

                    <div style={{ scale: 2, top: 156, position: 'relative', zIndex: 2 }}>
                        <CarPreview carClass={new selectedCarClass()} color={carColor} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <h2>Escolha a cor do seu carro</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, }}>
                            <button onClick={() => setSelectedCarClass(McQueen)}>McQueen</button>
                            <button onClick={() => setSelectedCarClass(ORei)}>O Rei</button>
                            <button onClick={() => setSelectedCarClass(ChickHicks)}>Chick Hicks</button>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 10, zIndex: 2, marginTop: 20 }}>
                    <button className='lobby-btn' onClick={onConfirm}>Confirmar</button>
                    <button className='lobby-btn' onClick={onBack}>Voltar</button>
                </div>



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
                        onClick={handleToggleAudio}
                        alt="Next"
                    />
                </div>
            </div>
        </div>
    );
}
