import { motion, useTransform, useMotionTemplate } from 'framer-motion';
import { Link } from 'react-router-dom';

const NavigationStrip = ({ containerRef, morphProgress }) => {
  // Use the shared morphProgress passed from parent
  const scale = useTransform(morphProgress, [0, 0.3], [1, 0.9]);
  const opacity = useTransform(morphProgress, [0, 0.25], [1, 0]);
  const y = useTransform(morphProgress, [0, 0.3], [0, 120]); // Sinking effect
  const blurValue = useTransform(morphProgress, [0, 0.3], [0, 8]);
  
  const filter = useMotionTemplate`blur(${blurValue}px)`;

  const sectors = [
    { id: 'quicksite', title: 'QuickSite', icon: 'fa-rocket', path: '/quicksite', color: '#37d8ff', tag: 'Startup' },
    { id: 'building', title: 'Lab Access', icon: 'fa-hammer', path: '/building', color: '#8a5cff', tag: 'Research' },
    { id: 'projects', title: 'Archives', icon: 'fa-layer-group', path: '/projects', color: '#0070f3', tag: 'Work' },
    { id: 'profiles', title: 'Network', icon: 'fa-globe', path: '/profiles', color: '#f056c4', tag: 'Digital' }
  ];

  return (
    <div id="nav-strip" className="nav-strip-wrapper" ref={containerRef}>
      <motion.div 
        className="nav-strip-container"
        style={{ scale, opacity, y, filter }}
      >
        <div className="nav-strip-content">
          <div className="nav-strip-header">
            <span className="strip-text">Neural Bridging Interface</span>
            <div className="strip-line-group">
              <span className="strip-line" />
              <div className="strip-dot" />
              <span className="strip-line" />
            </div>
          </div>
          
          <div className="nav-portals-new">
            {sectors.map((sector, index) => (
              <motion.div
                key={sector.id}
                className="portal-chip-wrapper"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link to={sector.path} className="portal-chip">
                  <div className="portal-chip-glow" style={{ backgroundColor: sector.color }} />
                  <div className="portal-chip-icon" style={{ color: sector.color }}>
                    <i className={`fa-solid ${sector.icon}`} />
                  </div>
                  <div className="portal-chip-info">
                    <span className="portal-chip-tag" style={{ color: sector.color }}>{sector.tag}</span>
                    <h3 className="portal-chip-title">{sector.title}</h3>
                  </div>
                  <div className="portal-chip-action">
                    <i className="fa-solid fa-chevron-right" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NavigationStrip;
