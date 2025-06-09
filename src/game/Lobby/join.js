export function JoinRoom({ onContinue }) {
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
                    <h2>Procurar Sala</h2>
                    <form className="room-form">
                        <input type="text" placeholder="Código da sala" />
                    </form>
                    <button className="lobby-btn" style={{justifyContent: 'flex-end'}} onClick={onContinue}>Next</button>
                </div>
            </div>
        </div>
    );
}