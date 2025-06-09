import React, { useRef, useState } from 'react';
import { CarPreview} from './carPreview';
import { McQueen, ORei, ChickHicks } from '../car';
import './lobby.css';

export function Lobby({ onJoin, onCreate }) {
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
