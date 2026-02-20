import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2, Calendar, User, Tag } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import api from '../api/config';
import './ProjectDetail.css';

const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
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
                const allProjects = res.data.data || res.data;
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
    const bgStyle = bgImage ? `url(${bgImage}) center/cover` : project.imageUrl || '#111';

    return (
        <article className="project-detail">
            {/* HER0 - uses Framer Motion for Parallax background */}
            <div className="project-hero" style={{ overflow: 'hidden' }}>
                <motion.div
                    style={{
                        position: 'absolute',
                        inset: -50,
                        background: bgStyle,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        y: yHero,
                        opacity: opacityHero
                    }}
                />
                <div className="container hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        <span className="category-tag"><Tag size={12} style={{ display: 'inline', marginRight: '5px' }} /> {project.category}</span>
                        <h1 dangerouslySetInnerHTML={{ __html: project.title.replace(/\n/g, '<br/>') }}></h1>
                    </motion.div>
                </div>
            </div>

            <div className="container project-content-wrapper">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <Link to="/projects" className="back-link">
                        <ArrowLeft size={16} /> Back to Gallery
                    </Link>
                </motion.div>

                <div className="project-grid-layout">
                    {/* Main Left Content */}
                    <motion.div
                        className="main-content"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={fadeUpVariant}>
                            <h3>Project Overview</h3>
                            <p style={{ fontSize: '1.25rem', color: '#fff' }}>{project.description}</p>

                            {project.aboutProject && project.aboutProject !== project.description && (
                                <p style={{ marginTop: '20px' }}>
                                    {project.aboutProject}
                                </p>
                            )}
                        </motion.div>

                        <motion.div className="branding-images-grid" variants={staggerContainer}>
                            {project.brandingImages && project.brandingImages.length > 0 ? (
                                project.brandingImages.map((img, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="branding-image-wrapper"
                                        variants={fadeUpVariant}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                    >
                                        <img
                                            src={img.url}
                                            alt={`${project.title} Visual ${idx + 1}`}
                                            loading="lazy"
                                        />
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div variants={fadeUpVariant} className="placeholder-image">
                                    Visuals coming soon
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>

                    {/* Right Sidebar Meta Data - Sticky */}
                    <motion.aside
                        className="project-meta"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        <div className="meta-item">
                            <h4><User size={14} style={{ display: 'inline', marginRight: '6px', transform: 'translateY(-1px)' }} />Client</h4>
                            <p>{project.client || 'Confidential'}</p>
                        </div>
                        <div className="meta-item">
                            <h4><Calendar size={14} style={{ display: 'inline', marginRight: '6px', transform: 'translateY(-1px)' }} />Delivered</h4>
                            <p>{project.date || (project.createdAt ? new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A')}</p>
                        </div>
                        <div className="meta-item" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                            <h4>Role / Service</h4>
                            <p>{project.category}</p>
                        </div>
                    </motion.aside>
                </div>
            </div>
        </article>
    );
};

export default ProjectDetail;
