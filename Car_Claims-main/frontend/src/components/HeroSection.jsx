import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Cpu } from 'lucide-react';
import styles from './HeroSection.module.css';

export default function HeroSection({ onOpenAuth }) {
  const heroRef = useRef(null);
  const cardRef = useRef(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0, mousePos: { x: 0, y: 0 }, isHovered: false });

  // Mouse Parallax for Local Ambient Orbs
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const w = window.innerWidth / 2;
      const h = window.innerHeight / 2;
      // Shift by 1/25th delta (max displacement ±30px)
      const mx = (e.clientX - w) / 25;
      const my = (e.clientY - h) / 25;

      heroRef.current.style.setProperty('--mx', `${mx}px`);
      heroRef.current.style.setProperty('--my', `${my}px`);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Card Interactive Hover
  const handleCardMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY);
    const rotateY = ((x - centerX) / centerX);

    setParallax({ x: rotateY, y: rotateX, mousePos: { x, y }, isHovered: true });
  };

  const handleCardMouseLeave = () => {
    setParallax(prev => ({ ...prev, x: 0, y: 0, isHovered: false }));
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.5 } }
  };

  const ctaVariant = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, delay: 0.7 } }
  };

  const trustVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, delay: 0.9 } }
  };

  const cardContainerVariant = {
    hidden: { opacity: 0, y: 40, rotateX: 2 },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.1 } 
    }
  };

  // Magnetic Button Effect
  const buttonRef = useRef(null);
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
  const handleBtnMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setBtnPos({ x: x * 0.3, y: y * 0.3 });
  };
  const handleBtnLeave = () => setBtnPos({ x: 0, y: 0 });

  return (
    <section ref={heroRef} className={styles.heroWrapper} id="hero" data-cursor="default">
      {/* Layer 1: Dot grid static background */}
      <div className={styles.dotGridLayer} />

      {/* Layer 2 & 3: Ambient glowing parallax orbs */}
      <div className={styles.parallaxWrapper} style={{ transform: 'translate(var(--mx, 0px), var(--my, 0px))' }}>
        <div className={`${styles.ambientOrb} ${styles.orbCyan}`} />
      </div>
      <div className={styles.parallaxWrapper} style={{ transform: 'translate(calc(-1 * var(--mx, 0px)), calc(-1 * var(--my, 0px)))' }}>
        <div className={`${styles.ambientOrb} ${styles.orbAmber}`} />
      </div>
      
      <div className={styles.heroContent}>
        
        {/* Left column text content */}
        <div className={styles.textColumn}>
          {/* v2.0 Live system chip */}
          <motion.div 
            className={styles.eyebrowChip}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <span className={styles.eyebrowDot} />
            <span className={styles.eyebrowText}>LIVE SYSTEM ACTIVE</span>
          </motion.div>
 
          {/* v2.0 Premium typography splits */}
          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <span className={styles.titleLine1}>Claims Settled in</span>
            <span className={styles.titleLine2}>
              <span className={styles.titleSerif}>Seconds,</span> <span className={styles.titleStrong}>Not Days.</span>
            </span>
          </motion.h1>
 
          <motion.p 
            className={styles.subtitle}
            variants={fadeUpVariant}
            initial="hidden"
            animate="visible"
          >
            Experience the future of auto insurance. Our neural engine analyzes damage instantly, 
            approving legitimate claims before you even call a tow truck.
          </motion.p>
 
          <motion.div 
            className={styles.ctaRow}
            variants={ctaVariant}
            initial="hidden"
            animate="visible"
          >
            <motion.button 
              ref={buttonRef}
              className={styles.primaryButton}
              onMouseMove={handleBtnMove}
              onMouseLeave={handleBtnLeave}
              animate={{ x: btnPos.x, y: btnPos.y }}
              transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
              onClick={() => onOpenAuth('signup', 'customer')}
            >
              Start Free Trial →
            </motion.button>
            <a href="#how-it-works" className={styles.secondaryButton}>
              Watch Demo ▶
            </a>
          </motion.div>
 
          <motion.div 
            className={styles.trustCluster}
            variants={trustVariant}
            initial="hidden"
            animate="visible"
          >
            <span>✦ No credit card required</span>
            <span className={styles.trustSep}>·</span>
            <span>✦ Setup in 5 minutes</span>
            <span className={styles.trustSep}>·</span>
            <span>✦ SOC 2 Ready</span>
          </motion.div>
        </div>
 
        {/* Right column visual 3D scanning card */}
        <motion.div 
          className={styles.visualColumn}
          variants={cardContainerVariant}
          initial="hidden"
          animate="visible"
        >
          {/* Ambient Back Glow */}
          <div className={styles.visualGlow} />
 
          <div className={styles.floatingCardWrapper}>
            <div 
              ref={cardRef}
              className={styles.scanCard}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              data-cursor="scan"
              style={{
                transform: parallax.isHovered 
                  ? `perspective(1000px) rotateX(${parallax.y * -3}deg) rotateY(${parallax.x * 3}deg) translateZ(10px)` 
                  : 'perspective(1000px)',
                transition: parallax.isHovered ? 'none' : 'transform 0.5s ease-out',
              }}
            >
              {/* Spotlight overlay */}
              {parallax.isHovered && (
                <div 
                  className={styles.cardSpotlight}
                  style={{
                    background: `radial-gradient(250px circle at ${parallax.mousePos.x}px ${parallax.mousePos.y}px, rgba(0, 212, 255, 0.08), transparent 80%)`,
                  }}
                />
              )}
 
              {/* Surgical brackets */}
              <div className={`${styles.cornerBracket} ${styles.topLeft}`} />
              <div className={`${styles.cornerBracket} ${styles.topRight}`} />
              <div className={`${styles.cornerBracket} ${styles.bottomLeft}`} />
              <div className={`${styles.cornerBracket} ${styles.bottomRight}`} />
 
              {/* Sweep sweep line with high glow */}
              <div className={styles.scanLine} />
 
              {/* macOS Chrome Header */}
              <div className={styles.cardHeader}>
                <div className={styles.macDots}>
                  <span className={styles.dotRed} />
                  <span className={styles.dotAmber} />
                  <span className={styles.dotGreen} />
                </div>
                <span className={styles.headerLabel}>autoShield_analysis.exe</span>
              </div>
 
              {/* Card Body Grid (split 55/45) */}
              <div className={styles.cardBodyGrid}>
                {/* Left 55% Viewport */}
                <div className={styles.cameraViewport}>
                  <span className={styles.streamLabel}>CAMERA STREAM #AS-01 // LIVE</span>
                  
                  <div className={styles.carGraphic}>
                    <svg viewBox="0 0 100 45" className={styles.carSvg}>
                      <path 
                        d="M10,25 C15,25 18,22 25,20 C32,18 45,12 60,12 C75,12 82,18 85,22 C88,25 90,26 92,28 C94,30 95,33 93,35 C90,38 85,38 80,38 L20,38 C15,38 12,37 10,35 C8,33 8,28 10,25 Z" 
                        fill="none" 
                        stroke="rgba(0, 184, 217, 0.35)" 
                        strokeWidth="0.75"
                      />
                      {/* Bounding box 1: Red Dent */}
                      <rect x="24" y="16" width="14" height="9" rx="1.5" fill="rgba(239, 68, 68, 0.08)" stroke="#EF4444" strokeWidth="0.75" className={styles.pulseBox1} />
                      {/* Bounding box 2: Amber Scratch */}
                      <rect x="64" y="15" width="16" height="11" rx="1.5" fill="rgba(245, 158, 11, 0.08)" stroke="#F59E0B" strokeWidth="0.75" className={styles.pulseBox2} />
                    </svg>
                  </div>
 
                  {/* Callouts */}
                  <div className={`${styles.tagLabel} ${styles.tagLeft}`}>
                    <span className={styles.tagTextRed}>dent [94%]</span>
                  </div>
                  <div className={`${styles.tagLabel} ${styles.tagRight}`}>
                    <span className={styles.tagTextAmber}>scratch [87%]</span>
                  </div>
                </div>
 
                {/* Right 45% Readout Panel */}
                <div className={styles.readoutPanel}>
                  {/* Group 1 */}
                  <div className={styles.readoutGroup}>
                    <span className={styles.groupTitle}>[ CORE ENGINE ]</span>
                    <div className={styles.readoutRow}>
                      <span className={styles.rowLabel}>Severity</span>
                      <span className={styles.rowValCyan}>MODERATE</span>
                    </div>
                    <div className={styles.readoutRow}>
                      <span className={styles.rowLabel}>Confidence</span>
                      <span className={styles.rowVal}>94.2%</span>
                    </div>
                  </div>
 
                  {/* Group 2 */}
                  <div className={styles.readoutGroup}>
                    <span className={styles.groupTitle}>[ RISK ANALYSIS ]</span>
                    <div className={styles.readoutRow}>
                      <span className={styles.rowLabel}>Fraud Risk</span>
                      <span className={styles.rowValGreen}>LOW ●</span>
                    </div>
                    <div className={styles.readoutRow}>
                      <span className={styles.rowLabel}>Network Check</span>
                      <span className={styles.rowVal}>NOMINAL</span>
                    </div>
                  </div>
 
                  {/* Group 3 */}
                  <div className={styles.readoutGroup}>
                    <span className={styles.groupTitle}>[ DISBURSEMENT ]</span>
                    <div className={styles.payoutRow}>
                      <span className={styles.payoutLabel}>Approved Payout</span>
                      <span className={styles.payoutVal}>₹ 47,500</span>
                    </div>
                  </div>
 
                  {/* Blinking processing cursor footer */}
                  <div className={styles.readoutFooter}>
                    <span className={styles.processingText}>Processing</span>
                    <span className={styles.blinkingBlock}>▌</span>
                  </div>
                </div>
              </div>
            </div>
 
            {/* Below the Card: two horizontal bar charts labeled Minor, Moderate, Severe */}
            <div className={styles.belowCardCharts}>
              <div className={styles.distributionHeader}>SEVERITY DISTRIBUTION</div>
              <div className={styles.distributionChartsRow}>
                
                <div className={styles.chartBarRow}>
                  <span className={styles.barLabel}>Minor</span>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: '12%', background: '#10B981' }} />
                  </div>
                  <span className={styles.barVal}>12%</span>
                </div>
 
                <div className={styles.chartBarRow}>
                  <span className={styles.barLabel}>Moderate</span>
                  <div className={styles.barTrack}>
                    <div className={`${styles.barFill} ${styles.barFillActive}`} style={{ background: '#00D4FF' }} />
                  </div>
                  <span className={styles.barVal}>94%</span>
                </div>
 
                <div className={styles.chartBarRow}>
                  <span className={styles.barLabel}>Severe</span>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: '4%', background: '#EF4444' }} />
                  </div>
                  <span className={styles.barVal}>4%</span>
                </div>
 
              </div>
            </div>
 
          </div>
        </motion.div>

      </div>
    </section>
  );
}
