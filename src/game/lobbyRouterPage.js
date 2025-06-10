import React, { useState } from 'react';
import { Lobby } from './Lobby/lobby';
import { CreateRoom } from './Lobby/create';
import { JoinRoom } from './Lobby/join';
import { ChooseCar } from './Lobby/chooseCar';
import { WaitRoom } from './Lobby/waitRoom';

export default function LobbyRouterPage({ onStart, userId, p5 }) {
    const [view, setView] = useState('lobby');
    const [roomId, setRoomId] = useState(null);
    const [carClass, setCarClass] = useState(null);
    const [waitReady, setWaitReady] = useState(false);

    // Quando criar ou entrar numa sala, salva o roomId e vai para escolha de carro
    const handleCreateRoom = (roomId) => {
        setRoomId(roomId);
        setView('car');
    };
    const handleJoinRoom = (roomId) => {
        setRoomId(roomId);
        setView('car');
    };

    const handleCarChosen = (chosenCarClass) => {
        setCarClass(chosenCarClass);
        setWaitReady(true); // Vai para sala de espera
    };

    // Quando RaceStartSequence terminar, chama onStart
    const handleWaitRoomStart = () => {
        setWaitReady(false);
        if (onStart) onStart(roomId, carClass);
    };

    switch (view) {
        case 'create':
            return <CreateRoom onContinue={handleCreateRoom} />;
        case 'join':
            return <JoinRoom onContinue={handleJoinRoom} />;
        case 'car':
            // Se já escolheu o carro, vai para sala de espera
            if (waitReady) {
                return (
                    <WaitRoom
                        roomId={roomId}
                        userId={userId}
                        onStart={handleWaitRoomStart}
                        carClass={carClass}
                    />
                );
            }
            return (
                <ChooseCar
                    onConfirm={handleCarChosen}
                    onBack={() => setView('lobby')}
                    p5={p5}
                />
            );
        case 'lobby':
        default:
            return (
                <Lobby
                    onJoin={() => setView('join')}
                    onCreate={() => setView('create')}
                />
            );
    }
}
