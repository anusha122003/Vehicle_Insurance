import styles from './TrustStrip.module.css';
import { motion } from 'framer-motion';

export default function TrustStrip() {
  const row1Items = [
    'TATA AIG', 'ICICI LOMBARD', 'HDFC ERGO', 'BAJAJ ALLIANZ', 'SBI GENERAL', 'STAR HEALTH', 'NEW INDIA ASSURANCE'
  ];

  const row2Items = [
    'NEXCLAIM', 'VERICOVER', 'INDOSURE', 'RAPIDSETTLE', 'CLAIMIT PRO', 'BHARAT ASSURE', 'TRUSTPAY'
  ];

  // Duplicate arrays to facilitate smooth marquee looping
  const dupRow1 = [...row1Items, ...row1Items, ...row1Items];
  const dupRow2 = [...row2Items, ...row2Items, ...row2Items];

  return (
    <motion.section 
      className={styles.marqueeSection}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1.2 }}
    >
      <div className={styles.labelRow}>
        <span className={styles.eyebrow}>[ TRUSTED BY INSURANCE TEAMS ACROSS INDIA ]</span>
      </div>

      {/* Row 1: Left to Right scrolling */}
      <div className={styles.marqueeContainer}>
        <div className={`${styles.marqueeTrack} ${styles.track1}`}>
          {dupRow1.map((item, index) => (
            <div key={index} className={styles.marqueeItem} data-hover="true">
              <span className={styles.companyName}>{item}</span>
              <span className={styles.dot}>·</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Right to Left scrolling */}
      <div className={styles.marqueeContainer} style={{ marginTop: '16px' }}>
        <div className={`${styles.marqueeTrack} ${styles.track2}`}>
          {dupRow2.map((item, index) => (
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
