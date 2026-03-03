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
import ReviewButton from './components/ReviewButton';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';

// Admin Panel Components
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/admin/Login';
import ForgotPassword from './pages/admin/ForgotPassword';
import ProjectManager from './pages/admin/ProjectManager';
import UserManager from './pages/admin/UserManager';
import Inbox from './pages/admin/Inbox';
import SettingsManager from './pages/admin/SettingsManager';
import HeroManager from './pages/admin/HeroManager';
import AboutManager from './pages/admin/AboutManager';
import BlogManager from './pages/admin/BlogManager';
import TestimonialManager from './pages/admin/TestimonialManager';
import Dashboard from './pages/admin/Dashboard';
import AcceptInvite from './pages/admin/AcceptInvite';
import MediaManager from './pages/admin/MediaManager';

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
          <Route path="/privacy-policy" element={<><Navbar /><PrivacyPolicy /><ScrollToTopButton /><Footer /></>} />
          <Route path="/terms-of-service" element={<><Navbar /><TermsOfService /><ScrollToTopButton /><Footer /></>} />
          <Route path="*" element={<NotFound />} />

          {/* Admin Panel Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/accept-invite/:token" element={<AcceptInvite />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
            <Route path="/admin/hero" element={<AdminLayout><HeroManager /></AdminLayout>} />
            <Route path="/admin/about" element={<AdminLayout><AboutManager /></AdminLayout>} />
            <Route path="/admin/projects" element={<AdminLayout><ProjectManager /></AdminLayout>} />
            <Route path="/admin/blog" element={<AdminLayout><BlogManager /></AdminLayout>} />
            <Route path="/admin/users" element={<AdminLayout><UserManager /></AdminLayout>} />
            <Route path="/admin/inbox" element={<AdminLayout><Inbox /></AdminLayout>} />
            <Route path="/admin/settings" element={<AdminLayout><SettingsManager /></AdminLayout>} />
            <Route path="/admin/testimonials" element={<AdminLayout><TestimonialManager /></AdminLayout>} />
            <Route path="/admin/media" element={<AdminLayout><MediaManager /></AdminLayout>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
