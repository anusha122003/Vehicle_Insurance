import styles from './TrustStrip.module.css';
import { motion } from 'framer-motion';

export default function TrustStrip() {
  const rowItems = [
    'BHARAT ASSURE', 'NEXCLAIM', 'VERICOVER', 'INDOSURE', 'RAPIDSETTLE', 'CLAIMIT PRO', 'TRUSTPAY'
  ];

  // Duplicate arrays to facilitate smooth marquee looping
  const dupRow = [...rowItems, ...rowItems, ...rowItems, ...rowItems];

  return (
    <motion.section 
      className={styles.marqueeSection}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.9 }}
    >

      {/* Single Row: Left to Right scrolling */}
      <div className={styles.marqueeContainer}>
        <div className={`${styles.marqueeTrack} ${styles.track1}`}>
          {dupRow.map((item, index) => (
            <div key={index} className={styles.marqueeItem} data-hover="true">
              <span className={styles.companyName}>{item}</span>
              <span className={styles.dot}>·</span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
