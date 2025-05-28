export class Car {
    constructor(x, y, z, p5, playerId = null) {
        // Garante que this.pos sempre existe como objeto {x, y, z}
        this.pos = {
            x: typeof x === "number" ? x : 0,
            y: typeof y === "number" ? y : 0,
            z: typeof z === "number" ? z : 0
        };
        this.velocity = { x: 0, y: 0, z: 0 };
        this.playerId = playerId;
        this.rotation = { y: 90 };
        this.speed = 0;
        this.maxSpeed = 50;
        this.acceleration = 0.15;
        this.braking = 0.15;
        this.steering = 0.03;
        this.steeringReduction = 0.7;
        this.onGround = false;
        this.wheelAngle = 0;
        this.driftFactor = 0;
        this.roll = 0;
        this.color = { r: 200, g: 30, b: 30 };

        // Voltas e tempo
        this.laps = 0;
        this.lapStartTime = 0;
        this.lastLapTime = 0;

        // Controle de passagem pelo checkpoint inicial
        this.lastLapRegisterTime = 0;
    }

    getHeightAtPosition(p5, track) {
        if (!track || !track.points) return this.pos.y;
        let closest = track.points[0];
        let minDist = Infinity;
        for (let pt of track.points) {
            const d = p5.dist(this.pos.x, this.pos.z, pt.x, pt.z);
            if (d < minDist) {
                minDist = d;
                closest = pt;
            }
        }
        return closest.y;
    }

    // Remove keyPressed(), controles agora são externos via "inputs"
    update(p5, track, inputs = {}) {
        // inputs: { up, down, left, right, handbrake }
        // Controles de aceleração/freio
        if (inputs.up) {
            this.speed += this.acceleration;
        } else if (inputs.down) {
            this.speed = Math.max(this.speed - this.braking, -this.maxSpeed * 0.4);
        } else if (inputs.handbrake) {
            if (this.speed > 0) {
                this.speed = Math.max(this.speed - this.braking * 1.1, 0);
            } else if (this.speed < 0) {
                this.speed = Math.min(this.speed + this.braking * 2, 0);
            }
        } else {
            this.speed *= 0.99;
        }

        // Limita velocidade
        this.speed = Math.min(Math.max(this.speed, -this.maxSpeed * 0.4), this.maxSpeed);

        // Controle de direção
        let steerInput = 0;
        if (inputs.left) steerInput -= 1;
        if (inputs.right) steerInput += 1;

        if (Math.abs(this.speed) > 0.1) {
            const speedFactor = 1 - Math.min(Math.abs(this.speed) / this.maxSpeed, 1);
            const steeringEffect = this.steering * (0.5 + 1.5 * speedFactor);

            this.wheelAngle = steerInput * steeringEffect;
            this.rotation.y += this.wheelAngle * (1 - this.driftFactor);

            if (Math.abs(this.wheelAngle) > 0.1 && speedFactor > 0.3) {
                this.driftFactor = Math.min(this.driftFactor + 0.04, 0.6);
            } else {
                this.driftFactor = Math.max(this.driftFactor - 0.01, 0);
            }

            this.roll = -this.wheelAngle * this.speed * 0.7;
        } else {
            this.wheelAngle *= 0.9;
            this.roll *= 0.8;
        }

        // Movimento baseado na rotação
        this.velocity.x = Math.sin(this.rotation.y) * this.speed;
        this.velocity.z = Math.cos(this.rotation.y) * this.speed;
        this.pos.x += this.velocity.x;
        this.pos.z += this.velocity.z;

        // Ajusta altura do carro com base na pista
        const targetY = this.getHeightAtPosition(p5, track);
        const diffY = targetY - this.pos.y;
        this.velocity.y = diffY * 0.4;
        this.pos.y += this.velocity.y;

        if (this.pos.y < targetY + 15) {
            this.pos.y = targetY + 15;
            this.velocity.y = 0;
        }

        // Inicializa o tempo de volta na primeira chamada
        if (this.lapStartTime === 0) {
            this.lapStartTime = p5.millis();
        }

        // Sistema de checkpoint: só considera o ponto inicial
        this.updateLapSystem(p5, track);

        // Limite de pista: desacelera só se estiver fora do asfalto (distância do segmento mais próximo)
        if (track && track.points && track.points.length > 1) {
            let minDist = Infinity;
            for (let i = 0; i < track.points.length - 1; i++) {
                const a = track.points[i];
                const b = track.points[i + 1];
                const dist = pointToSegmentDistance(this.pos.x, this.pos.z, a.x, a.z, b.x, b.z);
                if (dist < minDist) minDist = dist;
            }
            if (minDist > 250) {
                this.speed *= 0.95;
                let closestSeg = 0;
                minDist = Infinity;
                let closestPt = { x: 0, z: 0 };
                for (let i = 0; i < track.points.length - 1; i++) {
                    const a = track.points[i];
                    const b = track.points[i + 1];
                    const proj = closestPointOnSegment(this.pos.x, this.pos.z, a.x, a.z, b.x, b.z);
                    const dist = p5.dist(this.pos.x, this.pos.z, proj.x, proj.z);
                    if (dist < minDist) {
                        minDist = dist;
                        closestSeg = i;
                        closestPt = proj;
                    }
                }
                let dir = p5.createVector(closestPt.x - this.pos.x, 0, closestPt.z - this.pos.z);
                dir.setMag(0.5);
                this.pos.x += dir.x;
                this.pos.z += dir.z;
            }
        }
    }

    updateLapSystem(p5, track) {
        // Só existe um checkpoint: o ponto inicial
        const start = track.points[1];
        const now = p5.millis();
        const dist = p5.dist(this.pos.x, this.pos.z, start.x, start.z);

        // Só conta a volta se estiver suficientemente perto e passou 15s desde a última
        if (dist < 70 && now - (this.lastLapRegisterTime || 0) > 15000) {
            this.laps += 1;
            this.lastLapTime = (now - this.lapStartTime) / 1000;
            this.lapStartTime = now;
            this.lastLapRegisterTime = now;
        }
    }

    display(pg) {
        pg.push();
        pg.translate(this.pos.x, this.pos.y, this.pos.z);
        pg.rotateY(this.rotation.y);
        pg.rotateZ(this.roll * 0.05);

        this.drawBody(pg);
        this.drawExhaust(pg);
        this.drawWheels(pg);

        pg.pop();
    }

    drawBody(pg) {
        pg.push();
        pg.fill(180, 30, 30);
        pg.push();
        pg.box(40, 12, 60);
        pg.pop();

        pg.push();
        pg.translate(0, 10, -9);
        pg.box(38, 12, 40);
        pg.pop();

        pg.pop();
    }

    drawExhaust(pg) {
        pg.push();
        pg.translate(0, 0, -31);
        pg.specularMaterial(80);

        for (let x of [-8, 8]) {
            pg.push();
            pg.translate(x, 0, 0);
            pg.cylinder(2, 6);
            pg.pop();
        }
        pg.pop();
    }

    drawWheels(pg) {
        const wheelPositions = [
            { x: -20, y: 0, z: -25, steer: false },
            { x: 20, y: 0, z: -25, steer: false },
            { x: -20, y: 0, z: 25, steer: true },
            { x: 20, y: 0, z: 25, steer: true }
        ];

        if (this._wheelRotation === undefined) this._wheelRotation = 0;
        this._wheelRotation += this.speed * -0.2;

        wheelPositions.forEach(wheel => {
            pg.push();
            pg.translate(wheel.x, wheel.y, wheel.z);

            pg.rotateZ(Math.PI / 2);

            if (wheel.steer) {
                pg.rotateX(this.wheelAngle * 5);
            }

            pg.rotateY(this._wheelRotation);

            // Pneu cinza escuro
            pg.push();
            pg.fill(40, 40, 40);
            pg.cylinder(8, 4);
            pg.pop();

            pg.pop();
        });
    }
}

// Função utilitária: distância ponto-segmento 2D
function pointToSegmentDistance(px, pz, x1, z1, x2, z2) {
    const vx = x2 - x1;
    const vz = z2 - z1;
    const wx = px - x1;
    const wz = pz - z1;
    const c1 = vx * wx + vz * wz;
    if (c1 <= 0) return Math.sqrt(wx * wx + wz * wz);
    const c2 = vx * vx + vz * vz;
    if (c2 <= c1) return Math.sqrt((px - x2) ** 2 + (pz - z2) ** 2);
    const b = c1 / c2;
    const bx = x1 + b * vx;
    const bz = z1 + b * vz;
    return Math.sqrt((px - bx) ** 2 + (pz - bz) ** 2);
}

// Função utilitária: ponto mais próximo no segmento
function closestPointOnSegment(px, pz, x1, z1, x2, z2) {
    const vx = x2 - x1;
    const vz = z2 - z1;
    const wx = px - x1;
    const wz = pz - z1;
    const c1 = vx * wx + vz * wz;
    const c2 = vx * vx + vz * vz;
    let b = 0;
    if (c2 > 0) b = Math.max(0, Math.min(1, c1 / c2));
    return {
        x: x1 + b * vx,
        z: z1 + b * vz
    };
}