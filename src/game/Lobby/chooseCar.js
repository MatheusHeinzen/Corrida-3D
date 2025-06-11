import React, { useRef, useState, useEffect } from 'react';
import { CarPreview } from './carPreview';
import { McQueen, ORei, ChickHicks } from '../car';
import './lobby.css';

export function ChooseCar({ onConfirm, onBack, p5 }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

    const playlist = [
        { title: "Smooth Operator", src: "/assets/songs/Sade - Smooth Operator.mp3" },
        { title: "Life is a Highway", src: "/assets/songs/Life is a Highway.mp3" },
        { title: "Real Gone", src: "/assets/songs/Real Gone by Sheryl Crow.mp3" },
        { title: "Sh-Boom", src: "/assets/songs/Sh-Boom.mp3" },
        { title: "Riders on The Storm", src: "/assets/songs/Snoop Dogg feat. The Doors - Riders on the Storm.mp3" },
        { title: "Tokyo Drift", src: "/assets/songs/Tokyo Drift.mp3" },
        { title: "Shut Up and Drive", src: "/assets/songs/Rihanna - Shut Up and Drive.mp3" },
        { title: "Get Low", src: "/assets/songs/Get Low.mp3" },
        { title: "Pump It", src: "/assets/songs/Pump It.mp3" },
        { title: "Act a Fool", src: "/assets/songs/Ludacris - Act a Fool.mp3" },
        { title: "WOOPS", src: "/assets/songs/WOOPS.mp3" }
    ];

    const handleToggleAudio = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.volume = 0.01;
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleNextTrack = () => {
        const nextIndex = (currentTrackIndex + 1) % playlist.length;
        setCurrentTrackIndex(nextIndex);
        setIsPlaying(true);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.load();
            audioRef.current.play().catch(e => {});
        }
    };

    // Atualiza a fonte de áudio quando a música muda
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load();
            if (isPlaying) {
                audioRef.current.play().catch(e => {});
            }
        }
    }, [currentTrackIndex]);

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

            {/* Conteúdo principal */}
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
                        onClick={handleNextTrack}
                        alt="Next"
                    />
                    <span style={{ color: 'white', marginLeft: '10px' }}>
                        {playlist[currentTrackIndex].title}
                    </span>
                </div>
                <audio ref={audioRef} loop>
                    <source src={playlist[currentTrackIndex].src} type="audio/mpeg" />
                    Seu navegador não suporta o elemento de áudio.
                </audio>

                <div style={{ display: 'flex', gap: 100 }}>
                    <div style={{ scale: 2, top: 156, position: 'relative', zIndex: 2 }}>
                        {selectedCar && (
                            <CarPreview
                                key={selectedCar} // força atualização ao trocar de carro
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
                        onClick={() => selectedCar && onConfirm(selectedCar)}
                        disabled={!selectedCar}
                    >
                        Confirmar
                    </button>
                    <button className='lobby-btn' onClick={onBack}>Voltar</button>
                </div>
            </div>
        </div>
    );
}