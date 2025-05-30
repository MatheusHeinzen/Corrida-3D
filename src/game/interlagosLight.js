export function createInterlagosLight(p5) {
    const SCALE = 200;
    const trackWidth = 300;
    const zebraWidth = 30; // Largura da zebra

    const points = [
        { x: 0, z: 0, y: 0 },           // 0
        { x: 50, z: -30, y: 0 },        // 1
        { x: 90, z: -60, y: 0 },        // 2
        { x: 130, z: -40, y: 0 },       // 3
        { x: 150, z: -30, y: 0 },       // 4
        { x: 165, z: -45, y: 0 },       // 5
        { x: 170, z: 20, y: 0 },        // 6
        { x: 160, z: 65, y: 0 },        // 7
        { x: 150, z: 80, y: 0 },        // 8
        { x: 100, z: 100, y: 0 },       // 9
        { x: 80, z: 110, y: 0 },        // 10
        { x: 50, z: 120, y: 0 },        // 11
        { x: 0, z: 90, y: 0 },          // 12
        { x: -10, z: 70, y: 0 },        // 13
        { x: -25, z: 55, y: 0 },        // 14
        { x: -40, z: 60, y: 0 },        // 15
        { x: -40, z: 50, y: 0 },        // 16
        { x: -60, z: 0, y: 0 },         // 17
        { x: -40, z: -40, y: 0 },       // 18
        { x: -10, z: -60, y: 0 },       // 19
        { x: -5, z: -60, y: 0 },        // 20
        { x: 0, z: 0, y: 0 }            // 21
    ].map(p => ({
        x: p.x * SCALE,
        z: p.z * SCALE,
        y: 0
    }));

    function drawTrackSurface() {
        p5.push();
        p5.noStroke();

        // 1. Asfalto principal (preenche até a borda da zebra)
        p5.fill(50); // asfalto cinza escuro
        p5.beginShape();
        // Borda externa (até o final da zebra)
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            const next = points[(i + 1) % points.length];
            const dx = next.x - p.x;
            const dz = next.z - p.z;
            const len = Math.sqrt(dx * dx + dz * dz);
            const nx = -dz / len;
            const nz = dx / len;
            // Borda externa (até o final da zebra)
            p5.vertex(p.x + nx * (trackWidth + zebraWidth), p.y, p.z + nz * (trackWidth + zebraWidth));
        }
        // Borda interna (até o final da zebra)
        for (let i = points.length - 1; i >= 0; i--) {
            const p = points[i];
            const prev = points[(i - 1 + points.length) % points.length];
            const dx = prev.x - p.x;
            const dz = prev.z - p.z;
            const len = Math.sqrt(dx * dx + dz * dz);
            const nx = -dz / len;
            const nz = dx / len;
            p5.vertex(p.x - nx * (trackWidth + zebraWidth), p.y, p.z - nz * (trackWidth + zebraWidth));
        }
        p5.endShape(p5.CLOSE);

        // 2. Zebras externas e internas (faixa vermelha)
        p5.fill(50); // vermelho zebra
        p5.beginShape();
        // Externa
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            const next = points[(i + 1) % points.length];
            const dx = next.x - p.x;
            const dz = next.z - p.z;
            const len = Math.sqrt(dx * dx + dz * dz);
            const nx = -dz / len;
            const nz = dx / len;
            // Borda externa (final da zebra)
            p5.vertex(p.x + nx * (trackWidth + zebraWidth), p.y + 2, p.z + nz * (trackWidth + zebraWidth));
        }
        // Externa (início da zebra)
        for (let i = points.length - 1; i >= 0; i--) {
            const p = points[i];
            const prev = points[(i - 1 + points.length) % points.length];
            const dx = prev.x - p.x;
            const dz = prev.z - p.z;
            const len = Math.sqrt(dx * dx + dz * dz);
            const nx = -dz / len;
            const nz = dx / len;
            p5.vertex(p.x + nx * trackWidth, p.y + 2, p.z + nz * trackWidth);
        }
        p5.endShape(p5.CLOSE);

        // Interna zebra
        p5.beginShape();
        // Interna (final da zebra)
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            const next = points[(i + 1) % points.length];
            const dx = next.x - p.x;
            const dz = next.z - p.z;
            const len = Math.sqrt(dx * dx + dz * dz);
            const nx = -dz / len;
            const nz = dx / len;
            p5.vertex(p.x - nx * (trackWidth + zebraWidth), p.y + 2, p.z - nz * (trackWidth + zebraWidth));
        }
        // Interna (início da zebra)
        for (let i = points.length - 1; i >= 0; i--) {
            const p = points[i];
            const prev = points[(i - 1 + points.length) % points.length];
            const dx = prev.x - p.x;
            const dz = prev.z - p.z;
            const len = Math.sqrt(dx * dx + dz * dz);
            const nx = -dz / len;
            const nz = dx / len;
            p5.vertex(p.x - nx * trackWidth, p.y + 2, p.z - nz * trackWidth);
        }
        p5.endShape(p5.CLOSE);

        p5.pop();
    }

    function drawGrass() {
        p5.push();
        p5.noStroke();
        p5.fill(34, 139, 34);  // Verde escuro
        p5.beginShape();
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            p5.vertex(p.x * 1.5, -1, p.z * 1.5);  // Estica pra parecer gramado ao redor
        }
        p5.endShape(p5.CLOSE);
        p5.pop();
    }

    function draw() {
        drawGrass();
        drawTrackSurface();
    }

    return {
        draw,
        width: trackWidth,
        points // <-- exporta os pontos para uso no Car
    };
}
