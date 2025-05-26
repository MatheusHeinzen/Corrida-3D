import { Car } from './car';
import { createInterlagosLight } from './interlagosLight';

let car;
let track;
let font;
let graphics3D;


export function setup(p5, canvasParentRef) {
    font = p5.loadFont('/SuperBlackMarker.ttf');
    // Reduza a resolução do canvas para aliviar processamento
    const canvas = p5.createCanvas(640, 480).parent(canvasParentRef);

    graphics3D = p5.createGraphics(640, 480, p5.WEBGL);

    track = createInterlagosLight(graphics3D);

    const start = track.points[0];
    car = new Car(start.x, start.y - 10, start.z, graphics3D);

    car.lapStartTime = p5.millis();
    car.lastLapTime = 0;

    // Garante foco para inputs globais apenas no canvas principal
    if (canvas && canvas.elt && typeof canvas.elt.focus === 'function') {
        canvas.elt.tabIndex = 0;
        canvas.elt.focus();
    }
}

export function draw(p5) {
    if (!graphics3D || !car || !track || !font) {
        console.log('Aguardando inicialização...');
        return;
    }

    // Céu azul escuro e menos saturado
    graphics3D.background(40, 60, 90);

    // Iluminação simples, sem sombras
    graphics3D.ambientLight(70, 70, 80);
    // Remova directionalLight e pointLight para evitar sombras e deixar mais leve

    updateCamera(graphics3D);

    car.update(p5, track);
    car.display(graphics3D);

    drawCheckpoints(graphics3D);
    track.draw();

    p5.image(graphics3D, 0, 0);

    drawScreenHUD(p5);
    drawMinimap(p5, track, car);
}

function drawScreenHUD(p5) {
    p5.push();
    p5.noStroke();
    p5.fill(255);
    p5.textSize(20);
    p5.textFont(font);
    p5.textAlign(p5.LEFT, p5.TOP);

    // Calcula tempos
    let tempoAtual = "--";
    let tempoUltima = "--";
    if (car.lapStartTime) {
        tempoAtual = ((p5.millis() - car.lapStartTime) / 1000).toFixed(2) + "s";
    }
    if (car.lastLapTime > 0) {
        tempoUltima = car.lastLapTime.toFixed(2) + "s";
    }

    // Posição do HUD
    const x = 30, y = 30;
    
    // Textos do HUD
    p5.text(`Voltas: ${car.laps}`, x, y);
    p5.text(`Tempo atual: ${tempoAtual}`, x, y + 30);
    p5.text(`Última volta: ${tempoUltima}`, x, y + 60);
    p5.text(`Velocidade: ${Math.abs(car.speed*3).toFixed(1)}`, x, y + 90);

    // FPS pequeno no canto superior esquerdo
    p5.textSize(12);
    p5.fill(180);
    p5.textAlign(p5.LEFT, p5.TOP);
    p5.text(`FPS: ${Math.round(p5.frameRate())}`, 8, 4);

    p5.pop();
}

function drawCheckpoints(pg) {
    if (!track || !track.points) return;

    // Desenha apenas um quadrado azul no ponto inicial
    const start = track.points[0];

    pg.push();
    pg.translate(start.x, start.y + 32, start.z);
    pg.noStroke();
    pg.fill(30, 120, 255);
    pg.box(60, 6, 60);
    pg.pop();
}

function updateCamera(pg) {
    let camDistance = 150;
    let camHeight = 70;
    let lookAhead = 60;

    let forwardX = Math.sin(car.rotation.y);
    let forwardZ = Math.cos(car.rotation.y);

    let camX = car.pos.x - camDistance * forwardX;
    let camY = car.pos.y + camHeight;
    let camZ = car.pos.z - camDistance * forwardZ;

    let lookX = car.pos.x + lookAhead * forwardX;
    let lookY = car.pos.y + 5;
    let lookZ = car.pos.z + lookAhead * forwardZ;

    pg.camera(camX, camY, camZ, lookX, lookY, lookZ, 0, -1, 0);
}

export function windowResized(p5) {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    if (graphics3D) {
        graphics3D.resizeCanvas(p5.windowWidth, p5.windowHeight);
    }
}

// Garanta que os inputs do teclado sejam globais
export function keyPressed(p5) {
    if (car && typeof car.keyPressed === 'function') {
        car.keyPressed(p5);
    }
}

function drawMinimap(p5, track, car) {
    const minimapSize = 200; // Tamanho do minimapa em pixels
    const padding = 20;      // Distância da borda da tela
    const scale = 0.003;       // Fator de escala dos pontos reais -> minimapa

    const offsetX = p5.width - minimapSize+80 - padding; 
    const offsetY = p5.height - minimapSize-180 - padding; 

    // Desenha a pista
    p5.stroke(255);
    p5.noFill();
    p5.beginShape();
    for (let pt of track.points) {
        const x = offsetX + pt.x * scale;
        const y = offsetY + pt.z * scale;
        p5.vertex(x, y);
    }
    p5.endShape();

    // Desenha o carro
    const carX = offsetX + car.pos.x * scale;
    const carY = offsetY + car.pos.z * scale;
    p5.fill(255, 0, 0);
    p5.circle(carX, carY, 8);

    p5.pop();
}