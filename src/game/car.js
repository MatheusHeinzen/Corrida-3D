export class Car {
    constructor(x, y, z, p5) {
        this.pos = { x, y, z };
        this.velocity = { x: 0, y: 0, z: 0 };
        this.rotation = { x: 0, y: 0, z: 0 };
        this.speed = 0;
        this.maxSpeed = 8; // Aumentado
        this.acceleration = 0.15;
        this.braking = 0.2; // Frenagem mais forte
        this.steering = 0.06;
        this.steeringReduction = 0.7; // Redução de esterçamento em baixa velocidade
        this.onGround = false;
        this.wheelAngle = 0; // Ângulo das rodas para animação
        this.driftFactor = 0; // Controle de derrapagem
    }

    update(p5) {
        // Controles de aceleração/freio
        if (p5.keyIsDown(p5.UP_ARROW)) {
            this.speed += this.acceleration;
        } else if (p5.keyIsDown(p5.DOWN_ARROW)) {
            this.speed = Math.max(this.speed - this.braking, -this.maxSpeed * 0.4);
        } else {
            // Atrito natural (mais lento quando desacelerando)
            this.speed *= 0.92;
        }

        // Limita velocidade
        this.speed = Math.min(Math.max(this.speed, -this.maxSpeed * 0.4), this.maxSpeed);

        // Controle de direção (só funciona quando em movimento)
        if (Math.abs(this.speed) > 0.1) {
            let steerInput = 0;
            if (p5.keyIsDown(p5.LEFT_ARROW)) steerInput -= 1;
            if (p5.keyIsDown(p5.RIGHT_ARROW)) steerInput += 1;
            
            // Reduz esterçamento em baixa velocidade
            const speedFactor = Math.min(Math.abs(this.speed) / this.maxSpeed, 1);
            this.wheelAngle = steerInput * this.steering * speedFactor;
            
            // Atualiza rotação do carro com efeito de derrapagem
            this.rotation.y += this.wheelAngle * speedFactor * (1 - this.driftFactor);
            
            // Efeito de derrapagem em curvas fechadas
            if (Math.abs(this.wheelAngle) > 0.1 && speedFactor > 0.3) {
                this.driftFactor = Math.min(this.driftFactor + 0.02, 0.4);
            } else {
                this.driftFactor = Math.max(this.driftFactor - 0.01, 0);
            }
        } else {
            this.wheelAngle *= 0.9; // Retorna as rodas ao centro
        }

        // Movimento baseado na rotação
        this.velocity.x = Math.sin(this.rotation.y) * this.speed;
        this.velocity.z = Math.cos(this.rotation.y) * this.speed;
        this.pos.x += this.velocity.x;
        this.pos.z += this.velocity.z;

        // Física de gravidade e chão
        if (this.pos.y > 0) {
            this.velocity.y -= 0.25; // Gravidade mais forte
            this.pos.y += this.velocity.y;
        } else {
            this.pos.y = 0;
            this.velocity.y = 0;
            this.onGround = true;
            
            // Efeito de "suspensão" ao pousar
            if (Math.abs(this.velocity.y) > 0.5) {
                this.speed *= 0.8; // Perda de velocidade ao pular
            }
        }
    }

    display(p5) {
        p5.push();
        p5.translate(this.pos.x, this.pos.y, this.pos.z);
        p5.rotateY(this.rotation.y);

        // Corpo do carro (com inclinação na derrapagem)
        p5.push();
        p5.rotateZ(this.driftFactor * this.wheelAngle * 0.3);
        p5.fill(255, 0, 0);
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
            
            p5.box(10, 5, 5);
            p5.pop();
        });

        p5.pop();
    }
}