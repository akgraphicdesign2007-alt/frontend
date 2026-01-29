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
                setProjects(res.data.data || res.data); // Handle potential { success: true, data: [] } wrapper
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
                    <h2 className="section-title">Selected Projects</h2>
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
                                transition={{ duration: 0.3 }}
                                key={project._id || project.id}
                                className="project-item"
                            >
                                <Link to={`/projects/${getSlug(project)}`} state={{ project }}>
                                    {/* Pass project data via state to avoid re-fetching or lookup issues if possible, though clean link is priority */}
                                    <div
                                        className="project-image"
                                        style={{ background: project.imageUrl?.startsWith('http') ? `url(${project.imageUrl}) center/cover` : project.imageUrl || '#111' }}
                                    >
                                        <div className="project-overlay">
                                            <h3>{project.title}</h3>
                                            <p>{project.category}</p>
                                            <span className="view-btn">
                                                View Case <ArrowUpRight size={18} />
                                            </span>
                                        </div>
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
