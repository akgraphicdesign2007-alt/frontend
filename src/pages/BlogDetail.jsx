import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/config';
import './BlogDetail.css';

const BlogDetail = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                // Fetch direct from API using slug
                const res = await api.get(`/blog/${slug}`);
                setPost(res.data.data || res.data);
            } catch (err) {
                console.error(err);
                setError('Post not found');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    if (loading) return (
        <div className="blog-detail-page" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 className="animate-spin" size={40} color="#fff" />
        </div>
    );

    if (error || !post) {
        return (
            <div className="blog-detail-page" style={{ paddingTop: '120px', textAlign: 'center', minHeight: '100vh' }}>
                <div className="container">
                    <h2>{error || 'Post Not Found'}</h2>
                    <Link to="/blog" className="blog-back-link" style={{ justifyContent: 'center' }}>Back to Blog</Link>
                </div>
            </div>
        );
    }

    const bgStyle = post.imageUrl?.startsWith('http') ? `url(${post.imageUrl})` : `url(${post.imageUrl})` || 'none';

    return (
        <article className="blog-detail-page">
            <header className="blog-hero-premium">
                <div className="blog-hero-image" style={{ backgroundImage: bgStyle }}></div>
                <div className="blog-hero-content">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="blog-pub-tag">Latest Publication</span>
                        <h1 className="blog-title-huge">{post.title}</h1>
                        <div className="blog-meta-premium">
                            <span><Calendar size={14} /> {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent'}</span>
                            <span><Clock size={14} /> {post.readTime || '5 Minute Read'}</span>
                        </div>
                    </motion.div>
                </div>
            </header>

            <motion.div
                className="blog-body-premium"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
            >
                <div className="blog-content-rich">
                    {post.content ? (
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    ) : (
                        <p>No textual data provided for this publication.</p>
                    )}
                </div>

                <div style={{ marginTop: '100px', textAlign: 'center' }}>
                    <Link to="/blog" className="btn-main btn-outline-white">
                        <ArrowLeft size={18} /> BACK TO PUBLICATIONS
                    </Link>
                </div>
            </motion.div>
        </article>
    );
};

export default BlogDetail;
