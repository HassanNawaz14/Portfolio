import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import profilePic from '../../assets/ProfilePic.jpeg';
import cvStandard from '../../assets/CV.pdf';
import cvATS from '../../assets/Hassan_CV_ATS.pdf';

const capabilities = [
  { icon: 'fa-code-branch', title: 'Programming', text: 'Python, C++ & Others' },
  { icon: 'fa-database', title: 'Data Science', text: 'Machine Learning & Data Analysis' },
  { icon: 'fa-robot', title: 'AI Engineering', text: 'Neural Networks & Deep Learning' },
  { icon: 'fa-code', title: 'Web Development', text: 'MERN Stack & Next.js' }
];

function Hero() {
  const [showCV, setShowCV] = useState(false);

  return (
    <section id="home" className="hero">
      <div className="container hero-container">
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div className="mhero-avatar">
            <div className="mhero-avatar-glow" />
            <div className="mhero-avatar-ring" />
            <div className="mhero-avatar-frame">
              <img src={profilePic} alt="Hassan Nawaz" />
              <div className="mhero-scan-line" />
            </div>
          </div>
        </motion.div>

        <div className="hero-copy">
          <motion.p
            className="hero-kicker"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Neural Interface Online
          </motion.p>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Hi, I&apos;m <span>Hassan</span> Nawaz
          </motion.h1>

          <motion.h2
            className="hero-subtitle"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Web Developer & Data Scientist
          </motion.h2>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            Data Science enthusiast and Web Developer passionate about turning data into insight and building impactful digital experiences.
          </motion.p>
        </div>

        <motion.div
          className="mhero-chips"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          {capabilities.map((cap, i) => (
            <div key={i} className="mhero-chip">
              <i className={`fa-solid ${cap.icon}`} />
              <div>
                <strong>{cap.title}</strong>
                <span>{cap.text}</span>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="mhero-actions"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        >
          <Link to="/building" className="btn mhero-btn-primary">
            Enter the Research Lab
          </Link>

          <div className="mhero-cv-wrapper">
            <button
              className={`btn mhero-btn-cv ${showCV ? 'mhero-btn-cv-open' : ''}`}
              onClick={() => setShowCV((p) => !p)}
            >
              <span>Download CV</span>
              <i className={`fa-solid ${showCV ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
            </button>

            <AnimatePresence>
              {showCV && (
                <motion.div
                  className="mhero-cv-options"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                >
                  <a href={cvStandard} download="Hassan_Nawaz_CV.pdf" className="mhero-cv-link">
                    <i className="fa-solid fa-file-pdf" />
                    Standard CV
                  </a>
                  <a href={cvATS} download="Hassan_Nawaz_CV_ATS.pdf" className="mhero-cv-link">
                    <i className="fa-solid fa-robot" />
                    ATS Version
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="mhero-scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span>scroll</span>
        <i className="fa-solid fa-chevron-down" />
      </motion.div>
    </section>
  );
}

export default Hero;
