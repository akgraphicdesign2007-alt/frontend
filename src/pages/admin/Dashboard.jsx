import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Image as ImageIcon, FileText, MessageSquare, Quote, ArrowUpRight, Clock, Shield, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/config';

const Dashboard = () => {
    const [stats, setStats] = useState({
        projects: 0, blogs: 0, users: 0, messages: 0, testimonials: 0
    });
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [projects, blogs, users, contacts, testis] = await Promise.all([
                api.get('/gallery'), api.get('/blog'), api.get('/auth/users'), api.get('/contact'), api.get('/testimonial')
            ]);
            const projData = projects.data.data;
            const blogData = blogs.data.data;
            const userData = users.data.data;
            const contactData = contacts.data.data;
            const testiData = testis.data.data;

            setStats({
                projects: projData.length,
                blogs: blogData.length,
                users: userData.length,
                messages: contactData.length,
                testimonials: testiData.length
            });

            const allActivities = [
                ...projData.map(p => ({ type: 'project', message: `Deployed new project: "${p.title}"`, date: new Date(p.createdAt) })),
                ...blogData.map(b => ({ type: 'blog', message: `Published article: "${b.title}"`, date: new Date(b.createdAt) })),
                ...userData.map(u => ({ type: 'user', message: `System user provisioned: "${u.name}"`, date: new Date(u.createdAt) })),
                ...contactData.map(c => ({ type: 'contact', message: `Incoming message sequence from: "${c.name}"`, date: new Date(c.createdAt) })),
                ...testiData.map(t => ({ type: 'testimonial', message: `New testimonial from: "${t.name}"`, date: new Date(t.createdAt) }))
            ];

            allActivities.sort((a, b) => b.date - a.date);
            setActivities(allActivities.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard stats');
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { name: 'Projects', count: stats.projects, icon: <ImageIcon size={22} />, color: '#fbbf24', link: '/admin/projects' },
        { name: 'Articles', count: stats.blogs, icon: <FileText size={22} />, color: '#38bdf8', link: '/admin/blog' },
        { name: 'Inbox', count: stats.messages, icon: <MessageSquare size={22} />, color: '#f472b6', link: '/admin/inbox' },
        { name: 'Reviews', count: stats.testimonials, icon: <Quote size={22} />, color: '#a78bfa', link: '/admin/testimonials' },
    ];

    if (loading) return <div className="loader-box"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="dashboard-container">
            <header className="page-header">
                <div>
                    <h1>System Overview</h1>
                </div>
                <div className="server-status">
                    <span className="pulse"></span>
                    System Live
                </div>
            </header>

            <div className="stats-grid">
                {statCards.map((stat) => (
                    <Link key={stat.name} to={stat.link} className="stat-card card">
                        <div className="stat-content">
                            <span className="stat-name">{stat.name}</span>
                            <h2 className="stat-number">{stat.count}</h2>
                        </div>
                        <div className="stat-icon-wrapper" style={{ background: `${stat.color}15`, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <ArrowUpRight className="stat-arrow" size={16} />
                    </Link>
                ))}
            </div>

            <div className="dashboard-secondary-grid">
                <div className="card activity-card">
                    <div className="card-header">
                        <Clock size={18} />
                        <h3>Recent Activity</h3>
                    </div>
                    <div className="activity-timeline">
                        {activities.length > 0 ? activities.map((act, i) => {
                            const timeAgo = (date) => {
                                const seconds = Math.floor((new Date() - date) / 1000);
                                let interval = seconds / 86400;
                                if (interval > 1) return Math.floor(interval) + " days ago";
                                interval = seconds / 3600;
                                if (interval > 1) return Math.floor(interval) + " hours ago";
                                interval = seconds / 60;
                                if (interval > 1) return Math.floor(interval) + " minutes ago";
                                return Math.floor(seconds) + " seconds ago";
                            };

                            return (
                                <div key={i} className="timeline-item">
                                    <div className="timeline-marker"></div>
                                    <div className="timeline-content">
                                        <p>{act.message}</p>
                                        <span>{timeAgo(act.date)}</span>
                                    </div>
                                </div>
                            );
                        }) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No recent system activity.</p>
                        )}
                    </div>
                </div>

                <div className="card performance-card">
                    <div className="card-header">
                        <Shield style={{ color: '#4ade80' }} size={18} />
                        <h3>Core Services</h3>
                    </div>
                    <div className="status-list">
                        {['Backend API', 'MongoDB', 'Cloudinary'].map(service => (
                            <div key={service} className="status-row">
                                <span>{service}</span>
                                <span className="status-tag">Connected</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
                .page-header h1 { font-size: 2.2rem; margin: 0; }
                .page-header p { color: var(--text-muted); margin: 5px 0 0 0; }
                .server-status { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; color: #4ade80; background: rgba(74, 222, 128, 0.1); padding: 8px 16px; border-radius: 50px; }
                .pulse { width: 8px; height: 8px; background: #4ade80; border-radius: 50%; box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); animation: pulse 1.5s infinite; }
                @keyframes pulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(74, 222, 128, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); } }

                .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 24px; margin-bottom: 30px; }
                .stat-card { display: flex; align-items: center; justify-content: space-between; text-decoration: none; transition: transform 0.2s; position: relative; }
                .stat-card:hover { transform: translateY(-4px); }
                .stat-name { color: var(--text-muted); font-size: 0.85rem; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; }
                .stat-number { font-size: 2.5rem; margin: 5px 0 0 0; font-family: 'Oswald'; }
                .stat-icon-wrapper { width: 54px; height: 54px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
                .stat-arrow { position: absolute; top: 15px; right: 15px; opacity: 0.2; }

                .dashboard-secondary-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px; }
                .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; border-bottom: 1px solid var(--border); padding-bottom: 15px; }
                .card-header h3 { margin: 0; font-size: 1.1rem; }
                
                .activity-timeline { display: flex; flex-direction: column; gap: 24px; }
                .timeline-item { display: flex; gap: 16px; position: relative; }
                .timeline-marker { width: 10px; height: 10px; background: var(--primary); border-radius: 50%; margin-top: 6px; flex-shrink: 0; position: relative; z-index: 2; }
                .timeline-item:not(:last-child)::after { content: ''; position: absolute; left: 4.5px; top: 16px; bottom: -20px; width: 1px; background: var(--border); }
                .timeline-content p { margin: 0; font-size: 0.95rem; }
                .timeline-content span { font-size: 0.8rem; color: var(--text-muted); }

                .status-list { display: flex; flex-direction: column; gap: 16px; }
                .status-row { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: rgba(255,255,255,0.02); border-radius: 12px; }
                .status-tag { font-size: 0.75rem; font-weight: 700; color: #4ade80; background: rgba(74, 222, 128, 0.1); padding: 4px 10px; border-radius: 50px; }
                .loader-box { height: 400px; display: flex; align-items: center; justify-content: center; }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default Dashboard;
