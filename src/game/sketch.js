import { McQueen, ORei, ChickHicks } from './car';
// import { createInterlagosLight } from './interlagosLight';

let car;
let font;
let graphics3D;

// Variáveis para câmera livre
let camYaw = 0;
let camPitch = 0;
let lastMouseX = null;
let lastMouseY = null;
let mouseDragging = false;

export function setup(p5, canvasParentRef) {
    font = p5.loadFont('/SuperBlackMarker.ttf');
    const canvas = p5.createCanvas(640, 480).parent(canvasParentRef);

    graphics3D = p5.createGraphics(640, 480, p5.WEBGL);

    // track = createInterlagosLight(graphics3D);
    // Para teste, não usa pista
    car = new ChickHicks(0, 0, 0, graphics3D);

    if (canvas && canvas.elt && typeof canvas.elt.focus === 'function') {
        canvas.elt.tabIndex = 0;
        canvas.elt.focus();
    }

    // Eventos para mouse drag (câmera livre)
    p5.canvas.onmousedown = (e) => {
        mouseDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    };
    p5.canvas.onmouseup = () => {
        mouseDragging = false;
    };
    p5.canvas.onmouseleave = () => {
        mouseDragging = false;
    };
    p5.canvas.onmousemove = (e) => {
        if (mouseDragging) {
            let dx = e.clientX - lastMouseX;
            let dy = e.clientY - lastMouseY;
            camYaw += dx * 0.01;
            camPitch += dy * 0.01;
            camPitch = Math.max(-Math.PI/2 + 0.1, Math.min(Math.PI/2 - 0.1, camPitch));
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        }
    };
}

export function draw(p5) {
    if (!graphics3D || !car || !font) {
        console.log('Aguardando inicialização...');
        return;
    }

    graphics3D.background(40, 60, 90);
    graphics3D.ambientLight(70, 70, 80);

    updateCamera(graphics3D);

    car.update(p5);
    car.display(graphics3D);

    p5.image(graphics3D, 0, 0);

    drawScreenHUD(p5);
}

function drawScreenHUD(p5) {
    p5.push();
    p5.noStroke();
    p5.fill(255);
    p5.textSize(20);
    p5.textFont(font);
    p5.textAlign(p5.LEFT, p5.TOP);

    // Posição do HUD
    const x = 30, y = 30;
    p5.text(`Pos: (${car.pos.x.toFixed(1)}, ${car.pos.z.toFixed(1)})`, x, y);
    p5.text(`Velocidade: ${Math.abs(car.speed*3).toFixed(1)}`, x, y + 30);

    // FPS pequeno no canto superior esquerdo
    p5.textSize(12);
    p5.fill(180);
    p5.textAlign(p5.LEFT, p5.TOP);
    p5.text(`FPS: ${Math.round(p5.frameRate())}`, 8, 4);

    p5.pop();
}

function updateCamera(pg) {
    // Câmera livre controlada pelo mouse
    let camDistance = 200;
    let camHeight = 60;

    let camX = car.pos.x + camDistance * Math.sin(camYaw) * Math.cos(camPitch);
    let camY = car.pos.y + camHeight + camDistance * Math.sin(camPitch);
    let camZ = car.pos.z + camDistance * Math.cos(camYaw) * Math.cos(camPitch);

    pg.camera(
        camX, camY, camZ,
        car.pos.x, car.pos.y, car.pos.z,
        0, -1, 0
    );
}

export function windowResized(p5) {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    if (graphics3D) {
        graphics3D.resizeCanvas(p5.windowWidth, p5.windowHeight);
    }
}

export function keyPressed(p5) {
    if (car && typeof car.keyPressed === 'function') {
        car.keyPressed(p5);
    }
}