import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styles from './ProblemStats.module.css';

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
      {suffix}
    </span>
  );
}

export default function ProblemStats() {
  const stats = [
    {
      target: "7.0",
      suffix: "m",
      label: "Average Settlement",
      description: "Claims are analyzed, verified, and approved autonomously in minutes rather than weeks.",
      tag: "SPEED",
      colorClass: "cyanEdge"
    },
    {
      target: "98.8",
      suffix: "%",
      label: "Visual Accuracy",
      description: "Surgical computer vision classification isolates exterior damage down to the millimeter.",
      tag: "PRECISION",
      colorClass: "greenEdge"
    },
    {
      target: "24x7",
      suffix: "",
      label: "Telemetry Auditing",
      description: "Continuous real-time anomaly checks on vehicle claims feeds to capture policy fraud instantly.",
      tag: "AVAILABILITY",
      colorClass: "amberEdge"
    }
  ];

  return (
    <section className={styles.statsSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sub}>[ PLATFORM PERFORMANCE ]</span>
          <h2 className={styles.title}>Engineered for Absolute Certainty.</h2>
          <p className={styles.subtext}>Every claim. Every time. Measured, not estimated.</p>
        </div>

        <div className={styles.grid}>
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              className={`${styles.statCard} ${styles[stat.colorClass]}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
              data-hover="true"
            >
              <div className={styles.badge}>{stat.tag}</div>
              <div className={styles.numberRow}>
                {stat.target === "24x7" ? (
                  <span className={styles.number}>24x7</span>
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
