import { useEffect, useState } from 'react';
import { Image, FileText, MessageSquare, Quote } from 'lucide-react';
import api from '../../api/config';

const Dashboard = () => {
    const [stats, setStats] = useState({
        projects: 0,
        blogs: 0,
        messages: 0,
        testimonials: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            // In a real app we'd have a stats endpoint, but here we can just fetch lists
            // Since we have the API setup
            try {
                const [projRes, blogRes, msgRes, testRes] = await Promise.all([
                    api.get('/gallery'),
                    api.get('/blog'),
                    api.get('/contact'),
                    api.get('/testimonials?all=true')
                ]);

                setStats({
                    projects: (projRes.data.data || projRes.data).length,
                    blogs: (blogRes.data.data || blogRes.data).length,
                    messages: (msgRes.data.data || msgRes.data).length,
                    testimonials: (testRes.data.data || testRes.data).length
                });
            } catch (err) {
                console.error('Error fetching stats', err);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { title: 'Total Projects', value: stats.projects, icon: <Image size={24} />, color: '#4a9eff' },
        { title: 'Blog Posts', value: stats.blogs, icon: <FileText size={24} />, color: '#ff6b6b' },
        { title: 'Messages', value: stats.messages, icon: <MessageSquare size={24} />, color: '#51cf66' },
        { title: 'Testimonials', value: stats.testimonials, icon: <Quote size={24} />, color: '#fcc419' },
    ];

    return (
        <div>
            <h1 style={{ color: '#fff', fontFamily: 'Oswald, sans-serif', fontSize: '2rem', marginBottom: '30px' }}>Dashboard Overview</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                {statCards.map((stat, index) => (
                    <div key={index} style={{
                        background: '#151f19',
                        padding: '25px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '10px',
                            background: `${stat.color}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: stat.color
                        }}>
                            {stat.icon}
                        </div>
                        <div>
                            <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '5px' }}>{stat.title}</h3>
                            <p style={{ color: '#fff', fontSize: '1.8rem', fontWeight: '600' }}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '50px' }}>
                <h2 style={{ color: '#fff', marginBottom: '20px' }}>Recent Activity</h2>
                <p style={{ color: 'rgba(255,255,255,0.5)' }}>Admin panel functionality ready. Start by managing your content from the sidebar.</p>
            </div>
        </div>
    );
};

export default Dashboard;
