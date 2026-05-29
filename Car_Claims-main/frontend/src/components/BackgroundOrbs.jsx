import { useState, useEffect, useRef } from 'react';
import styles from './BackgroundOrbs.module.css';

export default function BackgroundOrbs() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [drift, setDrift] = useState({ ax: 0, ay: 0, bx: 0, by: 0, cx: 0, cy: 0 });
  const requestRef = useRef(null);
  const targetDriftRef = useRef({ ax: 0, ay: 0, bx: 0, by: 0, cx: 0, cy: 0 });
  const currentDriftRef = useRef({ ax: 0, ay: 0, bx: 0, by: 0, cx: 0, cy: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const w = window.innerWidth / 2;
      const h = window.innerHeight / 2;
      const rx = (e.clientX - w) / w; // -1 to 1
      const ry = (e.clientY - h) / h; // -1 to 1

      // Set target displacements (max displacement ±30px)
      targetDriftRef.current = {
        ax: rx * 30 * (1 / 25) * 25,
        ay: ry * 30 * (1 / 25) * 25,
        bx: rx * 30 * (1 / 40) * 40,
        by: ry * 30 * (1 / 40) * 40,
        cx: rx * 30 * (1 / 35) * 35,
        cy: ry * 30 * (1 / 35) * 35,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Lerp loop for ultra-smooth rendering
    const updateDrift = () => {
      const target = targetDriftRef.current;
      const current = currentDriftRef.current;

      // Apply simple lerp: current = current + (target - current) * factor
      const factor = 0.08;
      current.ax += (target.ax - current.ax) * factor;
      current.ay += (target.ay - current.ay) * factor;
      current.bx += (target.bx - current.bx) * factor;
      current.by += (target.by - current.by) * factor;
      current.cx += (target.cx - current.cx) * factor;
      current.cy += (target.cy - current.cy) * factor;

      setDrift({ ...current });
      requestRef.current = requestAnimationFrame(updateDrift);
    };

    requestRef.current = requestAnimationFrame(updateDrift);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
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
  );
}
