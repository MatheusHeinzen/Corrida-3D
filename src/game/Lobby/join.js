export function JoinRoom({ onContinue }) {
    return (
        <div style={{ padding: 20 }}>
            <h2>Entrar em Sala</h2>
            {/* Campos como nome, código da sala, etc */}
            <button onClick={onContinue}>Confirmar e Escolher Carro</button>
        </div>
    );
}