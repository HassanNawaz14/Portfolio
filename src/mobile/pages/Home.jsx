import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Hero from '../components/Hero';
import NavigationStrip from '../components/NavigationStrip';
import SectorHeader from '../components/SectorHeader';
import About from '../components/About';
import Skills from '../components/Skills';
import Experience from '../components/Experience';
import Contact from '../components/Contact';

const Home = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [showDockCompact, setShowDockCompact] = useState(false);
  const navStripRef = useRef(null);

  const { scrollYProgress: morphProgress } = useScroll({
    target: navStripRef,
    offset: ['start start', 'end start']
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
      if (node) observer.observe(node);
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

  return (
    <>
      <SectorHeader morphProgress={smoothMorphProgress} />
      <Hero />
      <About />
      <NavigationStrip containerRef={navStripRef} />
      <Skills />
      <Experience />
      <Contact />

      <nav className={`floating-dock ${showDockCompact ? 'dock-compact' : ''}`}>
        {dockItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`dock-item ${activeSection === item.id ? 'active' : ''}`}
          >
            <i className={`fa-solid ${item.icon}`} />
            <span>{item.label}</span>
            {activeSection === item.id && (
              <div className="active-glow" />
            )}
          </a>
        ))}
      </nav>
    </>
  );
};

export default Home;
