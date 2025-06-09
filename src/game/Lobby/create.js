import React, { useState } from 'react';
import { getDatabase, ref, set } from "firebase/database";

export function CreateRoom({ onContinue }) {
    const [isPrivate, setIsPrivate] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!roomName) {
            setError("Digite um nome para a sala.");
            return;
        }
        if (isPrivate && !roomCode) {
            setError("Digite um código para a sala privada.");
            return;
        }
        setError('');

        // Cria um id único (pode ser o nome, mas melhor garantir unicidade)
        const roomId = roomName.replace(/\s+/g, '_') + '_' + Math.random().toString(36).substring(2, 7);

        // Salva a sala no banco
        const db = getDatabase();
        await set(ref(db, `rooms/${roomId}`), {
            name: roomName,
            isPrivate,
            privateCode: isPrivate ? roomCode : null
        });

        // Continua para o fluxo do lobby
        if (onContinue) onContinue(roomId);
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
                    {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
                </div>
            </div>
        </div>
    );
}
