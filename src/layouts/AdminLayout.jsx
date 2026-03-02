import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, Image, FileText, Users, Settings, MessageSquare, Quote, Globe, LogOut, Menu, X, Cloud } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
        { name: 'Hero Management', path: '/admin/hero', icon: <Image size={20} /> },
        { name: 'About Management', path: '/admin/about', icon: <User size={20} /> },
        { name: 'Project Management', path: '/admin/projects', icon: <Image size={20} /> },
        { name: 'Blog Management', path: '/admin/blog', icon: <FileText size={20} /> },
        { name: 'User Management', path: '/admin/users', icon: <Users size={20} /> },
        { name: 'Site Settings', path: '/admin/settings', icon: <Settings size={20} /> },
        { name: 'Inbox', path: '/admin/inbox', icon: <MessageSquare size={20} /> },
        { name: 'Testimonials', path: '/admin/testimonials', icon: <Quote size={20} /> },
        { name: 'Cloud Storage', path: '/admin/media', icon: <Cloud size={20} /> },
    ];

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="admin-container">
            {/* Mobile overlay — closes sidebar when tapped */}
            {isMobileOpen && (
                <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)} />
            )}

            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'} ${isMobileOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <h2>AK<span>ADMIN</span></h2>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="toggle-btn">
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
                <nav className="sidebar-nav">
                    {menuItems.map((item) => {
                        // For the root dashboard path, match exactly. Otherwise, check if path starts with it (for nested routes like /admin/hero)
                        const isActive = item.path === '/admin'
                            ? location.pathname === '/admin'
                            : location.pathname.startsWith(item.path);

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`nav-item ${isActive ? 'active' : ''}`}
                                onClick={() => setIsMobileOpen(false)}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="admin-content">
                <header className="admin-header">
                    <div className="header-left">
                        {/* Mobile hamburger — shown only on small screens */}
                        <button
                            onClick={() => setIsMobileOpen(!isMobileOpen)}
                            className="mobile-menu-btn"
                            aria-label="Toggle sidebar"
                        >
                            <Menu size={22} />
                        </button>
                        <Link to="/" target="_blank" className="view-site-premium">
                            <Globe size={18} /> <span>Live Preview</span>
                        </Link>
                    </div>
                    <div className="header-right">
                        <div className="glass-divider"></div>
                        <div className="user-profile-premium">
                            <div className="user-info-text">
                                <strong>{user?.name}</strong>
                                <span>{user?.role}</span>
                            </div>
                            <div className="avatar-circle-glow">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>
                <div className="admin-page-content">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
