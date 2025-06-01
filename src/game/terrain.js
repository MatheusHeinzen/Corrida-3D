// export function generateTerrain(w, h, scl, p5) {
//   const cols = w / scl;
//   const rows = h / scl;
//   let terrain = Array(cols).fill().map(() => Array(rows).fill(0));

//   const trackWidth = 30;

//   for (let y = 0; y < rows; y++) {
//     // Spline para desenhar curvas da pista tipo Interlagos
//     let offset = Math.sin(y * 0.05) * 20  // Grande curva inicial
//               + Math.sin(y * 0.13 + 5) * 15  // Curva do lago
//               + Math.sin(y * 0.07 + 2) * 10;  // Miolo
//     let trackCenter = Math.floor(cols / 2) + offset;

//     for (let x = 0; x < cols; x++) {
//       if (x > trackCenter - trackWidth / 2 && x < trackCenter + trackWidth / 2) {
//         terrain[x][y] = 0;  // pista plana
//       } else {
//         terrain[x][y] = p5.noise(x * 0.1, y * 0.1) * 50 - 50;  // fora da pista: irregular
//       }
//     }
//   }

//   return [terrain, cols, rows];
// }
