import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Image, FileText, MessageSquare, Quote, ArrowRight, Activity, Plus } from 'lucide-react';
import api from '../../api/config';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const Dashboard = () => {
    const [stats, setStats] = useState({
        projects: 0,
        blogs: 0,
        messages: 0,
        testimonials: 0
    });

    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [projRes, blogRes, msgRes, testRes] = await Promise.all([
                    api.get('/gallery'),
                    api.get('/blog'),
                    api.get('/contact'),
                    api.get('/testimonials?all=true')
                ]);

                // Calculate counts
                const projectsData = projRes.data.data || projRes.data;
                const blogsData = blogRes.data.data || blogRes.data;
                const messagesData = msgRes.data.data || msgRes.data;
                const testimonialsData = testRes.data.data || testRes.data;

                setStats({
                    projects: projectsData.length,
                    blogs: blogsData.length,
                    messages: messagesData.length,
                    testimonials: testimonialsData.length
                });

                // Generate Mock Recent Activity based on data
                const activities = [];
                if (projectsData.length > 0) {
                    activities.push({
                        id: 1,
                        title: 'New Project Uploaded',
                        desc: projectsData[0].title,
                        time: 'Recently',
                        icon: <Image size={18} />
                    });
                }
                if (messagesData.length > 0) {
                    activities.push({
                        id: 2,
                        title: 'New Message Received',
                        desc: `From ${messagesData[0].name}`,
                        time: 'Recently',
                        icon: <MessageSquare size={18} />
                    });
                }
                if (testimonialsData.length > 0) {
                    activities.push({
                        id: 3,
                        title: 'Testimonial Added',
                        desc: `By ${testimonialsData[0].name}`,
                        time: 'Recently',
                        icon: <Quote size={18} />
                    });
                }
                setRecentActivity(activities);

            } catch (err) {
                console.error('Error fetching stats', err);
            }
        };

        fetchDashboardData();
    }, []);

    const statCards = [
        { title: 'Total Projects', value: stats.projects, icon: <Image size={24} />, color: '#4a9eff' },
        { title: 'Blog Posts', value: stats.blogs, icon: <FileText size={24} />, color: '#ff6b6b' },
        { title: 'Unread Messages', value: stats.messages, icon: <MessageSquare size={24} />, color: '#51cf66' },
        { title: 'Testimonials', value: stats.testimonials, icon: <Quote size={24} />, color: '#fcc419' },
    ];

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <header className="dashboard-header">
                <h1>Dashboard Overview</h1>
                <p>Welcome back! Here is a summary of your premium portfolio system.</p>
            </header>

            <div className="stat-grid">
                {statCards.map((stat, index) => (
                    <motion.div key={index} variants={itemVariants} className="stat-card">
                        <div className="stat-icon-wrapper" style={{ background: `${stat.color}15`, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="stat-info">
                            <h3>{stat.title}</h3>
                            <p>{stat.value}</p>
                        </div>
                        {/* Decorative background glow */}
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            right: '-20px',
                            width: '100px',
                            height: '100px',
                            background: `radial-gradient(circle, ${stat.color}15 0%, transparent 70%)`,
                            borderRadius: '50%',
                            zIndex: 0,
                            pointerEvents: 'none'
                        }}></div>
                    </motion.div>
                ))}
            </div>

            <div className="dashboard-sections">
                <motion.div variants={itemVariants} className="dashboard-panel">
                    <div className="panel-header">
                        <h2>Recent Activity Log</h2>
                    </div>

                    <div className="recent-activity-list">
                        {recentActivity.length > 0 ? (
                            recentActivity.map(activity => (
                                <div key={activity.id} className="activity-item">
                                    <div className="activity-icon">
                                        {activity.icon}
                                    </div>
                                    <div className="activity-content">
                                        <h4>{activity.title}</h4>
                                        <p>{activity.desc} • {activity.time}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Activity strokeWidth={1} size={40} style={{ marginBottom: '10px', opacity: 0.5 }} />
                                No recent activity found.
                            </div>
                        )}
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="dashboard-panel">
                    <div className="panel-header">
                        <h2>Quick Actions</h2>
                    </div>

                    <div className="quick-actions">
                        <Link to="/admin/projects" className="quick-action-btn">
                            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ background: 'rgba(74, 158, 255, 0.1)', padding: '6px', borderRadius: '6px', color: '#4a9eff' }}><Plus size={16} /></div>
                                Add New Project
                            </span>
                            <ArrowRight size={16} style={{ opacity: 0.5 }} />
                        </Link>

                        <Link to="/admin/blog" className="quick-action-btn">
                            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ background: 'rgba(255, 107, 107, 0.1)', padding: '6px', borderRadius: '6px', color: '#ff6b6b' }}><FileText size={16} /></div>
                                Write Blog Post
                            </span>
                            <ArrowRight size={16} style={{ opacity: 0.5 }} />
                        </Link>

                        <Link to="/admin/settings" className="quick-action-btn">
                            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ background: 'rgba(230, 234, 26, 0.1)', padding: '6px', borderRadius: '6px', color: 'var(--accent-color)' }}><Image size={16} /></div>
                                Update SEO / Meta
                            </span>
                            <ArrowRight size={16} style={{ opacity: 0.5 }} />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
