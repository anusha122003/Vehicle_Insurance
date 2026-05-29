import { useState, useEffect } from 'react';
import styles from './ScrollProgressBar.module.css';

export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (totalHeight > 0) {
        const progress = window.scrollY / totalHeight;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={styles.progressBar}
      style={{ transform: `scaleX(${scrollProgress})` }}
    />
  );
}
