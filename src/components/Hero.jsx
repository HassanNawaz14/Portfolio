import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import profilePic from '../assets/ProfilePic.jpeg';
import cvStandard from '../assets/CV.pdf';
import cvATS from '../assets/Hassan_CV_ATS.pdf';

const Hero = ({ portraitAnchorRef }) => {
  const [showCVOptions, setShowCVOptions] = useState(false);

  const capabilities = [
    { icon: 'fa-code-branch', title: 'Programming', text: 'Python, C++ & Others' },
    { icon: 'fa-ghost', title: 'Game Development', text: 'C#, C++ & Unity' },
    { icon: 'fa-robot', title: 'AI Development', text: 'Machine Learning' },
    { icon: 'fa-code', title: 'Web Development', text: 'React & Node.js' }
  ];

  return (
    <section id="home" className="hero">
      <div className="container hero-container">
        <motion.div 
          className="hero-copy"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <p className="hero-kicker">Neural Interface Online</p>
          <h1 className="hero-title">Hi, I&apos;m <span>Hassan</span> Nawaz</h1>
          <h2 className="hero-subtitle">Web Developer & Data Scientist</h2>
          <p className="hero-description">
            Data Science enthusiast and Web Developer passionate about turning data into
            insight and building impactful digital experiences. Skilled in coding, problem-solving, and
            exploring emerging technologies.
          </p>
          
          <div className="hero-capabilities-left">
            {capabilities.map((cap, i) => (
              <motion.div 
                key={i} 
                className={`capability-chip-static chip-index-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.15, duration: 0.8 }}
                whileHover={{ y: -5, borderColor: 'var(--cyan)', transition: { type: 'tween', duration: 0.15, ease: 'easeOut' } }}
              >
                <i className={`fa-solid ${cap.icon}`}></i>
                <div className="cap-text">
                  <h3>{cap.title}</h3>
                  <p>{cap.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="hero-visual">
          <motion.div 
            className="hero-portrait-shell"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
          >
            <div className="hero-portrait-frame" ref={portraitAnchorRef}>
              <img src={profilePic} alt="Hassan Nawaz portrait" />
            </div>
            <div className="hero-portrait-outline"></div>
            <div className="hero-portrait-glow"></div>
            
            <div className="hero-actions-overlay">
              <div className="hero-actions-container">
                <div className="hero-actions">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 1 }}
                  >
                    <Link 
                      to="/building" 
                      className="btn"
                    >
                      <motion.span
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Enter the Research Lab
                      </motion.span>
                    </Link>
                  </motion.div>

                  <div className="cv-download-wrapper">
                    <motion.button 
                      className={`btn ${showCVOptions ? 'btn-selected' : 'btn-secondary'}`}
                      onClick={() => setShowCVOptions(!showCVOptions)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.7, duration: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Download CV</span>
                      <i className={`fa-solid ${showCVOptions ? 'fa-chevron-up' : 'fa-chevron-down'} ms-2`}></i>
                    </motion.button>

                    <AnimatePresence>
                      {showCVOptions && (
                        <motion.div 
                          className="cv-fission-container"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: "circOut" }}
                        >
                          <motion.a 
                            href={cvStandard}
                            download="Hassan_Nawaz_CV.pdf"
                            className="btn-mini-fission"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ delay: 0.1 }}
                            whileHover={{ scale: 1.05, x: 5 }}
                          >
                            <i className="fa-solid fa-file-pdf"></i>
                            <span>Standard</span>
                          </motion.a>
                          <motion.a 
                            href={cvATS}
                            download="Hassan_Nawaz_CV_ATS.pdf"
                            className="btn-mini-fission"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ delay: 0.2 }}
                            whileHover={{ scale: 1.05, x: 5 }}
                          >
                            <i className="fa-solid fa-robot"></i>
                            <span>ATS Version</span>
                          </motion.a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="hero-bg-accent"></div>
        </div>
      </div>
      
      <motion.div 
        className="hero-scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span>Scroll</span>
        <div className="mouse-icon">
          <div className="mouse-wheel"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
