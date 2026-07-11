import Startup from '../components/Startup';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const QuickSitePage = () => {
  return (
    <div className="sub-page">
      <nav className="sub-page-nav">
        <Link to="/" className="back-link">
          <i className="fa-solid fa-arrow-left"></i> Back to Core
        </Link>
      </nav>
      <Startup />
    </div>
  );
};

export default QuickSitePage;
