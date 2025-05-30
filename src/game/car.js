export class Car {
    constructor(x, y, z, p5, playerId = null) {
        this.p5 = p5;
        this.pos = p5.createVector(x || 0, y || 0, z || 0);
        this.velocity = p5.createVector(0, 0, 0);
        this.acceleration = p5.createVector(0, 0, 0);
        this.rotation = { y: 90 };
        this.steeringAngle = 0;

        // Parâmetros físicos
        this.mass = 1000;
        this.enginePower = 900;
        this.brakePower = 300;
        this.dragCoefficient = 0.25; // levemente mais arrasto para dar mais "peso"
        this.rollingResistance = 0.02; // idem
        this.weightDistribution = 0.6;

        // Controle
        this.maxSteeringAngle = 0.3;
        this.steeringSpeed = 0.08;
        this.maxSpeed = 60;
        this.speed = 0;

        // Marchas
        this.gearRatios = [0.4, 0.4, 0.3, 0.25, 0.2];
        this.currentGear = 0;
        this.engineRPM = 0;

        // Visual
        this.wheelAngle = 0;
        this.roll = 0;
        this._wheelRotation = 0;

        // Corrida
        this.laps = 0;
        this.lapStartTime = 0;
        this.lastLapTime = 0;
        this.lastLapRegisterTime = 0;
        this.playerId = playerId;
        this.name = "Player " + (playerId ? playerId.substring(0, 5) : "AI");
    }

    update(p5, track, inputs = {}) {
        if (!this.p5) this.p5 = p5;

        this._collisionProcessed = false;

        let steerInput = 0;
        if (inputs.left) steerInput -= 1;
        if (inputs.right) steerInput += 1;
        this.steeringAngle = p5.lerp(
            this.steeringAngle,
            steerInput * this.maxSteeringAngle,
            this.steeringSpeed
        );

        const forward = p5.createVector(
            Math.sin(this.rotation.y),
            0,
            Math.cos(this.rotation.y)
        );

        let tractionForce = p5.createVector(0, 0, 0);
        const speed = this.velocity.mag();

        if (inputs.up) {
            const effectivePower = this.enginePower *
                p5.constrain(p5.sin(p5.map(this.engineRPM, 1000, 6000, 0, p5.PI)) * 1.5, 0.5, 1);
            tractionForce = forward.copy().mult(effectivePower);
        }

        if (inputs.down) {
            if (this.speed > 0.1) {
                const brakeForce = forward.copy().mult(-this.brakePower);
                tractionForce.add(brakeForce);
            } else {
                const reverseForce = forward.copy().mult(-(this.enginePower * 1));
                tractionForce.add(reverseForce);
            }
        }

        // Força de downforce (aumenta aderência com a velocidade)
        const downforceCoef = 2.5; // aumente para mais aderência
        const downforce = this.velocity.copy()
            .normalize()
            .mult(-downforceCoef * speed);

        // Forças de resistência
        const dragForce = this.velocity.copy()
            .mult(-1)
            .normalize()
            .mult(this.dragCoefficient * speed * speed);

        const rollingResistance = this.velocity.copy()
            .mult(-1)
            .normalize()
            .mult(this.rollingResistance * this.mass * 9.8);

        // 3. Aplicação de todas as forças
        this.acceleration = p5.createVector(0, 0, 0)
            .add(tractionForce)
            .add(dragForce)
            .add(rollingResistance)
            .add(downforce) // adiciona downforce
            .div(this.mass);

        this.velocity.add(this.acceleration);

        if (this.velocity.mag() > this.maxSpeed) {
            this.velocity.setMag(this.maxSpeed);
        }

        // Derrapagem aprimorada
        let lateralFriction = 1;
        let slipAngle = 0;

        const lateralVelocity = this.velocity.copy().cross(forward).mag();

        if (inputs.handbrake) {
            slipAngle = p5.constrain(lateralVelocity * 0.5, 0, 1);
            lateralFriction = 0.5;
        } else {
            slipAngle = p5.constrain(lateralVelocity * 0.05, 0, 0.3); // menos slip natural
            lateralFriction = p5.map(speed, 0, 60, 1.5, 1.1, true); // mais aderência em alta
        }

        const steeringEfficiency = (1 - slipAngle) * lateralFriction;

        this.rotation.y += this.steeringAngle * (speed / this.maxSpeed) * steeringEfficiency * 0.2;

        const turnRadius = 1 / (0.1 + Math.abs(this.steeringAngle));
        const centripetalForce = (speed * speed) / turnRadius;

        const lateralForce = forward.copy()
            .rotate(p5.HALF_PI)
            .mult(-centripetalForce * this.steeringAngle);

        if (inputs.handbrake) {
            this.velocity.add(lateralForce.mult(1 / this.mass));
        } else {
            this.velocity.add(lateralForce.mult(0.0002)); // menos escorregadio
        }

        // Lentidão fora da pista (aplica atrito extra se estiver longe do traçado)
        let minDist = Infinity;
        if (track && track.points && track.points.length > 1) {
            for (let i = 0; i < track.points.length - 1; i++) {
                const a = track.points[i];
                const b = track.points[i + 1];
                // Distância ponto-segmento 2D
                const t = ((this.pos.x - a.x) * (b.x - a.x) + (this.pos.z - a.z) * (b.z - a.z)) /
                    ((b.x - a.x) ** 2 + (b.z - a.z) ** 2);
                const tClamped = Math.max(0, Math.min(1, t));
                const projX = a.x + tClamped * (b.x - a.x);
                const projZ = a.z + tClamped * (b.z - a.z);
                const dist = p5.dist(this.pos.x, this.pos.z, projX, projZ);
                if (dist < minDist) minDist = dist;
            }
            // Fora do asfalto (ajuste o valor 120 conforme a largura da pista)
            if (minDist > 370) {
                this.velocity.mult(0.95); // aplica atrito extra fora da pista
            }
        }

        this.pos.add(this.velocity);

        const gearRatio = this.gearRatios[this.currentGear] || 1;
        const targetRPM = Math.abs(speed * 200 * gearRatio);
        this.engineRPM += (targetRPM - this.engineRPM + 600) * 0.08;

        if (this.currentGear === 0 && this.engineRPM > 1500) {
            this.currentGear++;
        } else if (
            this.currentGear > 0 &&
            this.currentGear < this.gearRatios.length - 1 &&
            this.engineRPM > (this.currentGear === 1 ? 2000 : 3000)
        ) {
            this.currentGear++;
        } else if (this.engineRPM < 1800 && this.currentGear > 0) {
            this.currentGear--;
        }

        this.adjustHeightToTrack(p5, track);
        this.updateLapSystem(p5, track);

        this.speed = speed;
        this.wheelAngle = this.steeringAngle * 2;
        this.roll = -this.steeringAngle * this.speed * 0.5;

        const forwardVel = this.velocity.dot(forward);
        this._wheelRotation += (forwardVel / 8);
    }

    adjustHeightToTrack(p5, track) {
        const wheelOffsets = [
            { x: -20, z: -25 }, { x: 20, z: -25 },
            { x: -20, z: 25 }, { x: 20, z: 25 }
        ];

        let avgHeight = 0;
        wheelOffsets.forEach(wheel => {
            const wheelPos = p5.createVector(
                this.pos.x + wheel.x,
                this.pos.z + wheel.z
            );
            avgHeight += this.getHeightAtPosition(p5, track, wheelPos);
        });
        avgHeight /= 4;

        const targetY = avgHeight + 0.3;
        const suspensionForce = (targetY - this.pos.y) * 0.2;
        this.velocity.y += suspensionForce;
        this.velocity.y *= 0.9;
    }

    getHeightAtPosition(p5, track, position = this.pos) {
        if (!track || !track.points) return position.y;
        let closest = track.points[0];
        let minDist = Infinity;
        for (let pt of track.points) {
            const d = p5.dist(position.x, position.z, pt.x, pt.z);
            if (d < minDist) {
                minDist = d;
                closest = pt;
            }
        }
        return closest.y + 10;
    }

    updateLapSystem(p5, track) {
        const start = track.points[1];
        const now = p5.millis();
        const dist = p5.dist(this.pos.x, this.pos.z, start.x, start.z);
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
        pg.rotateZ(this.roll * 0.02);
        this.drawWheels(pg);
        pg.rotateZ(this.roll * 0.02);
        this.drawBody(pg);
        this.drawExhaust(pg);
        pg.pop();

        if (this.collisionEffect && this.collisionEffect.time > 0) {
            pg.push();
            pg.translate(
                this.collisionEffect.pos.x,
                this.collisionEffect.pos.y + 5,
                this.collisionEffect.pos.z
            );
            pg.noStroke();
            pg.fill(255, 100, 0, 150);
            pg.sphere(10);
            pg.pop();
            this.collisionEffect.time--;
        }
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
            { x: -20, y: 0, z: -25, steer: true },
            { x: 20, y: 0, z: -25, steer: true },
            { x: -20, y: 0, z: 25, steer: false },
            { x: 20, y: 0, z: 25, steer: false }
        ];

        wheelPositions.forEach(wheel => {
            pg.push();
            pg.translate(wheel.x, wheel.y, wheel.z);
            pg.rotateZ(Math.PI / 2);
            if (wheel.steer) {
                pg.rotateY(this.steeringAngle);
            }
            pg.rotateY(this._wheelRotation);
            pg.push();
            pg.fill(40, 40, 40);
            pg.cylinder(8, 4);
            pg.pop();
            pg.pop();
        });
    }
}
