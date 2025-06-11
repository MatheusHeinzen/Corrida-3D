import React, { useRef, useState, useEffect } from 'react';
import { CarPreview } from './carPreview';
import { McQueen, ORei, ChickHicks } from '../car';
import './lobby.css';
import { getDatabase, ref, onValue } from "firebase/database";

export function Lobby({ onJoin, onCreate }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [showRooms, setShowRooms] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [privateCode, setPrivateCode] = useState('');
    const [error, setError] = useState('');

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

    useEffect(() => {
        if (showRooms) {
            const db = getDatabase();
            const roomsRef = ref(db, 'rooms');
            const unsub = onValue(roomsRef, (snapshot) => {
                const data = snapshot.val() || {};
                // Array de salas [{id, isPrivate, name, ...}]
                const roomList = Object.entries(data).map(([id, value]) => ({
                    id,
                    ...value
                }));
                setRooms(roomList);
            });
            return () => unsub();
        }
    }, [showRooms]);

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
        setIsPlaying(true); // Auto-play quando muda de música

        // Força a atualização da fonte de áudio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.load();
            audioRef.current.play().catch(e => console.log("Auto-play prevented", e));
        }
    };

    // Atualiza a fonte de áudio quando a música muda
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load();
            if (isPlaying) {
                audioRef.current.play().catch(e => console.log("Auto-play prevented", e));
            }
        }
    }, [currentTrackIndex]);

    const handleJoinClick = () => {
        setShowRooms(true);
    };

    const handleRoomClick = (room) => {
        setSelectedRoom(room);
        setError('');
        if (room.isPrivate) {
            // Solicita código
            setPrivateCode('');
        } else {
            // Entra direto
            if (onJoin) onJoin(room.id);
        }
    };

    const handlePrivateJoin = () => {
        if (selectedRoom && selectedRoom.privateCode === privateCode) {
            if (onJoin) onJoin(selectedRoom.id);
        } else {
            setError('Código incorreto!');
        }
    };

    const HowToPlayPopup = () => {
        const [isOpen, setIsOpen] = useState(false);

        // Impedir scroll da página quando o popup estiver aberto
        useEffect(() => {
            if (isOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        }, [isOpen]);

        const togglePopup = () => {
            setIsOpen(!isOpen);
        };

        if (!isOpen) {
            return (
                <button
                    onClick={togglePopup}
                    className="open-popup-btn"
                    style={{
                        right: '41%',
                    }}
                >
                    Como Jogar
                </button>
            );
        }

        return (
            <>
                {/* Overlay escuro */}
                <div
                    className="popup-overlay"
                    onClick={togglePopup}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 999,
                        backdropFilter: 'blur(3px)'
                    }}
                />

                {/* Popup */}
                <div className='popUp'>
                    <h3 style={{
                        textAlign: 'center',
                        marginBottom: 10,
                        fontSize: '1.5rem',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                    }}>COMO JOGAR</h3>

                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 0, alignContent: 'center', gap: 50 }}>
                        <img
                            src="/assets/imgs/keyboard.png"
                            alt="Ícone do Jogo"
                            style={{
                                width: 280,
                                transition: 'transform 0.3s ease',
                                marginBottom: 0
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        />
                        <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '10px 10px' }}>
                            <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>W</span> - Aceleração
                            </p>
                            <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>A</span> - Virar o volante para a esquerda
                            </p>
                            <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>S</span> - Freio
                            </p>
                            <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>D</span> - Virar o volante para a direita
                            </p>

                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                        <button
                            className='secondary-btn'
                            onClick={() => setIsOpen(false)}
                            style={{
                                padding: '10px 25px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                            }}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </>
        );
    };

    const GameInfoPopup = () => {
        const [isOpen, setIsOpen] = useState(false);

        // Impedir scroll da página quando o popup estiver aberto
        useEffect(() => {
            if (isOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        }, [isOpen]);

        const togglePopup = () => {
            setIsOpen(!isOpen);
        };

        if (!isOpen) {
            return (
                <button
                    onClick={togglePopup}
                    className="open-popup-btn"
                    style={{
                        right: '50%', 
                    }}
                >
                    Sobre o Jogo
                </button>
            );
        }

        return (
            <>
                {/* Overlay escuro */}
                <div
                    className="popup-overlay"
                    onClick={togglePopup}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 999,
                        backdropFilter: 'blur(3px)'
                    }}
                />

                {/* Popup */}
                <div className='popUp'>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 0 }}>
                        <img
                            src="/assets/imgs/iconGame.png"
                            alt="Ícone do Jogo"
                            style={{
                                width: 180,
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                                transition: 'transform 0.3s ease',
                                marginBottom: -13
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        />
                    </div>

                    <h3 style={{
                        textAlign: 'center',
                        marginBottom: 10,
                        fontSize: '1.5rem',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                    }}>SOBRE O JOGO</h3>

                    <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '0 10px' }}>
                        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Bem-vindo</span> ao nosso jogo de corrida <strong >multiplayer online!</strong>
                        </p>
                        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
                            Prepare-se para disputar corridas intensas com outros jogadores em tempo real, curvas desafiadoras e muita adrenalina.
                        </p>
                        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
                            Escolha entre três carros icônicos: <span style={{ color: '#1d3557', fontWeight: 'bold' }}>McQueen</span>, <span style={{ color: '#1d3557', fontWeight: 'bold' }}>O Rei</span> e <span style={{ color: '#1d3557', fontWeight: 'bold' }}>Chick Hicks</span>.
                        </p>
                        <h3 style={{ margin: '10px 0 10px 0', fontSize: '1.2rem' }}>NOTA TÉCNICA</h3><hr></hr>
                        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
                            O jogo foi desenvolvido em <strong>React</strong> usando <strong>p5.js</strong> e <strong>WebGL</strong> para gráficos dinâmicos em 3D, com sincronização multiplayer via <strong>Firebase</strong>.
                        </p>
                        <p style={{ marginBottom: 15, lineHeight: 1.6 }}>
                            Mostre suas habilidades no volante, desafie seus amigos e conquiste o topo do pódio!
                        </p>
                        <p style={{textAlign: 'end'}}><i>Made by Matheus & Bruna</i></p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                        <button
                            className='secondary-btn'
                            onClick={() => setIsOpen(false)}
                            style={{
                                padding: '10px 25px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                            }}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </>
        );
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

                <img
                    src="/assets/imgs/title.png"
                    alt="Título"
                    style={{ width: 500, marginBottom: 10 }}
                />

                <div style={{ zIndex: 2, display: 'flex', scale: 2, gap: 20, marginBottom: 20, marginTop: 20 }}>
                    <CarPreview carClass={McQueen} />
                    <CarPreview carClass={ChickHicks} />
                    <CarPreview carClass={ORei} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <button className='lobby-btn' onClick={onJoin}>
                        Encontrar Sala
                    </button>
                    <button className='lobby-btn' onClick={onCreate}>
                        Criar Sala
                    </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <span >
                        <GameInfoPopup />
                    </span>
                    <span >
                        <HowToPlayPopup />
                    </span>

                </div>




            </div>
        </div >
    );
}
