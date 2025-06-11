export class StartLights {
    constructor(x, y, z, p5) {
        this.pos = { x, y, z };
        this.state = "idle"; // idle, lighting, waiting, blackout, green
        this.lightsOn = 0;
        this.lastChange = 0;
        this.blackoutDelay = 0;
        this.visible = false;
    }

    start(p5) {
        this.state = "lighting";
        this.lightsOn = 0;
        this.lastChange = p5.millis();
        this.visible = true;
    }

    update(p5) {
        if (!this.visible) return;

        const now = p5.millis();

        if (this.state === "lighting" && now - this.lastChange > 700) {
            this.lightsOn++;
            this.lastChange = now;

            if (this.lightsOn === 5) {
                this.state = "waiting";
                this.blackoutDelay = now + p5.random(500, 1000);
            }
        }

        if (this.state === "waiting" && now > this.blackoutDelay) {
            this.state = "blackout";
            this.lastChange = now;
        }

        if (this.state === "blackout" && now - this.lastChange > 350) {
            this.state = "green";
        }
    }

    display(p5) {
        if (!this.visible) return;

        p5.push();
        p5.translate(this.pos.x, this.pos.y, this.pos.z);

        // Luz ambiente e fonte de luz
        p5.ambientLight(100);
        p5.pointLight(255, 255, 255, 0, 0, 200);

        // Caixa preta central com aparência "arredondada"
        p5.fill(70);
        p5.noStroke();
        p5.box(180, 60, 8); 

        // Luzes
        for (let i = 0; i < 5; i++) {
            p5.push();
            p5.translate(-72 + i * 36, 0, 10);

            if (this.state === "green") {
                p5.ambientMaterial(0, 255, 0);
            } else if (this.state === "blackout") {
                p5.ambientMaterial(50);
            } else if (i < this.lightsOn) {
                p5.ambientMaterial(255, 0, 0);
            } else {
                p5.ambientMaterial(50);
            }

            p5.sphere(10); 
            p5.pop();
        }

        p5.pop();
    }
}
