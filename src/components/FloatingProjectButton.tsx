import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { t as translateText } from '../i18n';

export default function FloatingProjectButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show once scrolled past 350px, but hide if right on top of request-project form
      const scrollY = window.scrollY;
      const requestSec = document.getElementById('request-project');

      if (requestSec) {
        const top = requestSec.offsetTop;
        const height = requestSec.offsetHeight;
        if (scrollY >= top - 200 && scrollY < top + height) {
          setIsVisible(false);
          return;
        }
      }

      setIsVisible(scrollY > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    const el = document.getElementById('request-project');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          className="floating-project-cta"
          onClick={handleClick}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          title={translateText("Start a Project")}
          id="floating-start-project-btn"
        >
          <span className="floating-cta-pulse" aria-hidden="true" />
          <span className="floating-cta-label">{translateText("Start a Project")}</span>
          <span className="floating-cta-arrow">↗</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
