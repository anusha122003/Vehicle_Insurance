import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Cpu, Globe } from 'lucide-react';
import { useMouseParallax } from '../utils/mouseParallax.js';
import styles from './HeroSection.module.css';

export default function HeroSection({ onOpenAuth }) {
  const cardRef = useRef(null);
  const parallax = useMouseParallax();
  
  // Dynamic stats counting state
  const [severityVal, setSeverityVal] = useState("CALC");
  const [confidenceVal, setConfidenceVal] = useState(0);
  const [repairCost, setRepairCost] = useState(0);
  const [probValue, setProbValue] = useState(0);

  // Typewriter effect state for blinking cursor
  const [eyebrowText, setEyebrowText] = useState("");
  const eyebrowFull = "AI-POWERED CLAIMS PLATFORM";

  // Telemetry stream logs
  const [telemetryLogs, setTelemetryLogs] = useState([
    "SYS // CORRELATING MODEL SUITES...",
    "SYS // FETCHING DATA BLOCK...",
  ]);

  useEffect(() => {
    // Eyebrow typewriter sequence
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < eyebrowFull.length) {
        setEyebrowText(prev => prev + eyebrowFull.charAt(currentIdx));
        currentIdx++;
      } else {
        clearInterval(interval);
      }
    }, 45);

    // Dynamic metrics one-time count-up when section loads
    const metricsTimeout = setTimeout(() => {
      setSeverityVal("MODERATE");
      
      let confStart = 0;
      const confInterval = setInterval(() => {
        if (confStart >= 94.2) {
          setConfidenceVal(94.2);
          clearInterval(confInterval);
        } else {
          confStart += 2.1;
          setConfidenceVal(parseFloat(confStart.toFixed(1)));
        }
      }, 25);

      let costStart = 0;
      const costInterval = setInterval(() => {
        if (costStart >= 47500) {
          setRepairCost(47500);
          clearInterval(costInterval);
        } else {
          costStart += 1250;
          setRepairCost(Math.min(costStart, 47500));
        }
      }, 20);

      let probStart = 0;
      const probInterval = setInterval(() => {
        if (probStart >= 8.3) {
          setProbValue(8.3);
          clearInterval(probInterval);
        } else {
          probStart += 0.5;
          setProbValue(parseFloat(probStart.toFixed(1)));
        }
      }, 30);

    }, 1400);

    // Telemetry log stream simulation loop
    const logsList = [
      "SYS // FETCHING DATA BLOCK... OK",
      "SYS // INGESTING CAMERA FRAME AS-01",
      "YOLOv8 // INITIALIZING WEIGHTS... SYNCED",
      "YOLOv8 // SEGMENTATION PASS STARTED",
      "YOLOv8 // DENT DETECTED [94.2%]",
      "YOLOv8 // SCRATCH DETECTED [87.5%]",
      "EFF-NET // RUNNING SEVERITY MATRIX",
      "EFF-NET // CLASSIFIED: MODERATE DAMAGE",
      "XGBOOST // COMPUTING RISK VECTORS",
      "XGBOOST // BEHAVIOR MATCH: 8.3% CONF",
      "LLAMA // GENERATING DIAGNOSTICS...",
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

    return () => {
      clearInterval(interval);
      clearTimeout(metricsTimeout);
      clearInterval(logInterval);
    };
  }, []);

  const handleMouseMove = (e) => {
    parallax.handleMouseMove(e, cardRef);
  };

  const titleText = "Claims Settled in Seconds, Not Days.";

  // Page Load Framer Motion animation variants
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
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const subtitleVariant = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        delay: 0.8
      }
    }
  };

  const ctaVariant = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
        delay: 1.0
      }
    }
  };

  const trustVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        delay: 1.2
      }
    }
  };

  const cardContainerVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        delay: 1.4
      }
    }
  };

  return (
    <section className={styles.heroWrapper}>
      {/* Dynamic Background Elements */}
      <div className={styles.circuitPattern} />

      <div className={styles.heroContent}>
        {/* Left column text details */}
        <div className={styles.textColumn}>
          <div className={styles.badge} data-hover="true">
            <span className={styles.badgeText}>
              [ {eyebrowText}<span className={styles.typewriterCursor}>_</span> ]
            </span>
          </div>

          <motion.h1 
            className={styles.title}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {titleText.split(" ").map((word, idx) => {
              const isAccent = word === "Seconds,";
              return (
                <motion.span 
                  key={idx} 
                  variants={wordVariant}
                  className={isAccent ? styles.italicAccent : undefined}
                  style={{ display: 'inline-block', whiteSpace: 'pre' }}
                >
                  {word}{" "}
                </motion.span>
              );
            })}
          </motion.h1>

          <motion.p 
            className={styles.subtitle}
            variants={subtitleVariant}
            initial="hidden"
            animate="visible"
          >
            AutoShield uses computer vision and AI to process vehicle insurance claims instantly — accurate, transparent, and free of human bias.
          </motion.p>

          <motion.div 
            className={styles.ctaRow}
            variants={ctaVariant}
            initial="hidden"
            animate="visible"
          >
            <button 
              className={`${styles.primaryButton} magnetic-btn`}
              onClick={() => onOpenAuth('signup', 'customer')}
            >
              Get Started
              <span className={styles.btnArrow}>→</span>
            </button>
            <button 
              className={styles.secondaryButton}
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              data-hover="true"
            >
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
          <div 
            ref={cardRef}
            className={styles.scanCard}
            onMouseMove={handleMouseMove}
            onMouseLeave={parallax.handleMouseLeave}
            data-cursor="scan"
            style={{
              transform: parallax.isHovered 
                ? `perspective(1200px) rotateX(${parallax.coords.y * -3}deg) rotateY(${parallax.coords.x * 3}deg) translateZ(10px)` 
                : 'perspective(1200px) rotateY(-4deg) rotateX(2deg)',
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
                    <span className={styles.rowValAmber}>{severityVal}</span>
                  </div>
                  <div className={styles.readoutRow}>
                    <span className={styles.rowLabel}>Confidence</span>
                    <span className={styles.rowVal}>{confidenceVal}%</span>
                  </div>
                  <div className={styles.readoutRow}>
                    <span className={styles.rowLabel}>Est. Repair</span>
                    <span className={styles.rowVal}>₹ {repairCost.toLocaleString()}</span>
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
                    <span className={styles.rowVal}>{probValue}%</span>
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
