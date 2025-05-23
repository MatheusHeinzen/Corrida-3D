export class Car {
    constructor(x, y, z, p5) {
        this.pos = { x, y, z };
        this.velocity = { x: 0, y: 0, z: 0 };
        this.rotation = { x: 0, y: 90, z: 0 };
        this.speed = 0;
        this.maxSpeed = 50;
        this.acceleration = 0.15;
        this.braking = 0.5;
        this.steering = 0.03;
        this.steeringReduction = 0.7;
        this.onGround = false;
        this.wheelAngle = 0;
        this.driftFactor = 0;
        this.roll = 0;
        this.color = { r: 200, g: 30, b: 30 }; // Vermelho esportivo
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

    update(p5, track) {
        // Controles de aceleração/freio
        if (p5.keyIsDown(p5.UP_ARROW)) {
            this.speed += this.acceleration;
        } else if (p5.keyIsDown(p5.DOWN_ARROW)) {
            this.speed = Math.max(this.speed - this.braking, -this.maxSpeed * 0.4);
        } else {
            this.speed *= 0.99;
        }

        // Limita velocidade
        this.speed = Math.min(Math.max(this.speed, -this.maxSpeed * 0.4), this.maxSpeed);

        // Controle de direção
        if (Math.abs(this.speed) > 0.1) {
            let steerInput = 0;
            if (p5.keyIsDown(p5.LEFT_ARROW)) steerInput -= 1;
            if (p5.keyIsDown(p5.RIGHT_ARROW)) steerInput += 1;

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
    }

    display(p5) {
        p5.push();
        p5.translate(this.pos.x, this.pos.y, this.pos.z);
        p5.rotateY(this.rotation.y);
        p5.rotateZ(this.roll * 0.01); // Aplica inclinação lateral

        // Corpo principal do carro
        this.drawBody(p5);
        
        // Detalhes do carro
        this.drawExhaust(p5);
        this.drawSideDetails(p5);
        
        // Rodas
        this.drawWheels(p5);
        
        p5.pop();
    }

    drawBody(p5) {
        p5.push();
        p5.specularMaterial(this.color.r, this.color.g, this.color.b);
        p5.shininess(150);
        
        // Centro
        p5.push();
        p5.box(40, 12, 60);
        p5.pop();

        p5.push();
        p5.translate(0, 10, -9);
        p5.box(38, 12, 40);
        p5.pop();
        
        p5.pop();
    }

    drawWindows(p5) {
        p5.push();
        p5.translate(0, -2, 0);
        p5.specularMaterial(100, 100, 120, 150);
        p5.shininess(80);
        
        // Para-brisa
        p5.push();
        p5.translate(0, 5, -15);
        p5.rotateX(Math.PI/6);
        p5.box(28, 1, 20);
        p5.pop();
        
        // Janelas laterais
        p5.push();
        p5.translate(0, 0, 0);
        p5.box(38, 8, 40);
        p5.pop();
        
        // Vidro traseiro
        p5.push();
        p5.translate(0, 5, 25);
        p5.rotateX(-Math.PI/6);
        p5.box(26, 1, 15);
        p5.pop();
        
        p5.pop();
    }

    drawLights(p5) {
        // Faróis dianteiros
        p5.push();
        p5.translate(0, 0, -45);
        p5.specularMaterial(50);
        p5.shininess(30);
        p5.box(30, 8, 5);
        
        for (let x of [-12, 12]) {
            p5.push();
            p5.translate(x, 0, 3);
            p5.specularMaterial(200, 200, 180);
            p5.shininess(200);
            p5.sphere(4);
            p5.pop();
        }
        p5.pop();
        
        // Luzes traseiras
        p5.push();
        p5.translate(0, 0, 45);
        p5.specularMaterial(80, 0, 0);
        p5.shininess(100);
        p5.box(28, 6, 5);
        
        for (let x of [-10, 10]) {
            p5.push();
            p5.translate(x, 0, 3);
            p5.specularMaterial(200, 50, 50);
            p5.shininess(150);
            p5.sphere(3);
            p5.pop();
        }
        p5.pop();
    }

    drawExhaust(p5) {
        p5.push();
        p5.translate(0, 0, -31);
        p5.rotateX(Math.PI/2);
        p5.specularMaterial(80);
        p5.shininess(30);
        
        for (let x of [-8, 8]) {
            p5.push();
            p5.translate(x, 0, 0);
            p5.cylinder(2, 6);
            p5.pop();
        }
        p5.pop();
    }

    drawSideDetails(p5) {
        p5.push();
        p5.translate(0, 0, 0);
        p5.specularMaterial(180, 180, 180);
        p5.shininess(100);
        p5.pop();

        // Entrada de ar traseira
        p5.push();
        p5.translate(15, 0, 15);
        p5.rotateY(Math.PI/2);
        p5.specularMaterial(40);
        p5.shininess(20);
        p5.box(8, 4, 2);
        p5.pop();
    }

    drawWheels(p5) {
        const wheelPositions = [
            { x: -20, y: 0, z: -25, steer: false },
            { x: 20, y: 0, z: -25, steer: false },
            { x: -20, y: 0, z: 25, steer: true },
            { x: 20, y: 0, z: 25, steer: true }
        ];

        wheelPositions.forEach(wheel => {
            p5.push();
            p5.translate(wheel.x, wheel.y, wheel.z);
            

            // Posicionamento da roda
            p5.rotateZ(Math.PI/2);

            if (wheel.steer) {
                p5.rotateX(this.wheelAngle*5);
            }

            p5.rotateY(this.speed * -0.2);
            // Pneu
            p5.push();
            p5.specularMaterial(20);
            p5.shininess(5);
            p5.cylinder(8, 4);
            p5.pop();
            
            // Aro esportivo
            p5.push();
            p5.translate(0, 0, 0.1);
            p5.specularMaterial(180, 180, 200);
            p5.shininess(150);
            p5.cylinder(6, 3.8);
            p5.pop();
            
            // Detalhes do aro
            
            p5.pop();
        });
    }
}