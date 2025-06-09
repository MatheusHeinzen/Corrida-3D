import React, { useState } from 'react';

export function CreateRoom({ onContinue }) {
    const [isPrivate, setIsPrivate] = useState(false);

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
                    <form className="room-form">
                        <input type="text" placeholder="Nome da sala" />
                        {isPrivate && (
                            <input type="text" placeholder="Código da sala" />
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
                    <button className='lobby-btn' onClick={onContinue}>Criar Sala</button>
                </div>
            </div>
        </div>
    );
}
