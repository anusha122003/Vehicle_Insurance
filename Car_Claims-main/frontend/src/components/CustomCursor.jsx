import { useState, useEffect, useRef } from 'react';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState('crosshair');
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef(null);

  useEffect(() => {
    // Enable only if device has a fine pointer (like mouse)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) return;

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target;
      if (!target) return;

      const scanCard = target.closest('[data-cursor="scan"]');

      if (scanCard) {
        setIsVisible(true);
        setCursorType('crosshair');
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      ref={cursorRef}
      className={`${styles.cursor} ${styles[cursorType]}`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`
      }}
    >
      {cursorType === 'crosshair' && (
        <>
          <div className={styles.crosshairX} />
          <div className={styles.crosshairY} />
        </>
      )}
    </div>
  );
}
