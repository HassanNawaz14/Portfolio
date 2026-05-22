import Projects from '../components/Projects';
import { Link } from 'react-router-dom';

const ProjectsPage = () => {
  return (
    <div className="sub-page">
      <nav className="sub-page-nav">
        <Link to="/" className="back-link">
          <i className="fa-solid fa-arrow-left"></i> Back to Core
        </Link>
      </nav>
      <Projects />
    </div>
  );
};

export default ProjectsPage;
