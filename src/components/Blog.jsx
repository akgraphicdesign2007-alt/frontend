import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/config';
import './Blog.css';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get('/blog');
                // Assuming API returns { data: [...] } or just [...]
                // Limit to 3 recent posts for the home section
                const allPosts = res.data.data || res.data;
                setPosts(allPosts.slice(0, 3));
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to load blog posts.');
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return (
        <section id="blog" className="blog-section">
            <div className="container">
                <div className="loading-container"><Loader2 className="animate-spin" size={40} /></div>
            </div>
        </section>
    );

    if (error) return null; // Hide section if error or no posts?

    return (
        <section id="blog" className="blog-section">
            <div className="container">
                <h2 className="section-title">Latest Insights</h2>

                <div className="blog-grid">
                    {posts.map((post, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            key={post._id || index}
                        >
                            <article className="blog-card">
                                <div
                                    className="blog-image"
                                    style={{ background: post.image?.startsWith('http') ? `url(${post.image}) center/cover` : post.image || '#222' }}
                                ></div>
                                <div className="blog-content">
                                    <span className="blog-date">
                                        <Calendar size={14} style={{ marginRight: '5px', verticalAlign: 'text-bottom' }} />
                                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recent'}
                                    </span>
                                    <h3 className="blog-title">{post.title}</h3>
                                    <p className="blog-excerpt">{post.excerpt}</p>
                                    <Link to={`/blog/${post.slug || post.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`} className="read-more">
                                        Read Article <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </article>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Blog;
