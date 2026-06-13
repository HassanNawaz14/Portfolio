import { useRef, useState, useCallback } from 'react';
import { motion, useTransform, useMotionTemplate } from 'framer-motion';
import { Link } from 'react-router-dom';

const sectors = [
  { id: 'quicksite', title: 'QuickSite', icon: 'fa-rocket', path: '/quicksite', color: '#37d8ff', tag: 'Startup', desc: 'Launch instant sites' },
  { id: 'building', title: 'Lab Access', icon: 'fa-hammer', path: '/building', color: '#8a5cff', tag: 'Research', desc: 'Explore experiments' },
  { id: 'projects', title: 'Archives', icon: 'fa-layer-group', path: '/projects', color: '#0070f3', tag: 'Work', desc: 'View case studies' },
  { id: 'profiles', title: 'Network', icon: 'fa-globe', path: '/profiles', color: '#f056c4', tag: 'Digital', desc: 'Connect globally' }
];

function TiltGateway({ children, className }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -y * 10, y: x * 10 });
  }, []);

  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      style={{ perspective: 800, transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
}

const NavigationStrip = ({ containerRef, morphProgress }) => {
  const scale = useTransform(morphProgress, [0, 0.3], [1, 0.92]);
  const opacity = useTransform(morphProgress, [0, 0.25], [1, 0]);
  const y = useTransform(morphProgress, [0, 0.3], [0, 100]);
  const blurValue = useTransform(morphProgress, [0, 0.3], [0, 6]);
  const filter = useMotionTemplate`blur(${blurValue}px)`;

  return (
    <section id="nav-strip" className="gateway-section" ref={containerRef}>
      <motion.div className="gateway-container" style={{ scale, opacity, y, filter }}>
        <div className="gateway-top">
          <div className="gateway-hud">
            <span className="gateway-hud-dot" />
            <span className="gateway-hud-text">SELECT DESTINATION</span>
            <span className="gateway-hud-line" />
          </div>
        </div>

        <div className="gateway-nexus">
          <div className="gateway-nexus-beam" />
          <div className="gateway-nexus-core">
            <div className="gateway-nexus-pulse" />
          </div>
        </div>

        <div className="gateway-cards">
          {sectors.map((sector, i) => (
            <motion.div
              key={sector.id}
              className="gateway-card-wrap"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <TiltGateway className="gateway-card">
                <Link to={sector.path} className="gateway-card-link">
                  <div className="gateway-card-bg" style={{ background: `radial-gradient(ellipse 120% 60% at 50% 0%, ${sector.color}18, transparent 70%)` }} />
                  <div className="gateway-card-bg-hover" style={{ background: `radial-gradient(circle at 50% 50%, ${sector.color}10, transparent 60%)` }} />

                  <div className="gateway-vortex">
                    <span className="gateway-vortex-ring" style={{ borderColor: sector.color }} />
                    <span className="gateway-vortex-ring-two" style={{ borderColor: `${sector.color}60` }} />
                    <span className="gateway-vortex-core" style={{ background: sector.color }} />
                  </div>

                  <div className="gateway-card-icon" style={{ background: `${sector.color}12`, borderColor: `${sector.color}25`, color: sector.color }}>
                    <i className={`fa-solid ${sector.icon}`} />
                  </div>

                  <div className="gateway-card-info">
                    <span className="gateway-card-tag" style={{ color: sector.color }}>{sector.tag}</span>
                    <h3 className="gateway-card-title">{sector.title}</h3>
                    <p className="gateway-card-desc">{sector.desc}</p>
                  </div>

                  <div className="gateway-card-arrow" style={{ color: sector.color }}>
                    <i className="fa-solid fa-arrow-right" />
                  </div>

                  <div className="gateway-card-border" style={{ borderColor: `${sector.color}25` }} />
                  <div className="gateway-card-border-hover" style={{ borderColor: sector.color }} />
                </Link>
              </TiltGateway>
            </motion.div>
          ))}
        </div>

        <div className="gateway-marquee">
          <span>SYSTEMS ONLINE // ALL SECTORS OPERATIONAL // NAVIGATION LOCKED //</span>
        </div>
      </motion.div>
    </section>
  );
};

export default NavigationStrip;
