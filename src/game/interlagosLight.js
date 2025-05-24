export function createInterlagosLight(p5) {
    const SCALE = 250;
    const trackWidth = 250;
    const zebraWidth = 30; // Largura da zebra

    // Traçado com elevação removida (y = 0)
    const points = [
        { x: 0, z: 0, y: 0 },           // Start/Finish
        { x: 50, z: -30, y: 0 },        // S do Senna - Entrada
        { x: 90, z: -60, y: 0 },        // S do Senna - Saída
        { x: 130, z: -40, y: 0 },       // Curva do Sol
        { x: 170, z: 20, y: 0 },        // Reta oposta
        { x: 150, z: 80, y: 0 },        // Descida do Lago
        { x: 100, z: 100, y: 0 },       // Mergulho
        { x: 50, z: 120, y: 0 },        // Pinheirinho
        { x: 0, z: 90, y: 0 },          // Bico de Pato
        { x: -40, z: 50, y: 0 },        // Subida
        { x: -60, z: 0, y: 0 },         // Junção
        { x: -40, z: -40, y: 0 },       // Subida do Café
        { x: 0, z: -60, y: 0 },         // Reta dos boxes
        { x: 0, z: 0, y: 0 }            // Fechamento
    ].map(p => ({
        x: p.x * SCALE,
        z: p.z * SCALE,
        y: 0 // Mantém o traçado plano
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
