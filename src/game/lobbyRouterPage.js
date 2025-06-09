import React, { useState } from 'react';
import { Lobby } from './Lobby/lobby';
import { CreateRoom } from './Lobby/create';
import { JoinRoom } from './Lobby/join';
import { ChooseCar } from './Lobby/chooseCar';

export default function LobbyRouterPage({ onStart, userId, p5 }) {
    const [view, setView] = useState('lobby');
    const [roomId, setRoomId] = useState(null);
    const [carClass, setCarClass] = useState(null);

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
        // Avança para o jogo, passando o roomId e a classe do carro escolhido
        if (onStart) onStart(roomId, chosenCarClass); // <-- Passe roomId e carro
    };

    switch (view) {
        case 'create':
            return <CreateRoom onContinue={handleCreateRoom} />;
        case 'join':
            return <JoinRoom onContinue={handleJoinRoom} />;
        case 'car':
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
