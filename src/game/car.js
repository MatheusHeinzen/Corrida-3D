export class Car {
    constructor(x, y, z, p5) {
        this.pos = { x, y, z };
        this.velocity = { x: 0, y: 0, z: 0 };
        this.rotation = { x: 0, y: 90, z: 0 };
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

        // Voltas e tempo (não usados para teste isolado)
        this.laps = 0;
        this.lapStartTime = 0;
        this.lastLapTime = 0;

        // Controle de passagem pelo checkpoint inicial (não usado)
        this.lastLapRegisterTime = 0;
    }

    getHeightAtPosition(p5, track) {
        // Para teste, mantenha o carro sempre no plano y = 0
        return 0;
    }

    update(p5, track) {
        // Controles de aceleração/freio
        if (p5.keyIsDown(87)) { // W
            this.speed += this.acceleration;
        } else if (p5.keyIsDown(83)) { // S
            this.speed = Math.max(this.speed - this.braking, -this.maxSpeed * 0.4);
        } else if (p5.keyIsDown(32)) { // Espaço
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
        if (Math.abs(this.speed) > 0.1) {
            let steerInput = 0;
            if (p5.keyIsDown(65)) steerInput -= 1; // A
            if (p5.keyIsDown(68)) steerInput += 1; // D

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

        // Mantém o carro no plano y = 0
        this.pos.y = 0;
    }

    display(p5) {
        p5.push();
        p5.translate(this.pos.x, this.pos.y, this.pos.z);
        p5.rotateY(this.rotation.y);
        p5.rotateZ(this.roll * 0.05);

        this.drawBody(p5);
        this.drawExhaust(p5);
        this.drawWheels(p5);

        p5.pop();
    }

    drawBody(p5) {
        p5.push();
        p5.fill(180, 30, 30);
        p5.push();
        p5.box(40, 12, 60);
        p5.pop();

        p5.push();
        p5.translate(0, 10, -9);
        p5.box(38, 12, 40);
        p5.pop();

        p5.pop();
    }

    drawExhaust(p5) {
        p5.push();
        p5.translate(0, 0, -31);
        p5.specularMaterial(80);

        for (let x of [-8, 8]) {
            p5.push();
            p5.translate(x, 0, 0);
            p5.cylinder(2, 6);
            p5.pop();
        }
        p5.pop();
    }

    drawWheels(p5) {
        const wheelPositions = [
            { x: -20, y: 0, z: -25, steer: false },
            { x: 20, y: 0, z: -25, steer: false },
            { x: -20, y: 0, z: 25, steer: true },
            { x: 20, y: 0, z: 25, steer: true }
        ];

        if (this._wheelRotation === undefined) this._wheelRotation = 0;
        this._wheelRotation += this.speed * -0.2;

        wheelPositions.forEach(wheel => {
            p5.push();
            p5.translate(wheel.x, wheel.y, wheel.z);

            p5.rotateZ(Math.PI / 2);

            if (wheel.steer) {
                p5.rotateX(this.wheelAngle * 5);
            }

            p5.rotateY(this._wheelRotation);

            // Pneu cinza escuro
            p5.push();
            p5.fill(40, 40, 40);
            p5.cylinder(8, 4);
            p5.pop();

            p5.pop();
        });
    }
}

// // Função utilitária: distância ponto-segmento 2D
// function pointToSegmentDistance(px, pz, x1, z1, x2, z2) {
//     const vx = x2 - x1;
//     const vz = z2 - z1;
//     const wx = px - x1;
//     const wz = pz - z1;
//     const c1 = vx * wx + vz * wz;
//     if (c1 <= 0) return Math.sqrt(wx * wx + wz * wz);
//     const c2 = vx * vx + vz * vz;
//     if (c2 <= c1) return Math.sqrt((px - x2) ** 2 + (pz - z2) ** 2);
//     const b = c1 / c2;
//     const bx = x1 + b * vx;
//     const bz = z1 + b * vz;
//     return Math.sqrt((px - bx) ** 2 + (pz - bz) ** 2);
// }

// // Função utilitária: ponto mais próximo no segmento
// function closestPointOnSegment(px, pz, x1, z1, x2, z2) {
//     const vx = x2 - x1;
//     const vz = z2 - z1;
//     const wx = px - x1;
//     const wz = pz - z1;
//     const c1 = vx * wx + vz * wz;
//     const c2 = vx * vx + vz * vz;
//     let b = 0;
//     if (c2 > 0) b = Math.max(0, Math.min(1, c1 / c2));
//     return {
//         x: x1 + b * vx,
//         z: z1 + b * vz
//     };
// }