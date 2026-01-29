import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Image,
    FileText,
    MessageSquare,
    Mail,
    LogOut,
    Globe,
    Quote,
    User,
    Users
} from 'lucide-react';
import '../components/Navbar.css'; // Re-use some styles

const AdminLayout = () => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const sidebarItems = [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
        { name: 'About Me', path: '/admin/about', icon: <User size={20} /> },
        { name: 'Projects', path: '/admin/projects', icon: <Image size={20} /> },
        { name: 'Blog', path: '/admin/blog', icon: <FileText size={20} /> },
        { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
        { name: 'Inbox', path: '/admin/inbox', icon: <MessageSquare size={20} /> },
        { name: 'Testimonials', path: '/admin/testimonials', icon: <Quote size={20} /> },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                backgroundColor: '#050a07',
                borderRight: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 100
            }}>
                <div style={{ padding: '30px' }}>
                    <h2 style={{ color: '#fff', fontSize: '1.2rem', fontFamily: 'Oswald, sans-serif' }}>AK ADMIN</h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '5px' }}>Logged in as {user?.name}</p>
                </div>

                <nav style={{ flex: 1, padding: '0 15px' }}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {sidebarItems.map(item => (
                            <li key={item.path} style={{ marginBottom: '5px' }}>
                                <Link
                                    to={item.path}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 15px',
                                        borderRadius: '8px',
                                        color: location.pathname === item.path ? '#050a07' : 'rgba(255,255,255,0.7)',
                                        backgroundColor: location.pathname === item.path ? '#E6EA1A' : 'transparent',
                                        textDecoration: 'none',
                                        fontSize: '0.95rem',
                                        fontWeight: 500,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {item.icon} {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Link to="/" target="_blank" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: 'rgba(255,255,255,0.6)',
                        textDecoration: 'none',
                        marginBottom: '15px',
                        fontSize: '0.9rem'
                    }}>
                        <Globe size={18} /> View Site
                    </Link>
                    <button
                        onClick={logout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: 'transparent',
                            border: 'none',
                            color: '#ff4d4d',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            padding: 0
                        }}
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '40px', marginLeft: '260px', overflowY: 'auto' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
