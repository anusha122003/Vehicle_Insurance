import { motion } from 'framer-motion';
import styles from './TechStack.module.css';
 
export default function TechStack() {
  const bands = [
    {
      layer: "PERCEPTION LAYER",
      desc: "Multi-modal computer vision engines instantly isolate damage exterior anomalies from standard smartphone images.",
      color: "cyan"
    },
    {
      layer: "RISK LAYER",
      desc: "Cross-checks situational parameters, metadata, and claim histories to flag predictive fraud exposure indicators.",
      color: "green"
    },
    {
      layer: "INTELLIGENCE LAYER",
      desc: "Generative synthesis engines compile visual findings and risk markers into auditable, natural language claim summaries.",
      color: "amber"
    },
    {
      layer: "INFRASTRUCTURE LAYER",
      desc: "High-throughput processing pipelines handle requests under secure SOC 2 Type II enterprise guidelines.",
      color: "grey"
    }
  ];
 
  return (
    <section id="tech-stack" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sub}>
            <span className={styles.subBrackets}>[</span>
            <span className={styles.subText}>PLATFORM ARCHITECTURE</span>
            <span className={styles.subBrackets}>]</span>
          </span>
          <h2 className={styles.title}>
            Built for Scale. Engineered for Trust<span className={styles.cyanPeriod}>.</span>
          </h2>
          <p className={styles.description}>
            Four unified operational layers built on secure, capability-based software architectures.
          </p>
        </div>
 
        <div className={styles.panelBox}>
          {/* Faint grid background detail */}
          <div className={styles.pcbGrid} />
 
          <div className={styles.bandsContainer}>
            {bands.map((band, idx) => (
              <motion.div 
                key={idx}
                className={`${styles.bandCard} ${styles[band.color]}`}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: idx * 0.08 }}
              >
                <div className={styles.bandLeftIndicator} />
                <div className={styles.bandContent}>
                  <span className={styles.bandLayerLabel}>{band.layer}</span>
                  <p className={styles.bandDesc}>{band.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
 
        </div>
      </div>
    </section>
  );
}
