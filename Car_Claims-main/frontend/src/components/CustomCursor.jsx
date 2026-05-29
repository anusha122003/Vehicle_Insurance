import { useState, useEffect, useRef } from 'react';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState('default'); // 'default', 'hover', 'crosshair', 'pill'
  const [pillSize, setPillSize] = useState({ width: 0, height: 0 });
  const [isEnabled, setIsEnabled] = useState(false);
  const cursorRef = useRef(null);

  useEffect(() => {
    // Enable only if device has a fine pointer (like mouse)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (mediaQuery.matches) {
      setIsEnabled(true);
      document.body.style.cursor = 'none';
    }

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Determine hover target state
      const target = e.target;
      if (!target) return;

      const hoverable = target.closest('a, button, [role="button"], [data-hover="true"]');
      const scanCard = target.closest('[data-cursor="scan"]');

      if (scanCard) {
        setCursorType('crosshair');
      } else if (hoverable) {
        if (hoverable.classList.contains('magnetic-btn') || hoverable.tagName === 'BUTTON') {
          setCursorType('pill');
          const rect = hoverable.getBoundingClientRect();
          setPillSize({ width: rect.width + 12, height: rect.height + 12 });
          
          // Magnetic Pull Effect: translate button slightly toward cursor
          const xOffset = (e.clientX - (rect.left + rect.width / 2)) * 0.15;
          const yOffset = (e.clientY - (rect.top + rect.height / 2)) * 0.15;
          hoverable.style.transform = `translate(${xOffset}px, ${yOffset}px) scale(1.02)`;
          hoverable.style.transition = 'transform 0.08s ease-out';
        } else {
          setCursorType('hover');
        }
      } else {
        setCursorType('default');
        
        // Reset any magnetic buttons in scope
        const magneticElements = document.querySelectorAll('.magnetic-btn, button');
        magneticElements.forEach(el => {
          el.style.transform = '';
          el.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        });
      }
    };

    const handleMouseLeave = () => {
      // Clean up magnetic styles if mouse leaves window
      const magneticElements = document.querySelectorAll('.magnetic-btn, button');
      magneticElements.forEach(el => {
        el.style.transform = '';
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.body.style.cursor = '';
    };
  }, []);

  if (!isEnabled) return null;

  return (
    <div 
      ref={cursorRef}
      className={`${styles.cursor} ${styles[cursorType]}`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        ...(cursorType === 'pill' ? { width: `${pillSize.width}px`, height: `${pillSize.height}px` } : {})
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
