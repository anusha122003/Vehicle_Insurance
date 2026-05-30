import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, MessageSquare } from 'lucide-react';
import styles from './FeaturesSection.module.css';
 
export default function FeaturesSection() {
  const [typedText, setTypedText] = useState("");
  const fullText = "Moderate damage · 94.2% confidence · Payout: ₹47,500 · Fraud risk: LOW ✓";
 
  // Dynamic Typewriter Simulator for Card C
  useEffect(() => {
    let idx = 0;
    let timer;
    
    const type = () => {
      if (idx <= fullText.length) {
        setTypedText(fullText.slice(0, idx));
        idx++;
        timer = setTimeout(type, 35);
      } else {
        // Blinking cursor remains for 2 seconds
        timer = setTimeout(() => {
          setTypedText(""); // resets (clears)
          // then the whole sequence waits 6 seconds in reset state before repeating
          timer = setTimeout(() => {
            idx = 0;
            type();
          }, 6000);
        }, 2000);
      }
    };
    
    type();
    return () => clearTimeout(timer);
  }, []);
 
  return (
    <section id="features" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sub}>
            <span className={styles.subBrackets}>[</span>
            <span className={styles.subText}>CORE CAPABILITIES</span>
            <span className={styles.subBrackets}>]</span>
          </span>
          <h2 className={styles.title}>Three Engines. One Decision.</h2>
          <p className={styles.description}>
            From image to payout — fully automated, fully auditable.
          </p>
        </div>
 
        {/* CSS Grid Bento Box */}
        <div className={styles.bentoGrid}>
 
          {/* CARD A — Full Width Top Card (Damage assessment) */}
          <div className={`${styles.bentoCard} ${styles.cardA}`}>
            <div className={styles.cardHoverGlow} />
            <div className={styles.cardAContent}>
              
              {/* Text Area (45%) */}
              <div className={styles.cardAText}>
                <span className={styles.badgeLabel}>
                  <span className={styles.subBrackets}>[</span>
                  <span className={styles.subText}>DIAGNOSTIC CORE</span>
                  <span className={styles.subBrackets}>]</span>
                </span>
                <h3 className={styles.cardH3}>Computer Vision Damage Assessment</h3>
                <p className={styles.cardDesc}>
                  Upload a photo of the vehicle. Our visual intelligence engines instantly analyze the exterior to isolate damage severity down to the exact millimeter.
                </p>
                <div className={styles.badgesRow}>
                  <span className={styles.badgePill}>Visual Detection</span>
                  <span className={styles.badgePill}>Severity Scoring</span>
                  <span className={styles.badgePill}>Confidence Metrics</span>
                </div>
              </div>
 
              {/* Visual Area (55% Heatmap overlay) */}
              <div className={styles.cardAVisual}>
                <div className={styles.heatmapViewport}>
                  <span className={styles.viewportHeader}>DIAGNOSTIC HUD // HEATMAP SCAN</span>
                  <div className={styles.sweeperLine} />
                  
                  {/* Sleek curving vector profile of a modern car matching the Hero Section */}
                  <div className={styles.cssCarProfile}>
                    <svg viewBox="0 0 100 45" className={styles.carSvgVisual}>
                      <path 
                        d="M10,25 C15,25 18,22 25,20 C32,18 45,12 60,12 C75,12 82,18 85,22 C88,25 90,26 92,28 C94,30 95,33 93,35 C90,38 85,38 80,38 L20,38 C15,38 12,37 10,35 C8,33 8,28 10,25 Z" 
                        fill="none" 
                        stroke="#CBD5E1" 
                        strokeWidth="1"
                      />
                    </svg>

                    {/* Bumper Hotspot */}
                    <div className={`${styles.hotspot} ${styles.frontHotspot}`}>
                      <div className={styles.hotspotOuter} />
                      <div className={styles.hotspotInner} />
                      <div className={styles.hotspotConnector} />
                      <span className={styles.hotspotLabel}>IMPACT_01</span>
                    </div>

                    {/* Door Hotspot */}
                    <div className={`${styles.hotspot} ${styles.doorHotspot}`}>
                      <div className={styles.hotspotOuter} />
                      <div className={styles.hotspotInner} />
                      <div className={styles.hotspotConnector} />
                      <span className={styles.hotspotLabel}>IMPACT_02</span>
                    </div>

                    {/* Rear Hotspot */}
                    <div className={`${styles.hotspot} ${styles.rearHotspot}`}>
                      <div className={styles.hotspotOuter} />
                      <div className={styles.hotspotInner} />
                      <div className={styles.hotspotConnector} />
                      <span className={styles.hotspotLabel}>IMPACT_03</span>
                    </div>
                  </div>
                  
                  {/* Below the car visual: three small clinical readout bars side by side */}
                  <div className={styles.clinicalReadoutRow}>
                    <div className={styles.readoutBarGroup}>
                      <span className={styles.readoutBarLabel}>MINOR</span>
                      <div className={styles.readoutBarTrack}>
                        <div className={styles.readoutBarFill} style={{ width: '30%', background: '#10B981' }} />
                      </div>
                    </div>
                    <div className={styles.readoutBarGroup}>
                      <span className={styles.readoutBarLabel}>MODERATE</span>
                      <div className={styles.readoutBarTrack}>
                        <div className={`${styles.readoutBarFill} ${styles.readoutBarFillActive}`} style={{ width: '94%', background: '#F59E0B' }} />
                      </div>
                    </div>
                    <div className={styles.readoutBarGroup}>
                      <span className={styles.readoutBarLabel}>SEVERE</span>
                      <div className={styles.readoutBarTrack}>
                        <div className={styles.readoutBarFill} style={{ width: '20%', background: '#EF4444' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
 
            </div>
          </div>
 
          {/* CARD B — Bottom Left (Risk Assessment) */}
          <div className={`${styles.bentoCard} ${styles.cardB}`}>
            <div className={styles.cardHoverGlow} />
            <div className={styles.cardHeader}>
              <span className={styles.badgeLabel}>
                <span className={styles.subBrackets}>[</span>
                <span className={styles.subText}>RISK INTELLIGENCE</span>
                <span className={styles.subBrackets}>]</span>
              </span>
              {/* Shield SVG Inline icon */}
              <svg className={styles.shieldIcon} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#00D4FF" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            
            <h3 className={styles.cardH3}>Predictive Fraud Scoring</h3>
            <p className={styles.cardDesc}>
              Every claim is cross-checked across situational parameters, producing instant risk markers before human adjuster eyes ever see it.
            </p>
 
            <div className={styles.riskBars}>
              <div className={styles.riskItem}>
                <div className={styles.riskHeader}>
                  <span className={styles.riskLabel}>Low Risk</span>
                  <span className={styles.riskVal} style={{ color: '#10B981' }}>23%</span>
                </div>
                <div className={styles.riskTrack}>
                  <motion.div 
                    className={styles.riskProgress} 
                    style={{ backgroundColor: '#10B981' }}
                    initial={{ width: 0 }}
                    whileInView={{ width: '23%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  />
                </div>
              </div>
 
              <div className={styles.riskItem}>
                <div className={styles.riskHeader}>
                  <span className={styles.riskLabel}>Medium Risk</span>
                  <span className={styles.riskVal} style={{ color: '#F59E0B' }}>61%</span>
                </div>
                <div className={styles.riskTrack}>
                  <motion.div 
                    className={styles.riskProgress} 
                    style={{ backgroundColor: '#F59E0B' }}
                    initial={{ width: 0 }}
                    whileInView={{ width: '61%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
              </div>
 
              <div className={styles.riskItem}>
                <div className={styles.riskHeader}>
                  <span className={styles.riskLabel}>High Risk</span>
                  <span className={styles.riskVal} style={{ color: '#EF4444' }}>91%</span>
                </div>
                <div className={styles.riskTrack}>
                  <motion.div 
                    className={styles.riskProgress} 
                    style={{ backgroundColor: '#EF4444' }}
                    initial={{ width: 0 }}
                    whileInView={{ width: '91%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </div>
 
          {/* CARD C — Bottom Right (Generative AI Explanations) */}
          <div className={`${styles.bentoCard} ${styles.cardC}`}>
            <div className={styles.cardHoverGlow} />
            <div className={styles.cardHeader}>
              <span className={styles.badgeLabel}>
                <span className={styles.subBrackets}>[</span>
                <span className={styles.subText}>AI ASSISTANT</span>
                <span className={styles.subBrackets}>]</span>
              </span>
              <MessageSquare size={18} className={styles.chatIcon} />
            </div>
 
            <h3 className={styles.cardH3}>Human-Readable Claim Reports</h3>
            <p className={styles.cardDesc}>
              AI synthesis instantly creates detailed natural language summaries of claim decisions to outline findings for customers, repair technicians, and internal audits.
            </p>
 
            {/* Pure CSS chat mockup with dynamic typing effect */}
            <div className={styles.chatMockupContainer}>
              <div className={styles.chatMockupHeader}>
                <div className={styles.chatHeaderLeft}>
                  <span className={styles.pulsingCyanDot} />
                  <span className={styles.chatHeaderText}>AUTOSHIELD AI</span>
                </div>
                <span className={styles.chatHeaderRight}>● ONLINE</span>
              </div>
              
              {/* User message bubble */}
              <div className={styles.chatBubbleUser}>
                <p className={styles.chatMessage}>Status of claim #AS-4821?</p>
              </div>
 
              {/* AI message bubble */}
              <div className={styles.chatBubbleAi}>
                <p className={styles.chatMessage}>
                  {typedText}
                  <span className={styles.chatCursor}>▌</span>
                </p>
              </div>
            </div>
          </div>
 
        </div>
      </div>
    </section>
  );
}
