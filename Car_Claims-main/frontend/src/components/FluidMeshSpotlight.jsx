import { useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Hex Magnifying Water Surface
//
// A flat-top hexagonal grid where the cursor acts as a convex lens:
//   • Hexes inside the lens radius are displaced outward from the cursor
//     following true magnification math: apparent_pos = cursor + (base-cursor)*M
//   • Hex SIZE scales up by the same factor at the lens center
//   • Spring physics (underdamped) on every hex's offset and scale gives
//     the fluid oscillating water-bounce feel
//   • Pure white background — extremely minimalist
// ─────────────────────────────────────────────────────────────────────────────

const SQRT3 = Math.sqrt(3);

// Flat-top hexagon path (classic honeycomb orientation)
const drawHexFlat = (ctx, cx, cy, r) => {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a  = (Math.PI / 3) * i; // 0°, 60°, 120°, 180°, 240°, 300°
    const px = cx + r * Math.cos(a);
    const py = cy + r * Math.sin(a);
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
};

export default function FluidMeshSpotlight() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ── Tuning knobs ─────────────────────────────────────────────────────────
    const HEX_R      = 28;    // flat-top hex radius (center → vertex)
    const GAP        = 1.8;   // gap between hexes (visual grid lines)
    const LENS_R     = 200;   // magnifying lens radius (px)
    const MAG_FACTOR = 2.2;   // magnification at lens center (1 = none, 2 = 2×)
    const SPRING_K   = 0.075; // spring stiffness (higher = snappier)
    const FRICTION   = 0.70;  // velocity damping — < 0.75 feels like water bounce

    // Flat-top hex spacing
    const COL_STEP = HEX_R * 1.5;          // x distance between column centers
    const ROW_STEP = HEX_R * SQRT3;        // y distance between row centers (same col)
    const ODD_OFF  = HEX_R * SQRT3 * 0.5; // y offset for odd columns

    let W = 0, H = 0;
    let hexes = [];

    // ── Build grid ────────────────────────────────────────────────────────────
    const buildGrid = () => {
      hexes = [];
      const cols = Math.ceil(W / COL_STEP) + 4;
      const rows = Math.ceil(H / ROW_STEP) + 4;

      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const bx = col * COL_STEP;
          const by = row * ROW_STEP + (col % 2 !== 0 ? ODD_OFF : 0);

          hexes.push({
            bx, by,          // base (rest) position
            ox: 0, oy: 0,    // current spring offset
            vx: 0, vy: 0,    // offset velocity
            sc: 1,           // current scale
            sv: 0,           // scale velocity
          });
        }
      }
    };

    // ── Resize handler ────────────────────────────────────────────────────────
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.scale(dpr, dpr);
      buildGrid();
    };

    resize();
    window.addEventListener('resize', resize);

    // ── Mouse tracking ────────────────────────────────────────────────────────
    let mx = -9999, my = -9999;

    const onMove  = (e) => { mx = e.clientX; my = e.clientY; };
    const onLeave = ()  => { mx = -9999; my = -9999; };

    window.addEventListener('mousemove',  onMove,  { passive: true });
    window.addEventListener('mouseleave', onLeave, { passive: true });

    // ── Render loop ───────────────────────────────────────────────────────────
    let frameId;
    const hasMouse = () => mx > -1000;

    const loop = () => {
      // Transparent canvas — white background comes from CSS body/html
      ctx.clearRect(0, 0, W, H);

      const mouse = hasMouse();

      for (let i = 0; i < hexes.length; i++) {
        const h = hexes[i];

        // ── Compute lens displacement target ──────────────────────────────────
        let targetOX = 0, targetOY = 0, targetSC = 1;

        if (mouse) {
          const dx = h.bx - mx;
          const dy = h.by - my;
          const d  = Math.sqrt(dx * dx + dy * dy);

          // Global falloff: blend decreases with distance, never zero
          const blend = Math.exp(- (d * d) / (2 * LENS_R * LENS_R));

          // Effective local magnification at this hex (max MAG_FACTOR at cursor)
          const mag = 1 + (MAG_FACTOR - 1) * blend;

          // True magnification math:
          // apparent_position = cursor + (base − cursor) × mag
          // therefore: offset = base_to_cursor_vector × (mag − 1)
          targetOX = dx * (mag - 1);
          targetOY = dy * (mag - 1);

          // Size scale: grows by same factor (slightly attenuated for elegance)
          targetSC = 1 + (mag - 1) * 0.6;
        }

        // ── Spring physics (underdamped → water oscillation) ─────────────────
        h.vx += (targetOX - h.ox) * SPRING_K;
        h.vy += (targetOY - h.oy) * SPRING_K;
        h.vx *= FRICTION;
        h.vy *= FRICTION;
        h.ox += h.vx;
        h.oy += h.vy;

        h.sv += (targetSC - h.sc) * SPRING_K;
        h.sv *= FRICTION;
        h.sc += h.sv;

        // ── Draw position & effective size ────────────────────────────────────
        const drawX = h.bx + h.ox;
        const drawY = h.by + h.oy;
        const drawR = Math.max(2, HEX_R * h.sc - GAP);

        // Displacement magnitude → controls how "activated" this cell looks
        const disp  = Math.sqrt(h.ox * h.ox + h.oy * h.oy);
        const t     = Math.min(1, disp / (LENS_R * 0.6)); // 0 = calm, 1 = full lens

        // ── Fill & Stroke: mild rainbow tint, invisible at rest, whisper‑soft under lens ────────
        const fillA = 0.02 + t * 0.10;
        const strokeA = 0.08 + t * 0.30;  // base 0.08 → max 0.38
        const strokeW = 0.6 + t * 1.2;   // base 0.6px → max 1.8px
        const hue = 190 + ((h.bx + h.by) * 0.05) % 30; // Misty Sea subtle blue range

        // Fill
        drawHexFlat(ctx, drawX, drawY, drawR);
        ctx.fillStyle = `hsla(${hue}, 45%, 78%, ${fillA})`;
        ctx.fill();

        // Stroke
        ctx.strokeStyle = `hsla(${hue}, 45%, 72%, ${strokeA})`;
        ctx.lineWidth = strokeW;
        ctx.stroke();

        // ── Specular gloss dot — only at peak displacement ─────────────────
        if (t > 0.55) {
          const glossA = (t - 0.55) / 0.45 * 0.50;
          ctx.beginPath();
          ctx.arc(drawX - drawR * 0.18, drawY - drawR * 0.22, drawR * 0.16, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${glossA})`;
          ctx.fill();
        }
      }

      frameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="ashield-canvas-bg"
      style={{ pointerEvents: 'none' }}
    />
  );
}
