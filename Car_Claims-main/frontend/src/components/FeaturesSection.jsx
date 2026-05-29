import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, ShieldAlert, MessageSquare, LayoutGrid } from 'lucide-react';
import FeatureCard from './FeatureCard.jsx';
import styles from './FeaturesSection.module.css';

export default function FeaturesSection() {
  const [typedText, setTypedText] = useState("");
  const fullReportText = "Claim assessed: Moderate damage with 94.2% confidence. Estimated payout: ₹47,500. Fraud risk: Low. Deductible applied.";

  // Generative AI Chat Typewriter effect loop
  useEffect(() => {
    let charIdx = 0;
    let textBuffer = "";
    let typeInterval;
    let restartTimeout;

    const startTyping = () => {
      charIdx = 0;
      textBuffer = "";
      setTypedText("");
      
      typeInterval = setInterval(() => {
        if (charIdx < fullReportText.length) {
          textBuffer += fullReportText.charAt(charIdx);
          setTypedText(textBuffer);
          charIdx++;
        } else {
          clearInterval(typeInterval);
          restartTimeout = setTimeout(() => {
            startTyping();
          }, 3000);
        }
      }, 40);
    };

    startTyping();

    return () => {
      clearInterval(typeInterval);
      clearTimeout(restartTimeout);
    };
  }, []);

  return (
    <section id="features" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sub}>[ CORE CAPABILITIES ]</span>
          <h2 className={styles.title}>Three Engines. One Decision.</h2>
          <p className={styles.description}>
            From image to payout — fully automated, fully auditable.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Feature Card 1: Damage Assessment (Col-span 2) */}
          <FeatureCard
            title="Instant Visual Damage Assessment"
            description="Upload a photo of the damaged vehicle. Our visual intelligence models instantly analyze imagery to detect structural anomalies and severity."
            icon={Eye}
            badge="DIAGNOSTIC CORE"
            className={styles.cardLarge}
          >
            <div className={styles.pillsRow}>
              <span className={styles.pill}>Computer Vision</span>
              <span className={styles.pill}>Severity Scoring</span>
              <span className={styles.pill}>Confidence Metrics</span>
            </div>
            
            <div className={styles.visualWrapper}>
              <div className={styles.cameraFrame}>
                <div className={styles.cameraCorner + ' ' + styles.tl} />
                <div className={styles.cameraCorner + ' ' + styles.tr} />
                <div className={styles.cameraCorner + ' ' + styles.bl} />
                <div className={styles.cameraCorner + ' ' + styles.br} />
                
                <div className={styles.radarSweep} />
                
                <span className={styles.wireframeText}>CAMERA STREAM #AS-9 // RESOLUTION 4K</span>
                <span className={styles.wireframeStatus}>TRACKING FRONT FENDER... OK</span>
              </div>
            </div>
          </FeatureCard>

          {/* Feature Card 2: Fraud AI (Full height right column) */}
          <FeatureCard
            title="Predictive Fraud Scoring"
            description="Every claim is evaluated using proprietary behavioral and situational intelligence. The system securely returns a risk probability rating before manual review."
            icon={ShieldAlert}
            badge="FRAUD INTELLIGENCE"
            className={styles.cardMedium}
          >
            <div className={styles.riskBars}>
              <div className={styles.riskItem}>
                <div className={styles.riskHeader}>
                  <span className={styles.riskLabel}>Low Probability</span>
                  <span className={styles.riskVal} style={{ color: 'var(--green)' }}>23%</span>
                </div>
                <div className={styles.riskTrack}>
                  <motion.div 
                    className={styles.riskProgress} 
                    style={{ backgroundColor: 'var(--green)' }}
                    initial={{ width: 0 }}
                    whileInView={{ width: '23%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  />
                </div>
              </div>

              <div className={styles.riskItem}>
                <div className={styles.riskHeader}>
                  <span className={styles.riskLabel}>Medium Probability</span>
                  <span className={styles.riskVal} style={{ color: 'var(--amber)' }}>61%</span>
                </div>
                <div className={styles.riskTrack}>
                  <motion.div 
                    className={styles.riskProgress} 
                    style={{ backgroundColor: 'var(--amber)' }}
                    initial={{ width: 0 }}
                    whileInView={{ width: '61%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
              </div>

              <div className={styles.riskItem}>
                <div className={styles.riskHeader}>
                  <span className={styles.riskLabel}>High Probability</span>
                  <span className={styles.riskVal} style={{ color: 'var(--red)' }}>91%</span>
                </div>
                <div className={styles.riskTrack}>
                  <motion.div 
                    className={styles.riskProgress} 
                    style={{ backgroundColor: 'var(--red)' }}
                    initial={{ width: 0 }}
                    whileInView={{ width: '91%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </FeatureCard>

          {/* Feature Card 3: GenAI Explanations (Bottom Left) */}
          <FeatureCard
            title="Human-Readable Claim Reports"
            description="AI-generated explanations convert every model output into a clear, professional report — for your customer, your technician, and your auditor."
            icon={MessageSquare}
            badge="GENERATIVE AI"
          >
            <div className={styles.genAiChat}>
              <div className={styles.chatHeader}>
                <span className={styles.chatStatus}>● AI REPORT GENERATOR</span>
              </div>
              <div className={styles.chatBody}>
                <p className={styles.chatText}>
                  {typedText}
                  <span className={styles.chatBlinker}>▌</span>
                </p>
              </div>
            </div>
          </FeatureCard>

          {/* Feature Card 4: Admin Dashboard (Bottom Right, wide) */}
          <FeatureCard
            title="Real-Time Claims Dashboard"
            description="Every claim, every metric, every risk flag — visualized live. Technicians review AI insights and approve or reject with full audit trails."
            icon={LayoutGrid}
            badge="ADMIN INTELLIGENCE"
          >
            <div className={styles.miniDashboard}>
              <div className={styles.dashGrid}>
                <div className={styles.dashCard}>
                  <span className={styles.dashLabel}>Claims Today</span>
                  <span className={styles.dashNumber}>142</span>
                  <div className={styles.sparkline}>
                    <svg viewBox="0 0 50 15" className={styles.sparkSvg}>
                      <path d="M0,10 L10,8 L20,12 L30,5 L40,9 L50,2" fill="none" stroke="var(--cyan)" strokeWidth="1" />
                    </svg>
                  </div>
                </div>

                <div className={styles.dashCard}>
                  <span className={styles.dashLabel}>Fraud Flagged</span>
                  <span className={styles.dashNumber} style={{ color: 'var(--amber)' }}>12</span>
                  <div className={styles.sparkline}>
                    <svg viewBox="0 0 50 15" className={styles.sparkSvg}>
                      <path d="M0,13 L10,11 L20,9 L30,12 L40,7 L50,14" fill="none" stroke="var(--amber)" strokeWidth="1" />
                    </svg>
                  </div>
                </div>

                <div className={styles.dashCard}>
                  <span className={styles.dashLabel}>Avg. Settlement</span>
                  <span className={styles.dashNumber}>₹38.4k</span>
                  <div className={styles.sparkline}>
                    <svg viewBox="0 0 50 15" className={styles.sparkSvg}>
                      <path d="M0,12 L10,9 L20,13 L30,8 L40,6 L50,3" fill="none" stroke="var(--green)" strokeWidth="1" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
