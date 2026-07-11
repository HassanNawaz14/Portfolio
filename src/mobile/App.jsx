import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import QuickSitePage from './pages/QuickSitePage';
import BuildingPage from './pages/BuildingPage';
import ProjectsPage from './pages/ProjectsPage';
import ProfilesPage from './pages/ProfilesPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quicksite" element={<QuickSitePage />} />
          <Route path="/building" element={<BuildingPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/profiles" element={<ProfilesPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
