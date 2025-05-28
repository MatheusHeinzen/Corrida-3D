import { joinRoom, updatePlayer, syncRoom } from './firebase/firebaseActions';
import { Car } from './game/car';
import { createInterlagosLight } from './game/interlagosLight';

let car;
let otherCars = {};
let track;
let font;
let graphics3D;
let roomId = "race1";
let playerId = Math.random().toString(36).substring(7);

export function setup(p5, canvasParentRef) {
    font = p5.loadFont(process.env.PUBLIC_URL + '/SuperBlackMarker.ttf');
    const canvas = p5.createCanvas(854, 480).parent(canvasParentRef);

    graphics3D = p5.createGraphics(854, 480, p5.WEBGL);

    track = createInterlagosLight(graphics3D);

    const start = track.points[1];
    car = new Car(start.x, start.y - 10, start.z, p5, playerId);

    // Entra na sala e sincroniza multiplayer
    joinRoom(roomId, playerId, {
        name: "Player " + playerId,
        position: { x: car.pos.x, y: car.pos.y, z: car.pos.z },
        rotationY: car.rotation.y,
        speed: 0,
        laps: 0
    });

    syncRoom(roomId, (roomData) => {
        if (!roomData) return;
        for (const [id, data] of Object.entries(roomData.players)) {
            if (id !== playerId) {
                if (!otherCars[id]) {
                    otherCars[id] = new Car(data.position.x, data.position.y, data.position.z, p5, id);
                }
                otherCars[id].pos = { ...data.position };
                otherCars[id].rotation.y = data.rotationY;
                otherCars[id].speed = data.speed;
                otherCars[id].laps = data.laps;
            }
        }
        // Remove carros de jogadores que saíram
        for (const id in otherCars) {
            if (!roomData.players[id]) {
                delete otherCars[id];
            }
        }
    });

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

    graphics3D.background(40, 60, 90);
    graphics3D.ambientLight(70, 70, 80);

    updateCamera(graphics3D);

    car.update(p5, track, getInputs(p5));
    updatePlayer(roomId, playerId, {
        position: { ...car.pos },
        rotationY: car.rotation.y,
        speed: car.speed,
        laps: car.laps
    });

    car.display(graphics3D);
    for (const id in otherCars) {
        otherCars[id].display(graphics3D);
    }

    drawCheckpoints(graphics3D);
    track.draw();

    p5.image(graphics3D, 0, 0);

    drawScreenHUD(p5);
    drawMinimap(p5, track, car, otherCars);
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
    const start = track.points[1];

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

// Não precisa mais de keyPressed, controles são via getInputs

function drawMinimap(p5, track, car, otherCars) {
    const minimapSize = 200;
    const padding = 20;
    const scale = 0.003;

    const offsetX = p5.width - minimapSize + 80 - padding;
    const offsetY = p5.height - minimapSize - 180 - padding;

    p5.stroke(255);
    p5.noFill();
    p5.beginShape();
    for (let pt of track.points) {
        const x = offsetX + pt.x * scale;
        const y = offsetY + pt.z * scale;
        p5.vertex(x, y);
    }
    p5.endShape();

    // Carro local
    const carX = offsetX + car.pos.x * scale;
    const carY = offsetY + car.pos.z * scale;
    p5.fill(255, 0, 0);
    p5.circle(carX, carY, 8);

    // Carros remotos
    for (const id in otherCars) {
        const oc = otherCars[id];
        const rX = offsetX + oc.pos.x * scale;
        const rY = offsetY + oc.pos.z * scale;
        p5.fill(0, 180, 255);
        p5.circle(rX, rY, 8);
    }

    p5.pop();
}

// Captura inputs do teclado
function getInputs(p5) {
    return {
        up: p5.keyIsDown(87),    // W
        down: p5.keyIsDown(83),  // S
        left: p5.keyIsDown(65),  // A
        right: p5.keyIsDown(68), // D
        handbrake: p5.keyIsDown(32)
    };
}