import { Car } from './car';
import { generateTerrain } from './terrain';

let car;
let terrain = [];
let cols, rows;
let scl = 50; // Escala do terreno

export function setup(p5, canvasParentRef) {
    p5.createCanvas(800, 600, p5.WEBGL).parent(canvasParentRef);

    // Gera terreno (largura, profundidade, escala)
    [terrain, cols, rows] = generateTerrain(5000, 5000, scl, p5);

    // Calcula altura inicial do carro sobre o terreno (centro do mapa)
    const centerX = Math.floor(cols / 2);
    const centerY = Math.floor(rows);
    const terrainY = terrain[centerX][centerY];

    // Inicializa carro (posição X, Y, Z)
    car = new Car(0, terrainY + 1, 0, p5); // 15 para garantir que fique acima do solo
}

export function draw(p5) {
    if (!car) return; // Garante que o carro foi inicializado

    p5.background(135, 206, 235); // Céu azul

    // Luz direcional (sol)
    p5.directionalLight(255, 255, 255, -1, -1, -0.5);
    p5.ambientLight(100);

    // Posiciona câmera atrás e acima do carro
    updateCamera(p5);

    // Desenha terreno
    drawTerrain(p5);

    // Atualiza e desenha carro
    car.update(p5);
    car.display(p5);
}

// Câmera em 3ª pessoa, atrás e acima do carro, olhando levemente para baixo
function updateCamera(p5) {
    // Configurações da câmera
    let camDistance = 180;  // Distância atrás do carro
    let camHeight = 70;     // Altura da câmera (positivo = acima do carro)
    let lookAhead = 50;     // Quanto à frente a câmera olha

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

// Renderiza o terreno
function drawTerrain(p5) {
    p5.push();
    p5.noStroke();
    p5.fill(50, 180, 50); // Grama

    for (let y = 0; y < rows - 1; y++) {
        p5.beginShape(p5.TRIANGLE_STRIP);
        for (let x = 0; x < cols; x++) {
            let x1 = x * scl - cols * scl / 2;
            let z1 = y * scl - rows * scl / 2;
            let x2 = x * scl - cols * scl / 2;
            let z2 = (y + 1) * scl - rows * scl / 2;

            p5.vertex(x1, terrain[x][y], z1);
            p5.vertex(x2, terrain[x][y + 1], z2);
        }
        p5.endShape();
    }
    p5.pop();
}