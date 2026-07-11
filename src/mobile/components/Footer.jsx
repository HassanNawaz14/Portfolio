import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { pathname } = useLocation();

  const socialLinks = [
    { icon: 'fa-github', link: 'https://github.com/HassanNawaz14', label: 'GitHub' },
    { icon: 'fa-linkedin-in', link: 'https://www.linkedin.com/in/hafiz-m-hassan-322331256/', label: 'LinkedIn' },
    { icon: 'fa-kaggle', link: 'https://www.kaggle.com/hassannawaz1423', label: 'Kaggle' },
    { icon: 'fa-instagram', link: 'https://www.instagram.com/hassan.nawaz142003/', label: 'Instagram' }
  ];

  const scrollToSection = (id) => {
    if (pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="footer-premium interesting-footer">
      <div className="footer-top-glow" />
      
      {/* Cinematic Background Elements */}
      <div className="footer-visual-bg" aria-hidden="true">
        <div className="footer-grid-overlay" />
        <div className="footer-glow-core" />
        <div className="footer-particles">
          {[...Array(6)].map((_, i) => (
            <motion.div 
              key={i} 
              className={`footer-particle p-${i}`}
              animate={{ 
                y: [0, -40, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 4 + i, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="container footer-content-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link 
              to="/" 
              className="brand-logo-premium"
              onClick={() => scrollToSection('home')}
            >
              <motion.div whileHover={{ scale: 1.05 }}>
                <div className="logo-glitch-layer">Hassan<span>Nawaz</span></div>
                <div className="logo-main-layer">Hassan<span>Nawaz</span></div>
              </motion.div>
            </Link>
            <p className="brand-desc">
              Architecting the next generation of digital tools. Fusing data intelligence 
              with aesthetic web architecture to build impactful, future-ready experiences.
            </p>
            <div className="social-row">
              {socialLinks.map((social, i) => (
                <motion.a 
                  key={i} 
                  href={social.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="social-icon-wrapper-premium"
                  whileHover={{ 
                    y: -8, 
                    borderColor: 'var(--cyan)',
                    boxShadow: '0 0 25px rgba(55, 216, 255, 0.3)'
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <i className={`fa-brands ${social.icon}`}></i>
                  <span className="social-tooltip-premium">{social.label}</span>
                </motion.a>
              ))}
            </div>
          </div>

          <div className="footer-nav">
            <h4>Command Center</h4>
            <div className="nav-columns">
              <ul>
                <li><Link to="/" onClick={() => scrollToSection('home')}>Home</Link></li>
                <li><Link to="/" onClick={() => scrollToSection('about')}>About</Link></li>
                <li><Link to="/" onClick={() => scrollToSection('skills')}>Skills</Link></li>
                <li><Link to="/quicksite">QuickSite</Link></li>
              </ul>
              <ul>
                <li><Link to="/projects">Projects</Link></li>
                <li><Link to="/" onClick={() => scrollToSection('experience')}>Education</Link></li>
                <li><Link to="/profiles">Profiles</Link></li>
                <li><Link to="/" onClick={() => scrollToSection('contact')}>Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-review">
            <h4>Review My Work</h4>
            <div className="review-box">
              <p>Direct transmission for feedback, inquiries, or galactic collaborations.</p>
              <form className="email-bar" onSubmit={(e) => e.preventDefault()}>
                <input type="email" className="email-input" placeholder="Feedback or Inquiries..." />
                <button className="email-btn">
                  <span>Send</span>
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            <p>&copy; {currentYear} <span className="highlight">Hassan Nawaz</span>. Handcrafted with Precision.</p>
          </div>
          <div className="footer-status">
            <div className="status-indicator">
              <span className="status-dot"></span>
              <span className="status-text">Signal Fading Into Space</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
