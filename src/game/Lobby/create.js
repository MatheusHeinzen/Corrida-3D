import React, { useState } from 'react';

export function CreateRoom({ onContinue }) {
    const [isPrivate, setIsPrivate] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [roomCode, setRoomCode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Usa roomName ou roomCode como identificador da sala
        const roomId = isPrivate ? roomCode : roomName;
        if (!roomId) return;
        onContinue(roomId);
    };

    return (
        <div style={{ height: '100vh', position: 'relative', overflow: 'hidden', }}>
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

                <div style={{ padding: 20 }}>
                    <h2>Criar Sala</h2>
                    <form className="room-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Nome da sala"
                            value={roomName}
                            onChange={e => setRoomName(e.target.value)}
                            disabled={isPrivate}
                        />
                        {isPrivate && (
                            <input
                                type="text"
                                placeholder="Código da sala"
                                value={roomCode}
                                onChange={e => setRoomCode(e.target.value)}
                            />
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0' }}>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={isPrivate}
                                    onChange={() => setIsPrivate(!isPrivate)}
                                />
                                <span className="slider"></span>
                            </label>
                            <span>{isPrivate ? 'Privada' : 'Pública'}</span>
                        </div>
                    </form>
                    <button className='lobby-btn' onClick={handleSubmit}>Criar Sala</button>
                </div>
            </div>
        </div>
    );
}
