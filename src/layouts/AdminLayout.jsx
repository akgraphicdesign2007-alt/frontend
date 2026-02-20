import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Image,
    FileText,
    MessageSquare,
    LogOut,
    Globe,
    Quote,
    User,
    Users,
    Settings,
    Bell
} from 'lucide-react';
import '../admin/AdminStyle.css';

const AdminLayout = () => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const sidebarItems = [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
        { name: 'About Me', path: '/admin/about', icon: <User size={20} /> },
        { name: 'Projects', path: '/admin/projects', icon: <Image size={20} /> },
        { name: 'Blog', path: '/admin/blog', icon: <FileText size={20} /> },
        { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
        { name: 'Site Settings', path: '/admin/settings', icon: <Settings size={20} /> },
        { name: 'Inbox', path: '/admin/inbox', icon: <MessageSquare size={20} /> },
        { name: 'Testimonials', path: '/admin/testimonials', icon: <Quote size={20} /> },
    ];

    // Determine initials for Avatar
    const getInitials = (name) => {
        if (!name) return 'A';
        const parts = name.split(' ');
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        return parts[0][0].toUpperCase();
    }

    return (
        <div className="admin-layout-container">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h2>AK<span>ADMIN</span></h2>
                </div>

                <nav className="admin-sidebar-nav">
                    {sidebarItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            {item.icon} {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <Link to="/" target="_blank" className="admin-footer-link">
                        <Globe size={18} /> View Live Site
                    </Link>
                    <button onClick={logout} className="admin-logout-btn">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="admin-main-content">

                {/* Topbar */}
                <header className="admin-topbar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                        <div style={{ position: 'relative', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}>
                            <Bell size={20} />
                            <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#ff4d4d', borderRadius: '50%' }}></span>
                        </div>
                        <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }}></div>
                        <div className="admin-user-profile">
                            <div className="admin-user-info" style={{ textAlign: 'right' }}>
                                <h4>{user?.name || 'Administrator'}</h4>
                                <span>{user?.role || 'Admin'}</span>
                            </div>
                            <div className="admin-user-avatar">
                                {getInitials(user?.name)}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="admin-page-container">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
