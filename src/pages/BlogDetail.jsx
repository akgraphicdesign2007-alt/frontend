import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/config';
import { useSEO } from '../hooks/useSEO';
import './BlogDetail.css';

const SITE_URL = 'https://www.akdesigns.space';

const BlogDetail = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
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

    // ── Dynamic SEO: updates as soon as `post` loads ──────────────
    useSEO({
        title: post?.title || 'Blog Post',
        description: post?.excerpt || 'Read this article on the AK Designs journal — insights on brand design, visual identity, and creative strategy.',
        image: post?.imageUrl || undefined,
        url: `${SITE_URL}/blog/${slug}`,
        type: 'article',
        noIndex: !post && !loading, // noindex if post not found
        jsonLd: post ? {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            image: post.imageUrl,
            datePublished: post.createdAt,
            dateModified: post.updatedAt || post.createdAt,
            author: {
                '@type': 'Person',
                name: post.author || 'AK Designs',
                url: SITE_URL,
            },
            publisher: {
                '@type': 'Organization',
                name: 'AK Designs',
                logo: {
                    '@type': 'ImageObject',
                    url: `${SITE_URL}/logo.png`,
                },
            },
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `${SITE_URL}/blog/${slug}`,
            },
            articleSection: post.category,
            keywords: post.category,
        } : null,
        breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Blog', url: '/blog' },
            { name: post?.title || slug },
        ],
    });

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
                            {post.category && <span>{post.category}</span>}
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
                {/* Excerpt as visible lead paragraph for screen readers & SEO */}
                {post.excerpt && (
                    <p className="blog-excerpt-lead">{post.excerpt}</p>
                )}

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
