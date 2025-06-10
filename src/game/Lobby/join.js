import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";

export function JoinRoom({ onContinue, onBack }) {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [privateCode, setPrivateCode] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const db = getDatabase();
        const roomsRef = ref(db, 'rooms');
        const unsub = onValue(roomsRef, (snapshot) => {
            const data = snapshot.val() || {};
            const roomList = Object.entries(data).map(([id, value]) => ({
                id,
                ...value
            }));
            setRooms(roomList);
        });
        return () => unsub();
    }, []);

    const handleRoomClick = (room) => {
        setSelectedRoom(room);
        setError('');
        setPrivateCode('');
        if (!room.isPrivate) {
            // Sala pública, entra direto
            onContinue(room.id);
        }
    };

    const handlePrivateJoin = () => {
        if (selectedRoom && selectedRoom.privateCode === privateCode) {
            onContinue(selectedRoom.id);
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

                <div style={{ padding: 20 }}>
                    <h2>Encontrar Sala</h2>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {rooms.length === 0 && <li>Nenhuma sala encontrada.</li>}
                        {rooms.map(room => (
                            <li key={room.id} style={{ margin: '10px 0' }}>
                                <button className='secondary-btn'
                                    style={{ width: 200, padding: 8, cursor: 'pointer' }}
                                    onClick={() => handleRoomClick(room)}
                                >
                                    {room.name || room.id}
                                    {room.isPrivate ? " (Privada)" : ""}
                                </button>
                            </li>
                        ))}
                    </ul>
                    {/* Se selecionou uma sala privada, pede o código */}
                    {selectedRoom && selectedRoom.isPrivate && (
                        <div style={{ marginTop: 20 }}>
                            <input className="code" 
                                type="text"
                                placeholder="Código da sala"
                                value={privateCode}
                                onChange={e => setPrivateCode(e.target.value)}
                            />
                            <button className="lobby-btn" onClick={handlePrivateJoin}>Entrar</button>
                            {error && <div style={{ color: 'red' }}>{error}</div>}
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', gap: 10, zIndex: 2, marginTop: 20 }}>
                    <button className='lobby-btn' onClick={onBack}>Voltar</button>
                </div>
            </div>
        </div>
    );
}