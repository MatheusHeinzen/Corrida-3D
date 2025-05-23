import { Car } from './car';
import { createInterlagosLight } from './interlagosLight';

let car;
let track;

export function setup(p5, canvasParentRef) {
    p5.createCanvas(800, 600, p5.WEBGL).parent(canvasParentRef);

    track = createInterlagosLight(p5);

    // Posiciona o carro na primeira coordenada da pista
    const start = track.points[0];  
    car = new Car(start.x, start.y - 10, start.z, p5);
}


export function draw(p5) {
    if (!car) return; // Garante que o carro foi inicializado

    p5.background(135, 206, 235); // Céu azul

    // Luz ambiente e direcional para sombra suave
    p5.ambientLight(80, 80, 80);
    p5.directionalLight(255, 255, 255, -1, -1, -0.5);

    // Posiciona câmera atrás e acima do carro
    updateCamera(p5);

    // Passe track para o update do carro
    car.update(p5, track);
    car.display(p5);
    track.draw();
}

// Câmera em 3ª pessoa, atrás e acima do carro, olhando levemente para baixo
function updateCamera(p5) {
    // Configurações da câmera
    let camDistance = 200;  // Distância atrás do carro
    let camHeight = 90;     // Altura da câmera (positivo = acima do carro)
    let lookAhead = 60;     // Quanto à frente a câmera olha

    // Direção do carro (forwardX/Z apontam para onde o carro está indo)
    let forwardX = Math.sin(car.rotation.y);
    let forwardZ = Math.cos(car.rotation.y);

    // Posição da câmera (atrás e acima do carro)
    let camX = car.pos.x - camDistance * forwardX;
    let camY = car.pos.y + camHeight;  // Aumente este valor para câmera mais alta
    let camZ = car.pos.z - camDistance * forwardZ;

    // Ponto de mira (à frente do carro, ligeiramente acima do chão)
    let lookX = car.pos.x + lookAhead * forwardX;
    let lookY = car.pos.y + 5;  // Ajuste este valor para olhar mais para baixo
    let lookZ = car.pos.z + lookAhead * forwardZ;

    // Vetor "up" invertido para corrigir a orientação (0, -1, 0 faz a câmera olhar para baixo)
    p5.camera(
        camX, camY, camZ,  // Posição da câmera
        lookX, lookY, lookZ,  // Ponto de mira
        0, -1, 0  // ⚠️ Vetor "up" invertido (0, -1, 0) para olhar para baixo
    );
}

// Adicione esta função para o canvas acompanhar o tamanho da janela
export function windowResized(p5) {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
}