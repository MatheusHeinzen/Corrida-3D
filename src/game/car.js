export class BaseCar {
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

        // Propriedades que podem ser customizadas pelas subclasses
        this.color = { r: 200, g: 30, b: 30 };
        this.bodySize = { width: 40, height: 12, length: 70 };
        this.topSize = { width: 38, height: 12, length: 40 };

        // Voltas e tempo
        this.laps = 0;
        this.lapStartTime = 0;
        this.lastLapTime = 0;
        this.lastLapRegisterTime = 0;

        // Roda animation
        this._wheelRotation = 0;
    }

    // Métodos de movimento (compartilhados por todos os carros)
    getHeightAtPosition(p5, track) {
        return 0;
    }

    update(p5, track) {
        // Controles de aceleração/freio (mesmo para todos os carros)
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

        this.velocity.x = Math.sin(this.rotation.y) * this.speed;
        this.velocity.z = Math.cos(this.rotation.y) * this.speed;
        this.pos.x += this.velocity.x;
        this.pos.z += this.velocity.z;
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

    // Métodos de desenho que podem ser sobrescritos pelas subclasses
    drawBody(p5) {
        p5.fill(this.color.r, this.color.g, this.color.b);
        p5.box(this.bodySize.width, this.bodySize.height, this.bodySize.length);
    }

    drawExhaust(p5) {
        p5.push();
        p5.translate(0, 0, -this.bodySize.length / 2);
        p5.fill(40, 40, 40);

        for (let x of [-8, 8]) {
            p5.push();
            p5.translate(x, 0, -1);
            p5.rotateX(Math.PI / 2)
            p5.cylinder(2, 6);
            p5.pop();
        }
        p5.pop();
    }

    drawWheels(p5) {
        const wheelPositions = [
            { x: -this.bodySize.width / 2, y: 0, z: -this.bodySize.length / 3, steer: false },
            { x: this.bodySize.width / 2, y: 0, z: -this.bodySize.length / 3, steer: false },
            { x: -this.bodySize.width / 2, y: 0, z: this.bodySize.length / 3, steer: true },
            { x: this.bodySize.width / 2, y: 0, z: this.bodySize.length / 3, steer: true }
        ];

        this._wheelRotation += this.speed * -0.2;

        wheelPositions.forEach(wheel => {
            p5.push();
            p5.translate(wheel.x, wheel.y, wheel.z);
            p5.rotateZ(Math.PI / 2);

            if (wheel.steer) {
                p5.rotateX(this.wheelAngle * 5);
            }

            p5.rotateY(this._wheelRotation);
            p5.fill(40, 40, 40);
            p5.cylinder(8, 4, 12);
            p5.pop();
        });
    }
}

//McQueen
export class McQueen extends BaseCar {
    constructor(x, y, z, p5) {
        super(x, y, z, p5);
        this.color = { r: 180, g: 30, b: 30 };
    }

    drawBody(p5) {
        p5.push();
        p5.fill(this.color.r, this.color.g, this.color.b);
        // Caixa de baixo
        p5.push();
        p5.box(40, 12, 70);
        p5.pop();

        // Caixa de Cima
        p5.push();
        p5.translate(0, 10, 0);
        p5.box(38, 12, 40);
        p5.pop();

        // Triangulo em cima direita
        p5.push();
        p5.translate(18, 10, -20);
        p5.cone(8, 12, 3)
        p5.pop();

        // Triangulo em cima esquerda
        p5.push();
        p5.translate(-18, 10, -20);
        p5.cone(8, 12, 3)
        p5.pop();

        // Completa os 2 triangulos
        p5.push();
        p5.translate(0, 10, -23);
        p5.rotateX(40 * Math.PI / 180);
        p5.plane(38, 12, 4);
        p5.pop();

        // Aerofólio
        p5.push();
        p5.translate(0, 9, -34);
        p5.box(38, 6, 1)
        p5.pop();
        p5.pop();
    }
}

//Strip Weathers
export class ORei extends BaseCar {
    constructor(x, y, z, p5) {
        super(x, y, z, p5);
        this.color = { r: 30, g: 120, b: 240 };
    }

