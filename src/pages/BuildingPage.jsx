import CurrentlyBuilding from '../components/CurrentlyBuilding';
import { Link } from 'react-router-dom';

const BuildingPage = () => {
  return (
    <div className="sub-page">
      <nav className="sub-page-nav">
        <Link to="/" className="back-link">
          <i className="fa-solid fa-arrow-left"></i> Back to Core
        </Link>
      </nav>
      <CurrentlyBuilding />
    </div>
  );
};

export default BuildingPage;
