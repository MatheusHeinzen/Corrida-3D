export class Car {
    constructor(x, y, z, p5) {
        this.pos = { x, y, z };
        this.velocity = { x: 0, y: 0, z: 0 };
        this.rotation = { x: 0, y: 0, z: 0 };
        this.speed = 0;
        this.maxSpeed = 50; // Aumentado
        this.acceleration = 0.15;
        this.braking = 0.2; // Frenagem mais forte
        this.steering = 0.03;
        this.steeringReduction = 0.7; // Redução de esterçamento em baixa velocidade
        this.onGround = false;
        this.wheelAngle = 0; // Ângulo das rodas para animação
        this.driftFactor = 0; // Controle de derrapagem
        this.roll = 0; // Inclinação lateral do carro
    }

    getHeightAtPosition(p5, track) {
        if (!track || !track.points) return this.pos.y; // Corrige bug se track não existir
        // Encontra o ponto mais próximo na pista
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


    update(p5, track) {
        // Controles de aceleração/freio
        if (p5.keyIsDown(p5.UP_ARROW)) {
            this.speed += this.acceleration;
        } else if (p5.keyIsDown(p5.DOWN_ARROW)) {
            this.speed = Math.max(this.speed - this.braking, -this.maxSpeed * 0.4);
        } else {
            // Atrito natural (mais lento quando desacelerando)
            this.speed *= 0.99;
        }

        // Limita velocidade
        this.speed = Math.min(Math.max(this.speed, -this.maxSpeed * 0.4), this.maxSpeed);

        // Controle de direção (mais curva em baixa, menos em alta velocidade)
        if (Math.abs(this.speed) > 0.1) {
            let steerInput = 0;
            if (p5.keyIsDown(p5.LEFT_ARROW)) steerInput -= 1;
            if (p5.keyIsDown(p5.RIGHT_ARROW)) steerInput += 1;

            // Fator de curva: mais curva em baixa, menos em alta velocidade
            const speedFactor = 1 - Math.min(Math.abs(this.speed) / this.maxSpeed, 1); // 1 em baixa, 0 em alta
            const steeringEffect = this.steering * (0.5 + 1.5 * speedFactor); // 2x mais curva em baixa, 0.5x em alta

            this.wheelAngle = steerInput * steeringEffect;

            // Atualiza rotação do carro com efeito de derrapagem
            this.rotation.y += this.wheelAngle * (1 - this.driftFactor);

            // Efeito de derrapagem em curvas fechadas (mais forte)
            if (Math.abs(this.wheelAngle) > 0.1 && speedFactor > 0.3) {
                this.driftFactor = Math.min(this.driftFactor + 0.04, 0.6); // Drift mais forte
            } else {
                this.driftFactor = Math.max(this.driftFactor - 0.01, 0);
            }

            // Inclinação lateral (roll) proporcional à curva e velocidade
            this.roll = -this.wheelAngle * this.speed * 0.7;
        } else {
            this.wheelAngle *= 0.9; // Retorna as rodas ao centro
            this.roll *= 0.8; // Volta o carro ao plano
        }

        // Movimento baseado na rotação
        this.velocity.x = Math.sin(this.rotation.y) * this.speed;
        this.velocity.z = Math.cos(this.rotation.y) * this.speed;
        this.pos.x += this.velocity.x;
        this.pos.z += this.velocity.z;

        // Ajusta altura do carro com base na pista
        const targetY = this.getHeightAtPosition(p5, track);
        const diffY = targetY - this.pos.y;
        this.velocity.y = diffY * 0.2;  // Suaviza o ajuste vertical
        this.pos.y += this.velocity.y;
    }

    display(p5) {
        p5.push();
        p5.translate(this.pos.x, this.pos.y, this.pos.z);
        p5.rotateY(this.rotation.y);

        // Corpo do carro (com inclinação na derrapagem e roll)
        p5.push();
        // Inclinação lateral (roll) e inclinação de drift
        p5.rotateZ(this.roll + this.driftFactor * this.wheelAngle * 0.3);
        p5.specularMaterial(255, 0, 0); // Material com brilho para sombra
        p5.shininess(30); // Suaviza o brilho
        p5.box(30, 15, 50);

        // Para-brisa
        p5.fill(200, 200, 255, 150);
        p5.translate(0, -5, 10);
        p5.box(20, 5, 10);
        p5.pop();

        // Rodas (com rotação e esterçamento)
        p5.fill(40);
        const wheels = [
            { x: -20, y: -5, z: -15, steer: true },
            { x: 20, y: -5, z: -15, steer: true },
            { x: -20, y: -5, z: 15, steer: false },
            { x: 20, y: -5, z: 15, steer: false }
        ];

        wheels.forEach(wheel => {
            p5.push();
            p5.translate(wheel.x, wheel.y, wheel.z);

            // Rodas dianteiras viram
            if (wheel.steer) {
                p5.rotateY(this.wheelAngle);
            }

            // Rodas giram conforme velocidade
            p5.rotateX(-this.speed * 0.1);

            p5.specularMaterial(40); // Material escuro para sombra nas rodas
            p5.shininess(10);
            p5.box(10, 5, 5);
            p5.pop();
        });

        p5.pop();
    }
}