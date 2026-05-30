import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';
import { motion } from 'framer-motion';

export default function Navbar({ onOpenAuth }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = [
    { label: 'Platform', href: '#features' },
    { label: 'Workflow', href: '#how-it-works' },
    { label: 'Architecture', href: '#tech-stack' },
  ];

  return (
    <>
      <motion.header 
        className={`${styles.navContainer} ${scrolled ? styles.scrolled : ''}`}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className={styles.navInner}>

          {/* Brand logo (Pure wordmark, no icon) */}
          <div
            className={styles.logo}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            role="button"
            tabIndex={0}
          >
            <span className={styles.logoText}>
              AUTO<span className={styles.logoCyan}>SHIELD.</span>
            </span>
          </div>

          {/* Center nav links */}
          <nav className={styles.navigation} aria-label="Primary navigation">
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href} className={styles.navLink}>
                {label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className={styles.actions}>

            {/* v2.0 Nominal Infrastructure Status Pill */}
            <div className={styles.statusPill}>
              <span className={styles.statusDot} />
              <span className={styles.statusText}>System Nominal</span>
            </div>

            <button
              className={styles.signInButton}
              onClick={() => onOpenAuth('signin')}
            >
              Access Console
            </button>

            <button
              className={`${styles.ctaButton} magnetic-btn`}
              onClick={() => onOpenAuth('signup', 'customer')}
            >
              <span className={styles.ctaBtnInner}>Start Free →</span>
              <span className={styles.ctaBtnGlow} />
            </button>

            {/* Mobile hamburger */}
            <button
              className={styles.menuToggle}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} className={styles.menuIcon} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`${styles.drawerOverlay} ${menuOpen ? styles.overlayVisible : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <div
        className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}
        role="dialog"
        aria-label="Navigation menu"
      >
        <div className={styles.drawerHeader}>
          <div className={styles.logo}>
            <span className={styles.logoText}>AUTO<span className={styles.logoCyan}>SHIELD.</span></span>
          </div>
          <button
            className={styles.drawerClose}
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} className={styles.menuIcon} />
          </button>
        </div>

        <div className={styles.drawerDivider} />

        <nav className={styles.drawerLinks}>
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className={styles.drawerLink}
              onClick={() => setMenuOpen(false)}
            >
              {label}
              <span className={styles.drawerLinkArrow}>→</span>
            </a>
          ))}
        </nav>

        <div className={styles.drawerDivider} />

        <div className={styles.drawerActions}>
          <div className={styles.drawerStatusPill}>
            <span className={styles.statusDot} />
            <span className={styles.statusText}>System Nominal</span>
          </div>

          <button
            className={styles.drawerSignInBtn}
            onClick={() => { setMenuOpen(false); onOpenAuth('signin'); }}
          >
            Access Console
          </button>
          <button
            className={styles.drawerCtaBtn}
            onClick={() => { setMenuOpen(false); onOpenAuth('signup', 'customer'); }}
          >
            Start Free →
          </button>
        </div>
      </div>
    </>
  );
}
