import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import api from '../api/config';
import { useSEO } from '../hooks/useSEO';
import './ProjectDetail.css';

const SITE_URL = 'https://www.akdesigns.space';

const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
    }
};

const ProjectDetail = () => {
    const { slug } = useParams();
    const location = useLocation();

    const [project, setProject] = useState(location.state?.project || null);
    const [loading, setLoading] = useState(!location.state?.project);
    const [error, setError] = useState(null);

    const { scrollY } = useScroll();
    const yHero = useTransform(scrollY, [0, 800], [0, 300]);
    const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);

    useEffect(() => {
        if (project) return;

        const fetchProject = async () => {
            setLoading(true);
            try {
                const res = await api.get('/gallery');
                const allProjects = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
                const found = allProjects.find(p => {
                    const pSlug = p.slug || p.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                    return pSlug === slug;
                });

                if (found) {
                    setProject(found);
                } else {
                    setError('Project not found');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load project details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [slug, project]);

    // ── Dynamic SEO: updates when project data loads ──────────────
    useSEO({
        title: project?.title || 'Project',
        description: project?.description
            ? `${project.description.slice(0, 140)}…`
            : `View this ${project?.category || 'design'} project by AK Designs — premium brand identity and visual design.`,
        image: project?.imageUrl || undefined,
        url: `${SITE_URL}/projects/${slug}`,
        type: 'website',
        noIndex: !project && !loading,
        jsonLd: project ? {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: project.title,
            description: project.description,
            image: project.imageUrl,
            dateCreated: project.date || project.createdAt,
            creator: {
                '@type': 'Person',
                name: 'AK Designs',
                url: SITE_URL,
            },
            genre: project.category,
            url: `${SITE_URL}/projects/${slug}`,
        } : null,
        breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Projects', url: '/projects' },
            { name: project?.title || slug },
        ],
    });

    if (loading) return <div className="loading-container"><Loader2 className="animate-spin" size={40} /></div>;

    if (error || !project) {
        return (
            <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: 'var(--text-primary)' }}>{error || 'Project Not Found'}</h2>
                <Link to="/projects" className="back-link" style={{ marginBottom: 0 }}>Back to Projects</Link>
            </div>
        );
    }

    const bgImage = project.imageUrl?.startsWith('http') ? project.imageUrl : null;
    const bgStyle = bgImage ? `url(${bgImage})` : `url(${project.imageUrl})` || 'none';

    return (
        <article className="project-detail-page">
            <section className="project-hero-premium">
                <motion.div
                    className="hero-visual-bg"
                    style={{
                        backgroundImage: bgStyle,
                        y: yHero,
                        opacity: opacityHero
                    }}
                />
                <div className="container hero-main-content">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="project-tag-premium">{project.category}</span>
                        <h1 className="project-title-large" dangerouslySetInnerHTML={{ __html: project.title.replace(/\n/g, '<br/>') }}></h1>
                    </motion.div>
                </div>

                <motion.div
                    className="project-scroll-cta"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                >
                    <span>Scroll to explore</span>
                    <div className="scroll-line-long"></div>
                </motion.div>
            </section>

            <div className="container">
                <div className="project-info-grid">
                    <motion.div
                        className="project-narrative"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">Concept &amp; Vision</h2>
                        <h2>Defining Global Identities</h2>
                        <p>{project.description}</p>

                        {project.aboutProject && project.aboutProject !== project.description && (
                            <p>{project.aboutProject}</p>
                        )}
                    </motion.div>

                    <motion.aside
                        className="project-meta-box"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="meta-row">
                            <span className="meta-label">Client</span>
                            <div className="meta-value">{project.client || 'Creative Excellence'}</div>
                        </div>
                        <div className="meta-row">
                            <span className="meta-label">Category</span>
                            <div className="meta-value">{project.category}</div>
                        </div>
                        <div className="meta-row">
                            <span className="meta-label">Project Date</span>
                            <div className="meta-value">{project.date || '2025'}</div>
                        </div>
                    </motion.aside>
                </div>

                <div className="showcase-grid">
                    {project.brandingImages && project.brandingImages.length > 0 ? (
                        project.brandingImages.map((img, idx) => (
                            <motion.div
                                key={idx}
                                className="showcase-item"
                                initial={{ opacity: 0, y: 60 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <img
                                    src={img.url}
                                    alt={`${project.title} — visual ${idx + 1}`}
                                    loading="lazy"
                                    width="1200"
                                    height="800"
                                />
                            </motion.div>
                        ))
                    ) : (
                        <div className="placeholder-image">
                            Visual Showcase Incoming
                        </div>
                    )}
                </div>

                <div style={{ textAlign: 'center', marginTop: '100px' }}>
                    <Link to="/projects" className="btn-main btn-outline-white">
                        <ArrowLeft size={18} /> BACK TO MASTER GALLERY
                    </Link>
                </div>
            </div>
        </article>
    );
};

export default ProjectDetail;
