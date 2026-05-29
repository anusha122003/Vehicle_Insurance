import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { UploadCloud, CheckCircle2, AlertTriangle, Landmark, Terminal } from 'lucide-react';
import styles from './HowItWorks.module.css';

export default function HowItWorks() {
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"]
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const steps = [
    {
      num: "01",
      title: "Submit Claim",
      description: "Upload your vehicle photo and fill in the claim details. The platform accepts standard image formats instantly.",
      icon: UploadCloud,
      visualType: "upload"
    },
    {
      num: "02",
      title: "AI Analysis",
      description: "Computer vision scans for damage. Risk scoring evaluates fraud signals. Both happen in parallel, in under a second.",
      icon: Terminal,
      visualType: "scan"
    },
    {
      num: "03",
      title: "Expert Review",
      description: "Your technician sees AI-generated insights — damage severity, confidence scores, fraud probability — and makes the final call.",
      icon: AlertTriangle,
      visualType: "fraud"
    },
    {
      num: "04",
      title: "Instant Payout",
      description: "Once approved, the payout is calculated to the rupee. Your customer receives a detailed AI-written summary of the decision.",
      icon: CheckCircle2,
      visualType: "payout"
    }
  ];

  const renderStepVisual = (type) => {
    switch (type) {
      case "upload":
        return (
          <div className={styles.visualBox}>
            <UploadCloud className="w-8 h-8 text-[#00D4FF] mb-2" />
            <span className={styles.visualText}>SELECT_IMAGE.PNG</span>
            <span className={styles.visualSubtext}>Size: 4.2 MB // FORMAT: RAW</span>
          </div>
        );
      case "scan":
        return (
          <div className={styles.visualBox}>
            <div className={styles.miniScanFrame}>
              <div className={styles.miniScanSweep} />
              <div className={styles.miniCar}>
                <svg viewBox="0 0 100 40" style={{ width: '80%' }}>
                  <path d="M10,22 C20,22 30,17 40,15 C55,10 75,10 85,18 C90,22 90,25 90,30 L10,30 Z" fill="none" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="1" />
                  <rect x="25" y="14" width="10" height="7" rx="1" fill="rgba(239, 68, 68, 0.15)" stroke="#EF4444" strokeWidth="0.5" />
                </svg>
              </div>
            </div>
          </div>
        );
      case "fraud":
        return (
          <div className={styles.visualBox}>
            <div className={styles.miniRiskGroup}>
              <span className={styles.riskLabel}>Fraud Probability</span>
              <span className={styles.riskPct} style={{ color: 'var(--green)' }}>8.3% [LOW]</span>
              <div className={styles.riskBar}>
                <div className={styles.riskProg} style={{ width: '8.3%', backgroundColor: 'var(--green)' }} />
              </div>
            </div>
          </div>
        );
      case "payout":
        return (
          <div className={styles.visualBox}>
            <CheckCircle2 className="w-8 h-8 text-[#10B981] mb-2" />
            <span className={styles.visualTextGreen}>₹47,500 DISBURSED</span>
            <span className={styles.visualSubtext}>TX: SECURE_LEDGER_A982</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="how-it-works" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sub}>[ WORKFLOW ]</span>
          <h2 className={styles.title}>From Photo to Payout.</h2>
          <p className={styles.description}>
            Four automated steps. One seamless experience.
          </p>
        </div>

        <div ref={timelineRef} className={styles.timelineWrapper}>
          {/* Vertical central timeline line */}
          <div className={styles.centerLine} />
          <motion.div 
            className={styles.centerLineActive} 
            style={{ scaleY, transformOrigin: 'top' }}
          />

          <div className={styles.stepsContainer}>
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isEven = index % 2 === 1;

              return (
                <div 
                  key={index} 
                  className={`${styles.stepRow} ${isEven ? styles.rowEven : styles.rowOdd}`}
                >
                  {/* Visual Card (odd: left, even: right) */}
                  <motion.div 
                    className={styles.visualCardCol}
                    initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className={styles.stepVisualCard}>
                      {renderStepVisual(step.visualType)}
                    </div>
                  </motion.div>

                  {/* Centered Number Indicator bubble */}
                  <div className={styles.centerCol}>
                    <motion.div 
                      className={styles.numberCircle}
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                    >
                      <span className={styles.numberText}>{step.num}</span>
                    </motion.div>
                  </div>

                  {/* Text Details (odd: right, even: left) */}
                  <motion.div 
                    className={styles.textCol}
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                  >
                    <div className={styles.contentBox}>
                      <div className={styles.stepHeader}>
                        <div className={styles.iconCircle}>
                          <StepIcon className="w-4 h-4 text-[#00D4FF]" />
                        </div>
                        <h3 className={styles.stepTitle}>{step.title}</h3>
                      </div>
                      <p className={styles.stepDescription}>{step.description}</p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
