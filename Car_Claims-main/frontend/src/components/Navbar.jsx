import { useState, useEffect } from 'react';
import { Shield, Menu, X, ChevronDown } from 'lucide-react';
import styles from './Navbar.module.css';
import { motion } from 'framer-motion';

const LANGS = ['English', 'Hindi', 'Kannada', 'Tamil'];
const LANG_CODES = { English: 'EN', Hindi: 'HI', Kannada: 'KN', Tamil: 'TM' };

export default function Navbar({ onOpenAuth, currentLanguage, onChangeLanguage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close lang dropdown when clicking outside
  useEffect(() => {
    if (!langOpen) return;
    const close = (e) => {
      if (!e.target.closest('[data-lang-dropdown]')) setLangOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [langOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const selectLang = (lang) => {
    onChangeLanguage(lang);
    setLangOpen(false);
  };

  const navLinks = [
    { label: 'Platform', href: '#features' },
    { label: 'Workflow', href: '#how-it-works' },
    { label: 'Tech Stack', href: '#tech-stack' },
  ];

  return (
    <>
      <motion.header 
        className={`${styles.navContainer} ${scrolled ? styles.scrolled : ''}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
      >
        <div className={styles.navInner}>

          {/* Brand logo */}
          <div
            className={styles.logo}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            role="button"
            tabIndex={0}
          >
            <div className={styles.logoIcon}>
              <Shield size={14} className={styles.shieldIcon} />
            </div>
            <span className={styles.logoText}>
              AUTO<span className={styles.logoCyan}>SHIELD</span><span className={styles.logoDot}>.</span>
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

            {/* Language dropdown */}
            <div className={styles.langWrapper} data-lang-dropdown>
              <button
                className={styles.langToggle}
                onClick={() => setLangOpen(v => !v)}
                aria-haspopup="listbox"
                aria-expanded={langOpen}
              >
                <span className={styles.langCode}>{LANG_CODES[currentLanguage]}</span>
                <span className={styles.langLabel}>A/अ</span>
                <ChevronDown size={12} className={`${styles.chevron} ${langOpen ? styles.chevronOpen : ''}`} />
              </button>
              {langOpen && (
                <div className={styles.langDropdown} role="listbox">
                  {LANGS.map(lang => (
                    <button
                      key={lang}
                      role="option"
                      aria-selected={lang === currentLanguage}
                      className={`${styles.langOption} ${lang === currentLanguage ? styles.langOptionActive : ''}`}
                      onClick={() => selectLang(lang)}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              className={styles.signInButton}
              onClick={() => onOpenAuth('signin')}
              data-hover="true"
            >
              Access Console
            </button>

            <button
              className={`${styles.ctaButton} magnetic-btn`}
              onClick={() => onOpenAuth('signup', 'customer')}
            >
              <span className={styles.ctaBtnInner}>Get Cover</span>
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
            <div className={styles.logoIcon}>
              <Shield size={14} className={styles.shieldIcon} />
            </div>
            <span className={styles.logoText}>AUTO<span className={styles.logoCyan}>SHIELD</span></span>
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
          <div className={styles.drawerLangGroup}>
            <span className={styles.drawerLangLabel}>Language</span>
            <div className={styles.drawerLangRow}>
              {LANGS.map(lang => (
                <button
                  key={lang}
                  className={`${styles.drawerLangBtn} ${lang === currentLanguage ? styles.drawerLangActive : ''}`}
                  onClick={() => { onChangeLanguage(lang); setMenuOpen(false); }}
                >
                  {LANG_CODES[lang]}
                </button>
              ))}
            </div>
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
            Get Cover →
          </button>
        </div>
      </div>
    </>
  );
}
