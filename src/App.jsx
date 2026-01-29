import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import ProjectDetail from './pages/ProjectDetail';
import BlogDetail from './pages/BlogDetail';
import Setup from './pages/Setup';
import ReviewButton from './components/ReviewButton';

// Admin Imports
import Login from './admin/Login';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './admin/pages/Dashboard';
import Inbox from './admin/pages/Inbox';
import TestimonialManager from './admin/pages/TestimonialManager';
import ProjectManager from './admin/pages/ProjectManager';
import BlogManager from './admin/pages/BlogManager';
import AboutManager from './admin/pages/AboutManager';
import UserManager from './admin/pages/UserManager';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><Navbar /><Home /><ReviewButton /><Footer /></>} />
          <Route path="/about" element={<><Navbar /><AboutPage /><ReviewButton /><Footer /></>} />
          <Route path="/projects" element={<><Navbar /><ProjectsPage /><Footer /></>} />
          <Route path="/projects/:slug" element={<><Navbar /><ProjectDetail /><Footer /></>} />
          <Route path="/blog" element={<><Navbar /><BlogPage /><Footer /></>} />
          <Route path="/blog/:slug" element={<><Navbar /><BlogDetail /><Footer /></>} />
          <Route path="/contact" element={<><Navbar /><ContactPage /><Footer /></>} />
          <Route path="/setup" element={<Setup />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<ProjectManager />} />
              <Route path="about" element={<AboutManager />} />
              <Route path="blog" element={<BlogManager />} />
              <Route path="users" element={<UserManager />} />
              <Route path="inbox" element={<Inbox />} />
              <Route path="testimonials" element={<TestimonialManager />} />
            </Route>
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
