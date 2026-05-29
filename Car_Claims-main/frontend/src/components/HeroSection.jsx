import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ChevronRight, Cpu } from 'lucide-react';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const [typedText, setTypedText] = useState("");
  const fullText = "AI CLAIM ENGINE ONLINE";
  const [typingPhase, setTypingPhase] = useState("typing");

  useEffect(() => {
    let timeout;
    if (typingPhase === "typing") {
      if (typedText.length === 0) {
        // Initial delay for typewriter
        timeout = setTimeout(() => setTypedText(fullText.slice(0, 1)), 200);
      } else if (typedText.length < fullText.length) {
        timeout = setTimeout(() => {
          setTypedText(fullText.slice(0, typedText.length + 1));
        }, 40);
      } else {
        timeout = setTimeout(() => setTypingPhase("done"), 2000);
      }
    } else if (typingPhase === "done") {
      timeout = setTimeout(() => {
        setTypedText("");
        setTypingPhase("typing");
      }, 500);
    }
    return () => clearTimeout(timeout);
  }, [typedText, typingPhase]);

  const [parallax, setParallax] = useState({ x: 0, y: 0, mousePos: { x: 0, y: 0 }, isHovered: false });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation (-1 to 1)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY);
    const rotateY = ((x - centerX) / centerX);

    setParallax({ x: rotateY, y: rotateX, mousePos: { x, y }, isHovered: true });
  };

  const handleMouseLeave = () => {
    setParallax(prev => ({ ...prev, x: 0, y: 0, isHovered: false }));
  };

  const [telemetryLogs, setTelemetryLogs] = useState([
    "SYS // INITIATING NEURAL SCAN...",
    "SYS // CONNECTING TO SATELLITE FEED..."
  ]);

  useEffect(() => {
    const logsList = [
      "SYS // DETECTED ANOMALY IN SECTOR 7",
      "SYS // PROCESSING DAMAGE ASSESSMENT...",
      "SYS // VERIFYING POLICY DETAILS...",
      "SYS // STREAM COMPLETED WITHOUT FAULTS"
    ];
    let logIdx = 0;
    const logInterval = setInterval(() => {
      if (logIdx < logsList.length) {
        setTelemetryLogs(prev => {
          const next = [...prev, logsList[logIdx]];
          if (next.length > 3) next.shift();
          return next;
        });
        logIdx++;
      } else {
        logIdx = 0;
        setTelemetryLogs([
          "SYS // RE-ESTABLISHING SHIELD LINK...",
          "SYS // BUFFER SYNC ACTIVE"
        ]);
      }
    }, 2000);

    return () => clearInterval(logInterval);
  }, []);

  const titleText = "Claims Settled in Seconds, Not Days.";

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.5
      }
    }
  };

  const wordVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.8 } }
  };

  const ctaVariant = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, delay: 1.0 } }
  };

  const trustVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, delay: 1.2 } }
  };

  const cardContainerVariant = {
    hidden: { opacity: 0, y: 40, rotateX: 2 },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.4 } 
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
    <section className={styles.heroWrapper} id="hero" data-cursor="default">
      <div className={styles.circuitPattern} />
      
      <div className={styles.heroContent}>
        
        {/* Left column text content */}
        <div className={styles.textColumn}>
          <motion.div 
            className={styles.badge}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className={styles.badgeText}>
              {typedText}
              <span className={styles.typewriterCursor}></span>
            </span>
          </motion.div>

          <motion.h1 
            className={styles.title}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {titleText.split(' ').map((word, idx) => (
              <motion.span key={idx} variants={wordVariant} style={{ display: 'inline-block', marginRight: '0.25em' }}>
                {word === 'Seconds,' ? <span className={styles.italicAccent}>{word}</span> : word}
              </motion.span>
            ))}
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
            >
              Start Free Scan <ChevronRight className={styles.btnArrow} />
            </motion.button>
            <button className={styles.secondaryButton}>
              See How It Works ↓
            </button>
          </motion.div>

          <motion.div 
            className={styles.trustCluster}
            variants={trustVariant}
            initial="hidden"
            animate="visible"
          >
            <span>✦ No credit card</span>
            <span className={styles.trustSep}>·</span>
            <span>✦ SOC 2 Ready</span>
            <span className={styles.trustSep}>·</span>
            <span>✦ Setup in 5 mins</span>
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

          <div 
            ref={cardRef}
            className={styles.scanCard}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
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

            {/* Sweep sweep line */}
            <div className={styles.scanLine} />

            {/* macOS Chrome Header */}
            <div className={styles.cardHeader}>
              <div className={styles.macDots}>
                <span className={styles.dotRed} />
                <span className={styles.dotAmber} />
                <span className={styles.dotGreen} />
              </div>
              <span className={styles.headerLabel}>AS-ANALYSIS.exe</span>
              <Cpu className="w-3.5 h-3.5 text-[#344555]" />
            </div>

            {/* Dark Camera Viewport Area */}
            <div className={styles.cameraViewport}>
              <span className={styles.streamLabel}>CAMERA STREAM #AS-01 // LIVE</span>
              
              <div className={styles.carGraphic}>
                <svg viewBox="0 0 100 45" className={styles.carSvg}>
                  <path 
                    d="M10,25 C15,25 18,22 25,20 C32,18 45,12 60,12 C75,12 82,18 85,22 C88,25 90,26 92,28 C94,30 95,33 93,35 C90,38 85,38 80,38 L20,38 C15,38 12,37 10,35 C8,33 8,28 10,25 Z" 
                    fill="none" 
                    stroke="rgba(0, 212, 255, 0.25)" 
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
                <span className={styles.tagTextRed}>DENT [94%]</span>
              </div>
              <div className={`${styles.tagLabel} ${styles.tagRight}`}>
                <span className={styles.tagTextAmber}>SCRATCH [87%]</span>
              </div>
            </div>

            {/* Underwriting metrics panel */}
            <div className={styles.readoutPanel}>
              <div className={styles.readoutGrid}>
                <div className={styles.readoutSection}>
                  <span className={styles.sectionHeader}>DAMAGE ANALYSIS</span>
                  <div className={styles.readoutRow}>
                    <span className={styles.rowLabel}>Severity</span>
                    <span className={styles.rowValAmber}>MODERATE</span>
                  </div>
                  <div className={styles.readoutRow}>
                    <span className={styles.rowLabel}>Confidence</span>
                    <span className={styles.rowVal}>94.2%</span>
                  </div>
                  <div className={styles.readoutRow}>
                    <span className={styles.rowLabel}>Est. Repair</span>
                    <span className={styles.rowVal}>₹ 12,500</span>
                  </div>
                </div>

                <div className={styles.readoutSection}>
                  <span className={styles.sectionHeader}>FRAUD SCORE</span>
                  <div className={styles.readoutRow}>
                    <span className={styles.rowLabel}>Risk Level</span>
                    <span className={styles.rowValGreen}>● LOW</span>
                  </div>
                  <div className={styles.readoutRow}>
                    <span className={styles.rowLabel}>Probability</span>
                    <span className={styles.rowVal}>1.8%</span>
                  </div>
                </div>
              </div>

              <div className={styles.readoutSeparator} />

              {/* Dynamic Telemetry Logging Stream */}
              <div className={styles.telemetrySection}>
                <span className={styles.sectionHeader}>LIVE RISK TELEMETRY STREAM</span>
                <div className={styles.telemetryConsole}>
                  {telemetryLogs.map((log, idx) => (
                    <div key={idx} className={styles.telemetryLine}>
                      <span className={styles.consolePrompt}>&gt;</span> {log}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.statusFooter}>
                <span className={styles.statusText}>STATUS: LIVE_DECRYPT_ACTIVE</span>
                <span className={styles.blinkingBlock}>▌</span>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
