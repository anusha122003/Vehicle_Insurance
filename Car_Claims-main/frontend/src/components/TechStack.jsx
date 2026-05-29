import { motion } from 'framer-motion';
import styles from './TechStack.module.css';

export default function TechStack() {
  const aiLayer = [
    { name: "YOLOv8", sub: "DAMAGE DETECT" },
    { name: "EfficientNet-B0", sub: "SEVERITY CLASS." },
    { name: "XGBoost", sub: "FRAUD MODEL" },
    { name: "Llama-3", sub: "EXPLANATIONS" }
  ];

  const infraLayer = [
    { name: "FastAPI", sub: "API LAYER" },
    { name: "React 19", sub: "UI PIPELINE" },
    { name: "Snowflake", sub: "DATA CLOUD" },
    { name: "Scikit-learn", sub: "ML UTILITIES" }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    }
  };

  return (
    <section id="tech-stack" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sub}>[ SYSTEM ARCHITECTURE ]</span>
          <h2 className={styles.title}>The Integration Stack.</h2>
          <p className={styles.description}>
            Powered by pure-code diagnostic tools and lightning-fast data frameworks. Zero heavy image dependencies.
          </p>
        </div>

        {/* Panel Box containing PCB texture grid detail */}
        <div className={styles.panelBox}>
          <div className={styles.pcbGrid} />

          {/* AI Layer */}
          <div className={styles.layerGroup}>
            <span className={styles.layerLabel}>AI LAYER</span>
            <motion.div 
              className={styles.techGrid}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
            >
              {aiLayer.map((tech, index) => (
                <motion.div 
                  key={index} 
                  className={styles.techCard}
                  variants={itemVariants}
                  data-hover="true"
                >
                  <span className={styles.name}>{tech.name}</span>
                  <span className={styles.category}>{tech.sub}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Infrastructure Layer */}
          <div className={styles.layerGroup} style={{ marginTop: '40px' }}>
            <span className={styles.layerLabel}>INFRASTRUCTURE</span>
            <motion.div 
              className={styles.techGrid}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
            >
              {infraLayer.map((tech, index) => (
                <motion.div 
                  key={index} 
                  className={styles.techCard}
                  variants={itemVariants}
                  data-hover="true"
                >
                  <span className={styles.name}>{tech.name}</span>
                  <span className={styles.category}>{tech.sub}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
