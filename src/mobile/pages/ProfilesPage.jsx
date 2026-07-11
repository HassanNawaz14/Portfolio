import Profiles from '../components/Profiles';
import { Link } from 'react-router-dom';

const ProfilesPage = () => {
  return (
    <div className="sub-page">
      <nav className="sub-page-nav">
        <Link to="/" className="back-link">
          <i className="fa-solid fa-arrow-left"></i> Back to Core
        </Link>
      </nav>
      <Profiles />
    </div>
  );
};

export default ProfilesPage;
