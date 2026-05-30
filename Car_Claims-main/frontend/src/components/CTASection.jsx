import { motion } from 'framer-motion';
import styles from './CTASection.module.css';

export default function CTASection({ onOpenAuth }) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div 
          className={styles.ctaWrapper}
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.ctaInner}>
            {/* Internal ambient orbs from hero */}
            <div className={`${styles.ambientOrb} ${styles.orbCyan}`} />
            <div className={`${styles.ambientOrb} ${styles.orbAmber}`} />
            
            <h2 className={styles.title}>
              <span className={styles.titleLine1}>Ready to Process Claims</span>
              <span className={styles.titleLine2}>
                at the Speed of <span className={styles.titleSerif}>AI?</span>
              </span>
            </h2>
            
            <p className={styles.description}>
              Join insurance teams replacing 10-day cycles with 60-second decisions.
            </p>
 
            <div className={styles.actions}>
              <button 
                className={`${styles.primaryButton} magnetic-btn`}
                onClick={() => onOpenAuth('signup', 'customer')}
              >
                Get Started Now
              </button>
              <button 
                className={styles.secondaryButton}
                onClick={() => onOpenAuth('signin')}
              >
                Sign In to Console
              </button>
            </div>
 
            <div className={styles.trustCluster}>
              <span>[secured] SOC 2 Type II</span>
              <span className={styles.trustSep}>·</span>
              <span>No credit card</span>
              <span className={styles.trustSep}>·</span>
              <span>Setup in 5 minutes</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
