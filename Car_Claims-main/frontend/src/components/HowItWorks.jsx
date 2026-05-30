import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { UploadCloud, CheckCircle2, Landmark, Terminal, UserCheck } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import styles from './HowItWorks.module.css';

function AnimatedPayoutDisbursement() {
  const [payoutVal, setPayoutVal] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = 47500;
      const steps = 40;
      const dec = end / steps;
      const timer = setInterval(() => {
        start += dec;
        if (start >= end) {
          clearInterval(timer);
          setPayoutVal(end);
        } else {
          setPayoutVal(Math.floor(start));
        }
      }, 25);
      return () => clearInterval(timer);
    } else {
      setPayoutVal(0);
    }
  }, [inView]);

  return (
    <div ref={ref} className={styles.payoutContainer}>
      <CheckCircle2 size={32} className={styles.checkmarkIconAnim} />
      <span className={styles.payoutAmountText}>₹{payoutVal.toLocaleString('en-IN')} DISBURSED</span>
      <span className={styles.payoutTxnRef}>TXN // AS-9081-LGR</span>
    </div>
  );
}

export default function HowItWorks() {
  const timelineRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"]
  });
  
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
 
  const steps = [
    {
      num: "01",
      numLabel: "Step 01",
      title: "Submit Claim",
      description: "Upload your vehicle photo and claim details. The platform accepts standard mobile photography formats instantly.",
      icon: UploadCloud,
      visualType: "upload"
    },
    {
      num: "02",
      numLabel: "Step 02",
      title: "AI Analysis",
      description: "Computer vision classification scans for structural anomalies while risk algorithms flag anomalies concurrently in under 1 second.",
      icon: Terminal,
      visualType: "scan"
    },
    {
      num: "03",
      numLabel: "Step 03",
      title: "Expert Review",
      description: "Adjusters review automatically sorted diagnostics—confidence factors and severity parameters—to execute instant secure approvals.",
      icon: UserCheck,
      visualType: "review"
    },
    {
      num: "04",
      numLabel: "Step 04",
      title: "Instant Payout",
      description: "Calculated repair disbursements are processed down to the single rupee. SECURE ledger hashes execute direct wire settle logs.",
      icon: Landmark,
      visualType: "payout"
    }
  ];
 
  const renderStepVisual = (type) => {
    switch (type) {
      case "upload":
        return (
          <div className={styles.visualBox}>
            <div className={styles.uploadZone}>
              <UploadCloud className={styles.uploadIconAnim} size={32} />
            </div>
          </div>
        );
      case "scan":
        return (
          <div className={styles.visualBox}>
            <div className={styles.miniScanFrame}>
              <div className={styles.miniScanSweep} />
              <div className={styles.miniCar}>
                <svg viewBox="0 0 100 45" style={{ width: '80%' }}>
                  <path 
                    d="M10,25 C15,25 18,22 25,20 C32,18 45,12 60,12 C75,12 82,18 85,22 C88,25 90,26 92,28 C94,30 95,33 93,35 C90,38 85,38 80,38 L20,38 C15,38 12,37 10,35 C8,33 8,28 10,25 Z" 
                    fill="none" 
                    stroke="#CBD5E1" 
                    strokeWidth="1" 
                  />
                  <rect x="24" y="16" width="14" height="9" rx="1.5" fill="rgba(220, 38, 38, 0.08)" stroke="#DC2626" strokeWidth="0.75" />
                </svg>
              </div>
            </div>
          </div>
        );
      case "review":
        return (
          <div className={styles.visualBox}>
            <div className={styles.interfaceButtons}>
              <button className={styles.btnApprove}>Approve</button>
              <button className={styles.btnReject}>Reject</button>
            </div>
          </div>
        );
      case "payout":
        return <AnimatedPayoutDisbursement />;
      default:
        return null;
    }
  };

  return (
    <section id="how-it-works" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sub}>
            <span className={styles.subBrackets}>[</span>
            <span className={styles.subText}>WORKFLOW</span>
            <span className={styles.subBrackets}>]</span>
          </span>
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
                <motion.div 
                  key={index} 
                  className={`${styles.stepRow} ${isEven ? styles.rowEven : styles.rowOdd}`}
                  onViewportEnter={() => setActiveStep(index)}
                  viewport={{ amount: 0.6 }}
                >
                  {/* Visual Card (odd: left, even: right) */}
                  <motion.div 
                    className={styles.visualCardCol}
                    initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className={`${styles.stepVisualCard} ${activeStep === index ? styles.cardActive : ''}`}>
                      {renderStepVisual(step.visualType)}
                    </div>
                  </motion.div>

                  {/* Centered Number Indicator bubble */}
                  <div className={styles.centerCol}>
                    <div className={`${styles.numberCircle} ${activeStep === index ? styles.numberCircleActive : ''}`}>
                      <span className={styles.numberText}>{step.num}</span>
                    </div>
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
                        <div className={`${styles.iconCircle} ${activeStep === index ? styles.iconCircleActive : ''}`}>
                          <StepIcon size={16} className={styles.stepIconElement} />
                        </div>
                        <h3 className={`${styles.stepTitle} ${activeStep === index ? styles.titleActive : ''}`}>{step.title}</h3>
                      </div>
                      <p className={styles.stepDescription}>{step.description}</p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
