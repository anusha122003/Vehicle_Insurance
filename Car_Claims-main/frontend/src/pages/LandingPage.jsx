import Navbar from '../components/Navbar.jsx';
import HeroSection from '../components/HeroSection.jsx';
import TrustStrip from '../components/TrustStrip.jsx';
import ProblemStats from '../components/ProblemStats.jsx';
import FeaturesSection from '../components/FeaturesSection.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import TechStack from '../components/TechStack.jsx';
import Testimonials from '../components/Testimonials.jsx';
import CTASection from '../components/CTASection.jsx';
import Footer from '../components/Footer.jsx';
import { motion } from 'framer-motion';

// v2.0 Global Interactive Overlays
import ScrollProgressBar from '../components/ScrollProgressBar.jsx';
import BackgroundOrbs from '../components/BackgroundOrbs.jsx';
import CustomCursor from '../components/CustomCursor.jsx';
import FloatingChatbot from '../components/FloatingChatbot.jsx';

export default function LandingPage({ onOpenAuth, currentLanguage, onChangeLanguage }) {
  return (
    <motion.div 
      initial={{ backgroundColor: '#FFFFFF' }}
      animate={{ backgroundColor: '#F8F9FB' }} // var(--bg-void)
      transition={{ duration: 0.4, delay: 0.05 }}
      style={{ minHeight: '100vh', color: 'var(--text-primary)', overflowX: 'hidden' }}
    >
      
      {/* v2.0 Interactive Overlays */}
      <CustomCursor />
      <ScrollProgressBar />
      <BackgroundOrbs />

      {/* 1. Frosted Pill Glassmorphic Header */}
      <Navbar 
        onOpenAuth={onOpenAuth} 
      />

      {/* 2. Hero Section: Display typography & damage scanner */}
      <HeroSection onOpenAuth={onOpenAuth} />

      {/* 3. Ticker Ribbon in DM Mono */}
      <TrustStrip />

      {/* 4. Speed & Accuracy Statistics with Count-Up */}
      <ProblemStats />

      {/* 5. Platform pillars (Visual classifier, RTO triggers, Security) */}
      <FeaturesSection />

      {/* 6. Protocol timeline ( Stepper ) */}
      <HowItWorks />

      {/* 7. Connected stack tags */}
      <TechStack />

      {/* 8. Fictional but realistic credibility quotes card grid */}
      <Testimonials />

      {/* 9. Full-bleed Call-to-action */}
      <CTASection onOpenAuth={onOpenAuth} />

      {/* 10. Minimal corporate footer */}
      <Footer onOpenAuth={onOpenAuth} />

      {/* Floating Chatbot Assistant */}
      <FloatingChatbot />

    </motion.div>
  );
}
