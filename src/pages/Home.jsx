import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Hero from '../components/Hero';
import NavigationStrip from '../components/NavigationStrip';
import SectorHeader from '../components/SectorHeader';
import About from '../components/About';
import Skills from '../components/Skills';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import profilePic from '../assets/ProfilePic.jpeg';

const Home = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [showDockCompact, setShowDockCompact] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  const heroPortraitRef = useRef(null);
  const aboutPortraitRef = useRef(null);
  const navStripRef = useRef(null);
  
  const [portraitStyle, setPortraitStyle] = useState({ opacity: 1, display: 'block' });

  // Scroll tracking for the Morph transition
  const { scrollYProgress: morphProgress } = useScroll({
    target: navStripRef,
    offset: ["start start", "end start"]
  });

  const smoothMorphProgress = useSpring(morphProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  const sections = useMemo(
    () => ['home', 'about', 'nav-strip', 'skills', 'experience', 'contact'],
    []
  );

  const dockItems = useMemo(
    () => [
      { id: 'home', label: 'Home', icon: 'fa-house' },
      { id: 'about', label: 'About', icon: 'fa-user-astronaut' },
      { id: 'nav-strip', label: 'Sectors', icon: 'fa-compass' },
      { id: 'skills', label: 'Arsenal', icon: 'fa-bolt' },
      { id: 'experience', label: 'Journey', icon: 'fa-graduation-cap' },
      { id: 'contact', label: 'Contact', icon: 'fa-paper-plane' }
    ],
    []
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(media.matches);
    updatePreference();
    media.addEventListener('change', updatePreference);
    return () => media.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.2, rootMargin: '-20% 0px -20% 0px' }
    );

    sections.forEach((id) => {
      const node = document.getElementById(id);
      if (node) {
        observer.observe(node);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    const onScroll = () => {
      setShowDockCompact(window.scrollY > window.innerHeight * 0.35);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const updateSharedPortrait = () => {
      const heroFrame = heroPortraitRef.current;
      const aboutFrame = aboutPortraitRef.current;
      if (!heroFrame || !aboutFrame) return;

      const getPagePos = (el) => {
        const rect = el.getBoundingClientRect();
        return {
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height
        };
      };

      const heroPos = getPagePos(heroFrame);
      const aboutPos = getPagePos(aboutFrame);
      
      const scrollPos = window.scrollY;
      const startTrigger = 0;
      const endTrigger = aboutPos.top - window.innerHeight * 0.1; 
      const totalDistance = Math.max(endTrigger - startTrigger, 500);
      
      const rawProgress = Math.min(Math.max((scrollPos - startTrigger) / totalDistance, 0), 1);
      const progress = reducedMotion ? rawProgress : 
        rawProgress < 0.5 ? 4 * rawProgress ** 3 : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;
      
      const absX = heroPos.left + (aboutPos.left - heroPos.left) * progress;
      const absY = heroPos.top + (aboutPos.top - heroPos.top) * progress;
      const width = heroPos.width + (aboutPos.width - heroPos.width) * progress;
      const height = heroPos.height + (aboutPos.height - heroPos.height) * progress;

      const x = absX - window.scrollX;
      const y = absY - window.scrollY;

      const isTransitioning = rawProgress > 0.02 && rawProgress < 0.98;
      
      setPortraitStyle({
        transform: `translate(${x}px, ${y}px) rotateY(${reducedMotion ? 0 : progress * 360}deg) scale(${reducedMotion ? 1 : 1.05 - 0.05 * progress})`,
        width: `${width}px`,
        height: `${height}px`,
        opacity: rawProgress < 0.99 ? 1 : 0,
        display: rawProgress < 0.99 ? 'block' : 'none',
        zIndex: 2000,
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        transformOrigin: 'center',
        willChange: 'transform, opacity'
      });
      
      const shell = document.querySelector('.app-shell');
      if (shell) {
        if (isTransitioning) shell.classList.add('portrait-transitioning');
        else shell.classList.remove('portrait-transitioning');
      }
    };

    updateSharedPortrait();
    window.addEventListener('scroll', updateSharedPortrait, { passive: true });
    window.addEventListener('resize', updateSharedPortrait);
    
    const timer = setTimeout(updateSharedPortrait, 100);
    
    return () => {
      window.removeEventListener('scroll', updateSharedPortrait);
      window.removeEventListener('resize', updateSharedPortrait);
      clearTimeout(timer);
    };
  }, [reducedMotion]);

  return (
    <>
      <SectorHeader morphProgress={smoothMorphProgress} />
      
      <div className="shared-portrait" style={portraitStyle} aria-hidden="true">
        <img src={profilePic} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 20px rgba(138, 92, 255, 0.3)' }} />
      </div>

      <Hero portraitAnchorRef={heroPortraitRef} />
      <About portraitAnchorRef={aboutPortraitRef} />
      <NavigationStrip containerRef={navStripRef} morphProgress={smoothMorphProgress} />
      <Skills />
      <Experience />
      <Contact />

      <motion.nav 
        className={`floating-dock ${showDockCompact ? 'dock-compact' : ''}`}
        initial={{ y: 100, x: '-50%', opacity: 0 }}
        animate={{ y: 0, x: '-50%', opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8, type: "spring", stiffness: 120 }}
      >
        {dockItems.map((item) => (
          <motion.a 
            key={item.id} 
            href={`#${item.id}`} 
            className={`dock-item ${activeSection === item.id ? 'active' : ''}`}
            whileHover={{ y: -10, scale: 1.25 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className={`fa-solid ${item.icon}`} />
            <span>{item.label}</span>
            {activeSection === item.id && (
              <motion.div 
                layoutId="activeDockGlow"
                className="active-glow"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.a>
        ))}
      </motion.nav>
    </>
  );
};

export default Home;
