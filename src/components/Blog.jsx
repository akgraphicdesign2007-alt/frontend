import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/config';
import './Blog.css';

const Blog = ({ limit = 0 }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get('/blog');
                const allPosts = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
                // If limit is passed (e.g. 3 for Homepage), slice it. Otherwise show all.
                setPosts(limit > 0 ? allPosts.slice(0, limit) : allPosts);
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
                <h2 className="section-title">Latest Publication</h2>

                <div className="blog-grid">
                    {posts.map((post, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            key={post._id || index}
                        >
                            <article className="blog-card-premium">
                                <div className="blog-image-wrapper">
                                    <img
                                        src={post.imageUrl}
                                        alt={post.title}
                                        className="blog-image-premium-main"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="blog-card-content">
                                    <div className="blog-meta-premium">
                                        <span className="blog-date-premium">
                                            {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent Publication'}
                                        </span>
                                    </div>
                                    <h3 className="blog-title-premium">{post.title}</h3>
                                    <p className="blog-excerpt-premium">{post.excerpt}</p>
                                    <Link to={`/blog/${post.slug || post.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`} className="read-article-link">
                                        Exploration <ArrowRight size={16} />
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
