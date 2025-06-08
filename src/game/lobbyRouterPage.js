import React, { useState } from 'react';
import { Lobby } from './Lobby/lobby';
import { CreateRoom } from './Lobby/create';
import { JoinRoom } from './Lobby/join'; // Corrija para join.js
import { ChooseCar } from './Lobby/chooseCar'; // Corrija para ChooseCar

export default function LobbyRouterPage() {
    const [view, setView] = useState('lobby');
    const [carColor, setCarColor] = useState({ r: 255, g: 0, b: 0 });

    const handleCarChosen = () => {
        // avançar para o jogo, se quiser
        console.log('Carro escolhido:', carColor);
    };

    switch (view) {
        case 'create':
            return <CreateRoom onContinue={() => setView('car')} />;
        case 'join':
            return <JoinRoom onContinue={() => setView('car')} />;
        case 'car':
            return (
                <ChooseCar
                    carColor={carColor}
                    setCarColor={setCarColor}
                    onConfirm={handleCarChosen}
                    onBack={() => setView('lobby')}
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
