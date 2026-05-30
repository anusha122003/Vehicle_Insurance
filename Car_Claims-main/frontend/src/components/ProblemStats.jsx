import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styles from './ProblemStats.module.css';

function CountdownMinutes() {
  const [val, setVal] = useState(5.0);
  const [suffix, setSuffix] = useState("");
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      let start = 5.0;
      const end = 0.5;
      const stepTime = 40; // ms
      const steps = 30; // total steps
      const dec = (start - end) / steps;
      
      const timer = setInterval(() => {
        start -= dec;
        if (start <= end) {
          clearInterval(timer);
          setVal(0.5);
          setSuffix(" Min");
        } else {
          setVal(parseFloat(start.toFixed(1)));
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [inView]);

  return (
    <span ref={ref} className={styles.number}>
      {val}
      <span className={styles.suffix}>{suffix}</span>
    </span>
  );
}

function CountUpNumber({ target, suffix = "", duration = 1.5 }) {
  const [currentVal, setCurrentVal] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = parseFloat(target);
      if (isNaN(end)) {
        setCurrentVal(target);
        return;
      }
      
      const isFloat = target.toString().includes('.');
      const stepTime = 20;
      const totalSteps = (duration * 1000) / stepTime;
      const increment = end / totalSteps;
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          clearInterval(timer);
          setCurrentVal(end);
        } else {
          setCurrentVal(isFloat ? parseFloat(start.toFixed(1)) : Math.floor(start));
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [inView, target, duration]);

  return (
    <span ref={ref} className={styles.number}>
      {currentVal}
      <span className={styles.suffix}>{suffix}</span>
    </span>
  );
}

export default function ProblemStats() {
  const stats = [
    {
      type: "countdown",
      label: "Minutes to settlement",
      description: "Down from 5–10 business days",
      colorClass: "cyanEdge"
    },
    {
      type: "countup",
      target: "98.8",
      suffix: "%",
      label: "Damage detection accuracy",
      description: "Verified across 10,000+ claim images",
      colorClass: "greenEdge"
    },
    {
      type: "countup",
      target: "40",
      suffix: "%",
      label: "Fraud caught early",
      description: "Before human review, every time",
      colorClass: "amberEdge"
    }
  ];

  return (
    <section className={styles.statsSection} id="stats">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sub}>
            <span className={styles.subBrackets}>[</span>
            <span className={styles.subText}>PLATFORM PERFORMANCE</span>
            <span className={styles.subBrackets}>]</span>
          </span>
          <h2 className={styles.title}>Engineered for Absolute Certainty.</h2>
          <p className={styles.subtext}>Every claim. Every time. Measured, not estimated.</p>
        </div>

        <div className={styles.grid}>
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              className={`${styles.statCard} ${styles[stat.colorClass]}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
              data-hover="true"
            >
              <div className={styles.numberRow}>
                {stat.type === "countdown" ? (
                  <CountdownMinutes />
                ) : (
                  <CountUpNumber target={stat.target} suffix={stat.suffix} />
                )}
              </div>
              <div className={styles.label}>{stat.label}</div>
              <p className={styles.description}>{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
