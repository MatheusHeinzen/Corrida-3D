import React, { useRef, useState } from 'react';
import { CarPreview } from './carPreview';
import { McQueen, ORei, ChickHicks } from '../car';
import './lobby.css';
import { RaceStartSequence } from '../raceStart';

export function ChooseCar({ onConfirm, onBack, p5 }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [showLights, setShowLights] = useState(false);

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

    // Quando as luzes terminarem, chama o onConfirm
    const handleLightsEnd = () => {
        setShowLights(false);
        onConfirm(selectedCar);
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

            {/* Conteúdo principal só aparece se NÃO estiver mostrando as luzes */}
            {!showLights && (
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

                    <div style={{ display: 'flex', gap: 100 }}>
                        <div style={{ scale: 2, top: 156, position: 'relative', zIndex: 2 }}>
                            {selectedCar && (
                                <CarPreview
                                    carClass={
                                        selectedCar === "McQueen" ? McQueen :
                                            selectedCar === "ORei" ? ORei :
                                                selectedCar === "ChickHicks" ? ChickHicks : null
                                    }
                                    p5={p5}
                                />
                            )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <h2>Escolha o seu Carro</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <button className='secondary-btn' onClick={() => setSelectedCar("McQueen")}>McQueen</button>
                                <button className='secondary-btn' onClick={() => setSelectedCar("ORei")}>O Rei</button>
                                <button className='secondary-btn' onClick={() => setSelectedCar("ChickHicks")}>Chick Hicks</button>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, zIndex: 2, marginTop: 20 }}>
                        <button
                            className='lobby-btn'
                            onClick={() => selectedCar && setShowLights(true)}
                            disabled={!selectedCar}
                        >
                            Confirmar
                        </button>
                        <button className='lobby-btn' onClick={onBack}>Voltar</button>
                    </div>
                </div>
            )}

            {/* Overlay e RaceStartSequence só aparecem depois de clicar em Confirmar */}
            {showLights && (
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    zIndex: 10,
                }}>
                    <RaceStartSequence style={{ zIndex: 120, scale: 2}} onStart={handleLightsEnd} />
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 10,
                        paddingBottom: '40px'
                    }}>
                        {/* Overlay */}
                    </div>
                </div>
            )}

            <div className='radio-control'>
                <img
                    src={isPlaying ? '/assets/imgs/pause.png' : '/assets/imgs/play.png'}
                    style={{ width: 40, cursor: 'pointer' }}
                    onClick={handleToggleAudio}
                    alt="Play/Pause"
                />
                <img
                    src='/assets/imgs/next.png'
                    style={{ width: 50, height: 50, cursor: 'pointer' }}
                    onClick={handleToggleAudio}
                    alt="Next"
                />
            </div>
        </div>
    );
}