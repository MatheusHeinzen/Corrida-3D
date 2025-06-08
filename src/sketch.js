import { getDatabase, ref, set, onValue, remove } from "firebase/database";
import { v4 as uuidv4 } from "uuid"; // npm install uuid
import { Car } from './game/car';
import { createInterlagosLight } from './game/interlagosLight';

let car;
let otherCars = {};
let track;
let font;
let graphics3D;
let playerId = null;
let roomId = null; // agora será definido dinamicamente
let db = null;

function getOrCreatePlayerId() {
    let id = sessionStorage.getItem('playerId');
    if (!id) {
        id = uuidv4();
        sessionStorage.setItem('playerId', id);
    }
    return id;
}

export function setup(p5, canvasParentRef) {
    font = p5.loadFont(process.env.PUBLIC_URL + '/SuperBlackMarker.ttf');
    const canvas = p5.createCanvas(854, 480).parent(canvasParentRef);

    graphics3D = p5.createGraphics(854, 480, p5.WEBGL);

    track = createInterlagosLight(graphics3D);

    playerId = getOrCreatePlayerId();
    const start = track.points[1];
    car = new Car(start.x, start.y - 10, start.z, p5, playerId);
    car.name = "Player " + playerId.substring(0, 5);

    // Definir sala automaticamente para até 3 jogadores por sala
    selectAvailableRoom(p5, () => {
        setupFirebase();
        if (canvas && canvas.elt && typeof canvas.elt.focus === 'function') {
            canvas.elt.tabIndex = 0;
            canvas.elt.focus();
        }
    });
}

function selectAvailableRoom(p5, callback) {
    db = getDatabase();
    const roomsRef = ref(db, `rooms`);
    // Busca todas as salas e encontra uma com menos de 3 jogadores, ou cria uma nova
    onValue(roomsRef, (snapshot) => {
        const rooms = snapshot.val() || {};
        let foundRoom = null;
        let foundCount = 0;
        let minRoomNum = 1;
        // Procura sala com menos de 3 jogadores
        for (let key in rooms) {
            const players = rooms[key]?.players || {};
            const count = Object.keys(players).length;
            if (count < 3) {
                foundRoom = key;
                foundCount = count;
                break;
            }
            // Descobre o maior número de sala já criado
            const match = key.match(/^race(\d+)$/);
            if (match) {
                minRoomNum = Math.max(minRoomNum, parseInt(match[1]) + 1);
            }
        }
        if (foundRoom) {
            roomId = foundRoom;
        } else {
            // Cria nova sala sequencial
            roomId = `race${minRoomNum}`;
        }
        callback();
    }, { onlyOnce: true });
}

function setupFirebase() {
    db = getDatabase();

    const carRef = ref(db, `rooms/${roomId}/players/${playerId}`);
    const start = track.points[1];

    const carsRef = ref(db, `rooms/${roomId}/players`);
    onValue(carsRef, (snapshot) => {
        const allCars = snapshot.val() || {};
        delete allCars[playerId];
        otherCars = allCars;
    });

    // Adiciona o próprio jogador à sala (já garantido que a sala tem vaga)
    const initialCar = {
        name: car.name,
        position: { x: start.x, y: start.y - 10, z: start.z },
        rotationY: 0,
        speed: 0,
        laps: 0
    };
    set(carRef, initialCar);

    window.addEventListener("beforeunload", () => {
        remove(carRef);
    });
}

// Exemplo de função para atualizar o próprio carro
function updateMyCar() {
    if (!db || !playerId) return;

    const carRef = ref(db, `rooms/${roomId}/players/${playerId}`);
    set(carRef, {
        name: car.name,
        position: { x: car.pos.x, y: car.pos.y, z: car.pos.z },
        velocity: { x: car.velocity.x, y: car.velocity.y, z: car.velocity.z },
        rotationY: car.rotation.y,
        speed: car.speed,
        laps: car.laps,
        // driftFactor pode ser undefined se não existir na classe Car
        driftFactor: typeof car.driftFactor === "number" ? car.driftFactor : 0
    }).catch((err) => {
        // Log detalhado para depuração
        console.error("Erro ao salvar carro no Firebase:", err, {
            driftFactor: car.driftFactor,
            car
        });
    });
}

