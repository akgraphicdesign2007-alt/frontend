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
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';

// Admin Imports
import Login from './admin/Login';
import ForgotPassword from './admin/ForgotPassword';
import ResetPassword from './admin/ResetPassword';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './admin/pages/Dashboard';
import Inbox from './admin/pages/Inbox';
import TestimonialManager from './admin/pages/TestimonialManager';
import ProjectManager from './admin/pages/ProjectManager';
import BlogManager from './admin/pages/BlogManager';
import AboutManager from './admin/pages/AboutManager';
import UserManager from './admin/pages/UserManager';
import SettingsManager from './admin/pages/SettingsManager';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><Navbar /><Home /><ReviewButton /><ScrollToTopButton /><Footer /></>} />
          <Route path="/about" element={<><Navbar /><AboutPage /><ReviewButton /><ScrollToTopButton /><Footer /></>} />
          <Route path="/projects" element={<><Navbar /><ProjectsPage /><ScrollToTopButton /><Footer /></>} />
          <Route path="/projects/:slug" element={<><Navbar /><ProjectDetail /><ScrollToTopButton /><Footer /></>} />
          <Route path="/blog" element={<><Navbar /><BlogPage /><ScrollToTopButton /><Footer /></>} />
          <Route path="/blog/:slug" element={<><Navbar /><BlogDetail /><ScrollToTopButton /><Footer /></>} />
          <Route path="/contact" element={<><Navbar /><ContactPage /><ScrollToTopButton /><Footer /></>} />
          <Route path="/setup" element={<Setup />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/reset-password" element={<ResetPassword />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<ProjectManager />} />
              <Route path="about" element={<AboutManager />} />
              <Route path="blog" element={<BlogManager />} />
              <Route path="users" element={<UserManager />} />
              <Route path="settings" element={<SettingsManager />} />
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
