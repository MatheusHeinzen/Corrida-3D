import React, { useEffect, useRef, useState } from 'react';
import { getDatabase, ref, onValue, set } from "firebase/database";
import { RaceStartSequence } from '../raceStart';

export function WaitRoom({ roomId, userId, onStart }) {
    const [players, setPlayers] = useState([]);
    const [starting, setStarting] = useState(false);
    const [startSignal, setStartSignal] = useState(false);
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
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

    // Música (igual chooseCar.js)
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

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load();
            if (isPlaying) {
                audioRef.current.play().catch(e => {});
            }
        }
    }, [currentTrackIndex]);

    // Firebase: escuta jogadores e startSignal
    useEffect(() => {
        const db = getDatabase();
        const playersRef = ref(db, `rooms/${roomId}/players`);
        const startRef = ref(db, `rooms/${roomId}/startSignal`);

        const unsubPlayers = onValue(playersRef, (snap) => {
            const val = snap.val() || {};
            // Corrige contagem: só conta objetos válidos
            const arr = Object.entries(val)
                .filter(([id, data]) => data && typeof data === 'object')
                .map(([id, data]) => ({
                    id,
                    name: data.name || ("Player " + id.substring(0, 5))
                }));
            setPlayers(arr);
        });

        const unsubStart = onValue(startRef, (snap) => {
            if (snap.val() === true) {
                setStartSignal(true);
            }
        });

        return () => {
            unsubPlayers();
            unsubStart();
        };
    }, [roomId]);

    // Qualquer um pode começar
    const handleStart = async () => {
        if (starting || startSignal) return;
        setStarting(true);
        const db = getDatabase();
        await set(ref(db, `rooms/${roomId}/startSignal`), true);
    };

    // Quando startSignal, mostra luzes e chama onStart ao final
    const handleLightsEnd = () => {
        if (onStart) onStart();
    };

    // Só mostra a RaceStartSequence quando startSignal for true
    if (startSignal) {
        return (
            <div style={{ width: '100vw', height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 100 }}>
                <RaceStartSequence onStart={handleLightsEnd} />
            </div>
        );
    }

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
            {/* Conteúdo */}
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
                <h2 style={{ margin: 30 }}>Sala de Espera</h2>
                <div style={{
                    background: 'rgba(0,0,0,0.5)',
                    borderRadius: 16,
                    padding: 24,
                    minWidth: 320,
                    marginBottom: 24
                }}>
                    <h3>Jogadores ({players.length}/3):</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {players.map(p => (
                            <li key={p.id} style={{
                                fontWeight: p.id === userId ? 'bold' : 'normal',
                                color: p.id === userId ? '#ffd700' : 'white',
                                marginBottom: 8
                            }}>
                                {p.name}
                                {p.id === userId ? " (Você)" : ""}
                            </li>
                        ))}
                    </ul>
                </div>
                <button
                    className='lobby-btn'
                    style={{ fontSize: 22, padding: '10px 40px', marginTop: 10 }}
                    onClick={handleStart}
                    disabled={starting}
                >
                    Começar
                </button>
            </div>
        </div>
    );
}
