export function generateTerrain(w, h, scl, p5) {
  const cols = w / scl;
  const rows = h / scl;
  let terrain = Array(cols).fill().map(() => Array(rows).fill(0));
  
  // Terreno plano (para simplificar)
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      terrain[x][y] = p5.noise(x * 0.5, y * 0.5) * 50 - 50; // Suaves colinas
    }
  }
  
  return [terrain, cols, rows];
}