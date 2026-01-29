import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import api from '../api/config';
import './ProjectDetail.css';

const ProjectDetail = () => {
    const { slug } = useParams();
    const location = useLocation();
    // Prefer data passed via state, otherwise null (will fetch)
    const [project, setProject] = useState(location.state?.project || null);
    const [loading, setLoading] = useState(!location.state?.project);
    const [error, setError] = useState(null);

    useEffect(() => {
        // If we already have the project from state, no need to fetch
        if (project) return;

        const fetchProject = async () => {
            setLoading(true);
            try {
                // Try fetching all galleries and finding the one with matching slug
                // Note: Ideally the backend has an endpoint for this, but for now we search client-side if needed
                // OR we assume slug might be passed differently. 
                // Since our backend doesn't native support slugs on Gallery, we likely need to fetch all and find.
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
            <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
                <h2>{error || 'Project Not Found'}</h2>
                <Link to="/projects" className="back-link">Back to Projects</Link>
            </div>
        );
    }

    // Determine background style
    const bgStyle = project.imageUrl?.startsWith('http') ? `url(${project.imageUrl}) center/cover` : project.imageUrl || '#111';

    return (
        <article className="project-detail">
            <div className="project-hero" style={{ background: bgStyle }}>
                <div className="container">
                    <h1>{project.title}</h1>
                    <span className="category-tag">{project.category}</span>
                </div>
            </div>

            <div className="container project-content-wrapper">
                <Link to="/projects" className="back-link">
                    <ArrowLeft size={16} /> All Projects
                </Link>

                <div className="project-grid-layout">
                    <div className="main-content">
                        <h3>About the Project</h3>
                        <p>{project.description}</p>

                        {/* Render extra content if available mostly placeholder logic for now */}
                        <div className="placeholder-image">Project Visuals</div>
                    </div>

                    <aside className="project-meta">
                        <div className="meta-item">
                            <h4>Client</h4>
                            <p>{project.client || 'Confidential'}</p>
                        </div>
                        <div className="meta-item">
                            <h4>Date</h4>
                            <p>{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    </aside>
                </div>
            </div>
        </article>
    );
};

export default ProjectDetail;
