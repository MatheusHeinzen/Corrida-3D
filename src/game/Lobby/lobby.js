import React, { useRef, useState, useEffect } from 'react';
import { CarPreview } from './carPreview';
import { McQueen, ORei, ChickHicks } from '../car';
import './lobby.css';
import { getDatabase, ref, onValue } from "firebase/database";

export function Lobby({ onJoin, onCreate }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showRooms, setShowRooms] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [privateCode, setPrivateCode] = useState('');
    const [error, setError] = useState('');

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
            audio.volume = 0.1;
            audio.play();
        }

        setIsPlaying(!isPlaying);
    };

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

                <img
                    src="/assets/imgs/title.png"
                    alt="Título"
                    style={{ width: 500, marginBottom: 10 }}
                />

                <div style={{ zIndex: 2, display: 'flex', scale: 2, gap: 20, marginBottom: 20, marginTop: 20 }}>
                    <CarPreview carClass={McQueen}/>
                    <CarPreview carClass={ChickHicks}/>
                    <CarPreview carClass={ORei}/>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <button className='lobby-btn' onClick={onJoin}>
                        Encontrar Sala
                    </button>
                    <button className='lobby-btn' onClick={onCreate}>
                        Criar Sala
                    </button>
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