function handleCarCollisions(p5, localCar, remoteCars) {
    const carRadius = 25;
    const restitution = 0.7;
    const responseFactor = 0.5;

    if (localCar._collisionProcessed) return;
    localCar._collisionProcessed = true;

    for (const id in remoteCars) {
        const remoteData = remoteCars[id];
        if (!remoteData || !remoteData.position) continue;

        const localPos = p5.createVector(localCar.pos.x, localCar.pos.z);
        const remotePos = p5.createVector(remoteData.position.x, remoteData.position.z);
        const dist = localPos.dist(remotePos);

        if (dist < carRadius * 2) {
            const overlap = (carRadius * 2 - dist) * responseFactor;
            const dx = localPos.x - remotePos.x;
            const dz = localPos.y - remotePos.y;
            const mag = Math.sqrt(dx * dx + dz * dz) || 1;
            const direction = { x: dx / mag, z: dz / mag };

            localCar.pos.x += direction.x * overlap;
            localCar.pos.z += direction.z * overlap;

            const localVel = p5.createVector(localCar.velocity.x, localCar.velocity.z);
            const remoteVel = p5.createVector(
                remoteData.velocity?.x || 0,
                remoteData.velocity?.z || 0
            );

            // Corrige: calcula normal corretamente (linha 130)
            // Não use p5.createVector para normal, use objeto simples para evitar confusão de componentes
            const normal = { x: direction.x, z: direction.z };
            const relVel = {
                x: localVel.x - remoteVel.x,
                z: localVel.y - remoteVel.y
            };
            const velAlongNormal = relVel.x * normal.x + relVel.z * normal.z;

            if (velAlongNormal > 0) continue;

            const j = -(1 + restitution) * velAlongNormal;
            const impulse = { x: normal.x * j, z: normal.z * j };

            const impulseFactor = 0.5;
            localCar.velocity.x += impulse.x * impulseFactor;
            localCar.velocity.z += impulse.z * impulseFactor;

            localCar.collisionEffect = {
                time: 10,
                pos: { x: localCar.pos.x, y: localCar.pos.y, z: localCar.pos.z }
            };

            console.log('Colisão detectada:', {
                localPos,
                remotePos,
                impulse,
                newVelocity: localCar.velocity
            });
        }
    }
}

export function draw(p5) {
    // Log para garantir que o draw está rodando
    console.log("draw chamado");

    if (!graphics3D || !car || !track || !font) {
        console.log('Aguardando inicialização...');
        return;
    }

    graphics3D.background(40, 60, 90);
    graphics3D.ambientLight(70, 70, 80);

    updateCamera(graphics3D);

    car.update(p5, track, getInputs(p5));

    // Colisão com outros carros
    handleCarCollisions(p5, car, otherCars);

    updateMyCar();

    car.display(graphics3D);

    // Log do objeto otherCars
    console.log("otherCars:", otherCars);

    // Desenhar outros carros (instanciar Car temporário)
    for (const id in otherCars) {
        const data = otherCars[id];
        if (!data || !data.position) continue;

        const tempCar = new Car(
            data.position.x,
            data.position.y,
            data.position.z,
            p5,
            id
        );

        // Atualizar propriedades físicas
        if (data.velocity) {
            tempCar.velocity.set(data.velocity.x, data.velocity.y, data.velocity.z);
        }
        tempCar.rotation.y = data.rotationY || 0;
        tempCar.speed = data.speed || 0;
        tempCar.laps = data.laps || 0;
        tempCar.driftFactor = data.driftFactor || 0;

        tempCar.display(graphics3D);
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

    // Velocímetro, marcha e RPM
    const velocidade = Math.abs(car.speed * 5).toFixed(1); // m/s para km/h
    const marcha = (car.currentGear + 1); // gears começam em 0
    const rpm = Math.round(car.engineRPM);

    p5.text(`Velocidade: ${velocidade} km/h`, x, y + 90);
    p5.text(`Marcha: ${marcha}`, x, y + 120);
    p5.text(`RPM: ${rpm}`, x, y + 150);

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
        if (!oc || !oc.position) continue;
        const rX = offsetX + oc.position.x * scale;
        const rY = offsetY + oc.position.z * scale;
        p5.fill(0, 180, 255);
        p5.circle(rX, rY, 8);
    }
}

// Captura inputs do teclado
function getInputs(p5) {
    return {
        up: p5.keyIsDown(87),    // W
        down: p5.keyIsDown(83),  // S
        left: p5.keyIsDown(65),  // A
        right: p5.keyIsDown(68), // D
    };
}