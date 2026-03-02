import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/config';
import './Projects.css';

const categories = ['All', 'Branding', 'UI/UX', 'Motion', 'Posters', 'Social Media'];

const Projects = () => {
    const [filter, setFilter] = useState('All');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/gallery');
                const dataList = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
                setProjects(dataList);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to load projects.');
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const getSlug = (project) => {
        // Use existing slug or generate from title
        return project.slug || project.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    };

    const filteredProjects = filter === 'All'
        ? projects
        : projects.filter(p => p.category === filter);

    if (loading) return <div className="loading-container"><Loader2 className="animate-spin" size={40} /></div>;
    if (error) return <div className="error-container">{error}</div>;

    return (
        <section id="projects" className="projects-section">
            <div className="container">
                <div className="projects-header">
                    <div className="title-area">
                        <h2>Selected Projects</h2>
                        <p>A curation of digital excellence and creative problem solving.</p>
                    </div>
                    <div className="categories">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`cat-btn ${filter === cat ? 'active' : ''}`}
                                onClick={() => setFilter(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div layout className="projects-grid">
                    <AnimatePresence>
                        {filteredProjects.map((project) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5 }}
                                key={project._id || project.id}
                                className="project-item"
                            >
                                <Link to={`/projects/${getSlug(project)}`} state={{ project }} className="project-card-link">
                                    <div
                                        className="project-image"
                                        style={{ backgroundImage: project.imageUrl?.startsWith('http') ? `url(${project.imageUrl})` : `url(${project.imageUrl})` || 'none' }}
                                    ></div>
                                    <div className="project-content-overlay">
                                        <span className="project-cat-badge">{project.category}</span>
                                        <h3 className="project-title-premium">{project.title}</h3>
                                        <span className="view-case-btn">
                                            VIEW CASE STUDY <ArrowUpRight size={18} />
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};

export default Projects;
