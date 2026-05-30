import styles from './Footer.module.css';

export default function Footer({ onOpenAuth }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Dynamic separating header line */}
      <div className={styles.separatorLine} />

      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Col 1: Brand */}
          <div className={styles.brandCol}>
            <div className={styles.logo}>
              <span className={styles.logoText}>AUTO<span className={styles.cyan}>SHIELD.</span></span>
            </div>
            <p className={styles.tagline}>AI precision. Human trust.</p>
 
            {/* v2.0 Social Icons Row (GitHub, LinkedIn, Twitter) */}
            <div className={styles.socialsRow}>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="GitHub">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LinkedIn">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Twitter">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
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
            © 2026 AutoShield · All rights reserved.
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
