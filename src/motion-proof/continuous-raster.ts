export type Raster = {width: number; height: number; rgba: Uint8Array};
export type Camera = {scale: number; x: number; y: number};
export type Displacement = {dx: number; dy: number};
export const sampleMask = (mask: Uint8Array, width: number, height: number, x: number, y: number) => mask[Math.max(0, Math.min(height - 1, Math.round(y))) * width + Math.max(0, Math.min(width - 1, Math.round(x)))]! / 255;

// A continuous inverse UV deformation avoids exposed cutout holes and alpha-card edges.
// Semantic influences are authored, bounded explanatory motion, not recovered 3D geometry.
export const warpRaster = (source: Raster, field: (x: number, y: number) => Displacement, camera: Camera): Buffer => {
  const {width: w, height: h} = source;
  const spacing = 24; const cols = Math.ceil(w / spacing) + 1; const rows = Math.ceil(h / spacing) + 1;
  const dx = new Float32Array(cols * rows); const dy = new Float32Array(cols * rows);
  for (let gy = 0; gy < rows; gy++) for (let gx = 0; gx < cols; gx++) {
    const d = field(gx * spacing, gy * spacing); dx[gy * cols + gx] = d.dx; dy[gy * cols + gx] = d.dy;
  }
  const result = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    const uy = (y - h / 2) / camera.scale + camera.y;
    const fy = Math.max(0, Math.min(rows - 1.001, uy / spacing)); const iy = Math.floor(fy); const ty = fy - iy;
    for (let x = 0; x < w; x++) {
      const ux = (x - w / 2) / camera.scale + camera.x;
      const fx = Math.max(0, Math.min(cols - 1.001, ux / spacing)); const ix = Math.floor(fx); const tx = fx - ix;
      const a = iy * cols + ix; const b = a + cols;
      const ddx = (dx[a]! * (1 - tx) + dx[a + 1]! * tx) * (1 - ty) + (dx[b]! * (1 - tx) + dx[b + 1]! * tx) * ty;
      const ddy = (dy[a]! * (1 - tx) + dy[a + 1]! * tx) * (1 - ty) + (dy[b]! * (1 - tx) + dy[b + 1]! * tx) * ty;
      const sx = Math.max(0, Math.min(w - 1.001, ux - ddx)); const sy = Math.max(0, Math.min(h - 1.001, uy - ddy));
      const px = Math.floor(sx); const py = Math.floor(sy); const vx = sx - px; const vy = sy - py;
      const p = (py * w + px) * 4; const q = p + w * 4; const target = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) result[target + c] = Math.round((source.rgba[p + c]! * (1 - vx) + source.rgba[p + 4 + c]! * vx) * (1 - vy) + (source.rgba[q + c]! * (1 - vx) + source.rgba[q + 4 + c]! * vx) * vy);
      result[target + 3] = 255;
    }
  }
  return result;
};
export const compositePixels = (a: Buffer, b: Uint8Array, opacity: number, respectAlpha = false) => {
  if (a.length !== b.length) throw new Error('Raster composition dimensions differ');
  for (let i = 0; i < a.length; i += 4) {
    const weight = opacity * (respectAlpha ? b[i + 3]! / 255 : 1);
    for (let c = 0; c < 3; c++) a[i + c] = Math.round(a[i + c]! * (1 - weight) + b[i + c]! * weight);
  }
  return a;
};
