import { useState, useEffect, useRef } from 'react';
import styles from './BackgroundOrbs.module.css';

export default function BackgroundOrbs() {
  const [drift, setDrift] = useState({ ax: 0, ay: 0, bx: 0, by: 0, cx: 0, cy: 0 });
  const canvasRef = useRef(null);
  const targetDriftRef = useRef({ ax: 0, ay: 0, bx: 0, by: 0, cx: 0, cy: 0 });
  const currentDriftRef = useRef({ ax: 0, ay: 0, bx: 0, by: 0, cx: 0, cy: 0 });

  useEffect(() => {
    // Parallax logic on mousemove
    const handleMouseMove = (e) => {
      const w = window.innerWidth / 2;
      const h = window.innerHeight / 2;
      const rx = (e.clientX - w) / w; // -1 to 1
      const ry = (e.clientY - h) / h; // -1 to 1

      // Set target displacements (max displacement ±30px, scaled to 1/25th logic)
      targetDriftRef.current = {
        ax: rx * 30,
        ay: ry * 30,
        bx: rx * -30, // counter-drift
        by: ry * -30,
        cx: rx * 20,
        cy: ry * -20,
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Setup particles on viewport canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvasRef.current) return;
      width = canvasRef.current.width = window.innerWidth;
      height = canvasRef.current.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Initialize 25 clean floating particles
    const particles = [];
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1 + 1, // 1-2px dots
        speed: Math.random() * 0.4 + 0.2, // 0.2-0.6px per frame
        opacity: Math.random() * 0.07 + 0.08, // 0.08-0.15 opacity
        dx: Math.random() * 0.2 - 0.1, // slight horizontal drift
      });
    }

    const render = () => {
      // 1. Lerp mouse movement for smooth parallax
      const target = targetDriftRef.current;
      const current = currentDriftRef.current;
      const factor = 0.08;

      current.ax += (target.ax - current.ax) * factor;
      current.ay += (target.ay - current.ay) * factor;
      current.bx += (target.bx - current.bx) * factor;
      current.by += (target.by - current.by) * factor;
      current.cx += (target.cx - current.cx) * factor;
      current.cy += (target.cy - current.cy) * factor;

      setDrift({ ...current });

      // 2. Draw canvas particles
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.y -= p.speed;
        p.x += p.dx;

        // Reset positions at edges or top
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0 || p.x > width) {
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 184, 217, ${p.opacity * 0.4})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className={styles.canvasBackground} 
        style={{ willChange: 'transform' }}
      />
      <div className={styles.orbContainer}>
        <div 
          className={`${styles.orb} ${styles.orbA}`} 
          style={{ transform: `translate(${drift.ax}px, ${drift.ay}px)` }} 
        />
        <div 
          className={`${styles.orb} ${styles.orbB}`} 
          style={{ transform: `translate(${drift.bx}px, ${drift.by}px)` }} 
        />
        <div 
          className={`${styles.orb} ${styles.orbC}`} 
          style={{ transform: `translate(${drift.cx}px, ${drift.cy}px)` }} 
        />
      </div>
    </>
  );
}
