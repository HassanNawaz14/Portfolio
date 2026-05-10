import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import profilePic from '../assets/ProfilePic.jpeg';

const About = ({ portraitAnchorRef }) => {
  const [activeTab, setActiveTab] = useState('background');

  const tabs = [
    { id: 'background', label: 'Background', icon: 'fa-user-tie' },
    { id: 'aspiration', label: 'Aspiration', icon: 'fa-rocket' },
    { id: 'tools', label: 'Tech Stack', icon: 'fa-layer-group' }
  ];

  const skillPills = [
    { name: 'Python', color: '#3776AB' },
    { name: 'JavaScript', color: '#F7DF1E' },
    { name: 'React', color: '#61DAFB' },
    { name: 'Node.js', color: '#339933' },
    { name: 'C & C++', color: '#00599C' },
    { name: 'SkLearn', color: '#F7931E' },
    { name: 'Pandas', color: '#150458' },
    { name: 'Game Dev', color: '#E34F26' },
    { name: 'MERN Stack', color: '#47A248' },
    { name: 'DSA & OOP', color: '#8A5CFF' }
  ];

  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Beyond the <span>Code</span></h2>
          <p className="section-subtitle">Decoding my journey as a developer and scientist.</p>
        </div>
        
        <div className="about-grid">
          <div className="about-visual">
            <div ref={portraitAnchorRef} className="about-image-anchor">
              <div className="anchor-glow" />
              <img src={profilePic} alt="Hassan Nawaz" />
              <div className="anchor-border" />
            </div>
            <div className="about-experience-badge">
              <span className="years">02+</span>
              <span className="text">Years of Evolution</span>
            </div>
          </div>

          <div className="about-content">
            <div className="about-kicker-wrapper">
              <span className="kicker-label">Current Node:</span>
              <h1 className="typing">Data Scientist & Web Architect</h1>
            </div>
            
            <div className="about-glass-panel">
              <div className="about-tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`about-tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <i className={`fa-solid ${tab.icon}`}></i>
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                      <motion.div layoutId="aboutTabActive" className="active-tab-indicator" />
                    )}
                  </button>
                ))}
              </div>

              <div className="about-tab-body">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {activeTab === 'background' && (
                      <div className="tab-content">
                        <h3>Innovative Problem Solver</h3>
                        <p>
                          I am a dedicated Data Science student at **FAST NUCES**, where I’ve built a strong foundation in coding, algorithms, and analytical reasoning. My journey is driven by the thrill of transforming complex data into clear, actionable insights through statistics and machine learning.
                        </p>
                        <p>
                          I specialize in data-driven storytelling, leveraging tools like SkLearn and Pandas to uncover patterns that others might miss. My academic background has nurtured a rigorous approach to academic excellence and critical thinking.
                        </p>
                      </div>
                    )}

                    {activeTab === 'aspiration' && (
                      <div className="tab-content">
                        <h3>Future-Forward Vision</h3>
                        <p>
                          My focus is set on the horizon of artificial intelligence. I actively explore deep learning and AI applications, constantly pushing the boundaries of what's possible in the digital realm.
                        </p>
                        <p>
                          Equally passionate about the web, I strive to design and build user-friendly applications that don't just work—they feel alive. I believe in the fusion of data intelligence and aesthetic web architecture to create the next generation of digital tools.
                        </p>
                      </div>
                    )}

                    {activeTab === 'tools' && (
                      <div className="tab-content">
                        <h3>Command Center</h3>
                        <p>A curated selection of the core technologies that power my daily creative and analytical output.</p>
                        <div className="premium-skill-grid">
                          {skillPills.map((skill, index) => (
                            <motion.div 
                              key={skill.name} 
                              className="skill-pill-modern"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ y: -3, backgroundColor: 'rgba(138, 92, 255, 0.15)' }}
                            >
                              <div className="skill-dot" style={{ backgroundColor: skill.color }} />
                              <span>{skill.name}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
