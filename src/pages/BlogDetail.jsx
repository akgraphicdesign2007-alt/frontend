import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Loader2 } from 'lucide-react';
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

    return (
        <article className="blog-detail-page">
            <div className="blog-hero" style={{ background: post.image?.startsWith('http') ? `url(${post.image}) center/cover` : post.image || '#222' }}>
                <div className="blog-hero-overlay"></div>
                <div className="container blog-hero-content">
                    <Link to="/blog" className="blog-back-link">
                        <ArrowLeft size={16} /> Back to Blog
                    </Link>
                    <h1>{post.title}</h1>
                    <div className="blog-meta">
                        <span><Calendar size={14} /> {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Date'}</span>
                        <span><Clock size={14} /> {post.readTime || '5 min read'}</span>
                    </div>
                </div>
            </div>

            <div className="container blog-body">
                {/* 
                  Assuming content is plain text or HTML. 
                  If HTML, use dangerouslySetInnerHTML safely (sanitize in prod). 
                  For now, displaying as text or mapping logic if needed.
                */}
                <div className="post-content">
                    {post.content ? (
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    ) : (
                        <p>No content available.</p>
                    )}
                </div>
            </div>
        </article>
    );
};

export default BlogDetail;
