import { useRef, useState } from 'react';
import { useMouseParallax } from '../utils/mouseParallax.js';
import styles from './FeatureCard.module.css';

export default function FeatureCard({ title, description, icon: Icon, badge, className = "", children }) {
  const cardRef = useRef(null);
  const parallax = useMouseParallax();
  const [isCardHovered, setIsCardHovered] = useState(false);

  const handleMouseMove = (e) => {
    parallax.handleMouseMove(e, cardRef);
    setIsCardHovered(true);
  };

  const handleMouseLeave = () => {
    parallax.handleMouseLeave();
    setIsCardHovered(false);
  };

  return (
    <div 
      ref={cardRef}
      className={`${styles.card} ${className} ${isCardHovered ? styles.cardHovered : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: parallax.isHovered 
          ? `perspective(1000px) rotateX(${parallax.coords.y * -2}deg) rotateY(${parallax.coords.x * 2}deg)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
        transition: parallax.isHovered ? 'none' : 'transform 0.4s ease-out',
      }}
    >
      {/* Radial Spotlight Overlay */}
      {parallax.isHovered && (
        <div 
          className={styles.spotlight}
          style={{
            background: `radial-gradient(300px circle at ${parallax.mousePos.x}px ${parallax.mousePos.y}px, rgba(0, 212, 255, 0.05), transparent 80%)`,
          }}
        />
      )}

      <div className={styles.cardHeader}>
        {badge && <span className={styles.badge}>[ {badge} ]</span>}
        {Icon && (
          <div className={`${styles.iconWrapper} ${isCardHovered ? styles.spinIcon : ''}`}>
            <Icon className="w-5 h-5 text-[#00D4FF]" />
          </div>
        )}
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>

      {children && <div className={styles.customContent}>{children}</div>}
    </div>
  );
}
