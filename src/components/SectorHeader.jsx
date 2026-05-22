import { motion, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const SectorHeader = ({ morphProgress }) => {
  const headerOpacity = useTransform(morphProgress, [0, 0.25], [0, 1]);
  const headerY = useTransform(morphProgress, [0, 0.3], [-100, 0]);

  const sectors = [
    { id: 'quicksite', icon: 'fa-rocket', path: '/quicksite', color: '#37d8ff', label: 'QuickSite' },
    { id: 'building', icon: 'fa-hammer', path: '/building', color: '#8a5cff', label: 'Research' },
    { id: 'projects', icon: 'fa-layer-group', path: '/projects', color: '#0070f3', label: 'Archives' },
    { id: 'profiles', icon: 'fa-globe', path: '/profiles', color: '#f056c4', label: 'Network' }
  ];

  return (
    <motion.header 
      className="sector-header"
      style={{ 
        opacity: headerOpacity,
        y: headerY,
        pointerEvents: useTransform(morphProgress, (val) => val > 0.1 ? 'auto' : 'none')
      }}
    >
      <div className="container sector-header-container">
        <Link to="/" className="sector-header-logo">
          H<span>N</span>
        </Link>
        
        <nav className="sector-header-nav">
          {sectors.map((sector) => (
            <Link 
              key={sector.id} 
              to={sector.path} 
              className="sector-header-item"
              style={{ '--hover-color': sector.color }}
            >
              <i className={`fa-solid ${sector.icon}`} />
              <span className="sector-header-label">{sector.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sector-header-status">
          <span className="status-dot-mini" />
          <span className="status-text-mini">Sectors Linked</span>
        </div>
      </div>
    </motion.header>
  );
};

export default SectorHeader;
