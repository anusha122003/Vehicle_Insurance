import { Shield } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer({ onOpenAuth }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Col 1: Brand */}
          <div className={styles.brandCol}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <Shield className="w-4 h-4 text-[#00D4FF]" />
              </div>
              <span className={styles.logoText}>AUTO<span className={styles.cyan}>SHIELD</span>.</span>
            </div>
            <p className={styles.tagline}>AI precision. Human trust.</p>
            <p className={styles.brandDescription}>
              Autonomous motor risk adjudication and computer vision telemetry pipelines. Built with surgical mathematical precision.
            </p>
          </div>

          {/* Col 2: Platform */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>PLATFORM</h4>
            <a href="#features" className={styles.link}>Diagnostic Core</a>
            <a href="#how-it-works" className={styles.link}>Auditing Pipeline</a>
            <a href="#tech-stack" className={styles.link}>System Integrations</a>
            <span className={styles.link} onClick={() => onOpenAuth('signup', 'customer')}>Pricing</span>
          </div>

          {/* Col 3: Resources */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>RESOURCES</h4>
            <span className={styles.link} onClick={() => alert('AutoShield Developer API Playground')}>Developer APIs</span>
            <span className={styles.link} onClick={() => alert('Vehicle registry audit guides')}>RTO Guidelines</span>
            <span className={styles.link} onClick={() => alert('System compliance audit reports')}>Security Reports</span>
            <span className={styles.link} onClick={() => alert('Visual claim documentation')}>Documentation</span>
          </div>

          {/* Col 4: Company */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>COMPANY</h4>
            <span className={styles.link} onClick={() => alert('Careers Bengaluru Hub / HSR Layout')}>Careers</span>
            <span className={styles.link} onClick={() => alert('AutoShield AI Research Whitepapers')}>Research Papers</span>
            <span className={styles.link} onClick={() => alert('contact@autoshield.ai')}>Contact Us</span>
            <span className={styles.link} onClick={() => alert('Privacy Policy & Terms')}>Privacy &amp; Terms</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {currentYear} AutoShield Technology &amp; Services Private Limited. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            <span className={styles.legalLink} onClick={() => alert('Privacy Policy')}>Privacy</span>
            <span className={styles.legalSep}>·</span>
            <span className={styles.legalLink} onClick={() => alert('Terms of Service')}>Terms</span>
            <span className={styles.legalSep}>·</span>
            <span className={styles.legalLink} onClick={() => alert('Cookie disclosure')}>Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