    drawBody(p5) {
        p5.push();
        p5.fill(this.color.r, this.color.g, this.color.b);
        // Caixa de baixo
        p5.push();
        p5.box(40, 12, 75);
        p5.pop();

        // Caixa de Cima
        p5.push();
        p5.translate(0, 10, 0);
        p5.box(38, 12, 40);
        p5.pop();

        // Triangulo em cima direita
        p5.push();
        p5.translate(18, 10, -20);
        p5.cone(8, 12, 3);
        p5.pop();

        // Triangulo em cima esquerda
        p5.push();
        p5.translate(-18, 10, -20);
        p5.cone(8, 12, 3);
        p5.pop();

        // Completa os 2 triangulos
        p5.push();
        p5.translate(0, 10, -23);
        p5.rotateX(40 * Math.PI / 180);
        p5.plane(38, 12, 4);
        p5.pop();

        // Aerofólio
        p5.push();
        p5.translate(0, 25, -36);
        p5.box(38, 3, 2)
        p5.pop();
        p5.push();
        p5.translate(19, 16, -36);
        p5.box(3, 20, 2);
        p5.pop();
        p5.push();
        p5.translate(-19, 16, -36);
        p5.box(3, 20, 2);
        p5.pop();

        // Triangulo frente em cima direita
        p5.push();
        p5.translate(18, 3, 37);
        p5.cone(8, 6, 3);
        p5.pop();

        // Triangulo frente em cima esquerda
        p5.push();
        p5.translate(-18, 3, 37);
        p5.cone(8, 6, 3);
        p5.pop();

        // Completa os 2 triangulos fc
        p5.push();
        p5.translate(0, 3, 40);
        p5.rotateX(-40 * Math.PI / 180);
        p5.plane(38, 6, 4);
        p5.pop();

        // Triangulo frente embaixo direita
        p5.push();
        p5.translate(18, -3, 37);
        p5.rotateX(Math.PI);
        p5.cone(8, 7, 3);
        p5.pop();

        // Triangulo frente embaixo esquerda
        p5.push();
        p5.translate(-18, -3, 37);
        p5.rotateX(Math.PI);
        p5.cone(8, 6, 3)
        p5.pop();

        // Completa os 2 triangulos fb
        p5.push();
        p5.translate(0, -3, 40);
        p5.rotateX(40 * Math.PI / 180);
        p5.plane(38, 7, 4);
        p5.pop();
        p5.pop();
    }

        drawExhaust(p5) {
        p5.push();
        p5.translate(0, 0, -this.bodySize.length / 2);
        p5.fill(40, 40, 40);

        for (let x of [-19, 19]) {
            for(let z of [22, 27]) {
                p5.push();
                p5.translate(x, -5, z);
                p5.rotateX(Math.PI / 2);
                p5.rotateZ(Math.PI / 2);
                p5.cylinder(2, 6);
                p5.pop();}
        }
        p5.pop();
    }
}

//Chick Hicks
export class ChickHicks extends BaseCar {
    constructor(x, y, z, p5) {
        super(x, y, z, p5);
        this.color = { r: 30, g: 180, b: 30 };
    }

    drawBody(p5) {
        p5.push();
        p5.fill(this.color.r, this.color.g, this.color.b);
        // Caixa de baixo
        p5.push();
        p5.box(40, 12, 75);
        p5.pop();

        // Caixa de Cima
        p5.push();
        p5.translate(0, 10, 0);
        p5.box(38, 12, 40);
        p5.pop();

        // Triangulo em cima direita
        p5.push();
        p5.translate(18, 10, -20);
        p5.cone(8, 12, 3)
        p5.pop();

        // Triangulo em cima esquerda
        p5.push();
        p5.translate(-18, 10, -20);
        p5.cone(8, 12, 3)
        p5.pop();

        // Completa os 2 triangulos
        p5.push();
        p5.translate(0, 10, -23);
        p5.rotateX(40 * Math.PI / 180);
        p5.plane(38, 12, 4);
        p5.pop();

        // Aerofólio
        p5.push();
        p5.translate(0, 9, -37);
        p5.box(38, 6, 1)
        p5.pop();
        p5.pop();

        //Bigode
        p5.push();
        p5.fill(30, 30, 30);
        p5.translate(0, 3, 39);
        p5.box(20, 6, 2)
        p5.pop();
    }

        drawExhaust(p5) {
        p5.push();
        p5.translate(0, 0, -this.bodySize.length / 2);
        p5.fill(40, 40, 40);

        for (let x of [-19, 19]) {
            for(let z of [22, 27]) {
                p5.push();
                p5.translate(x, -5, z);
                p5.rotateX(Math.PI / 2);
                p5.rotateZ(Math.PI / 2);
                p5.cylinder(2, 6);
                p5.pop();}
        }
        p5.pop();
    }
}