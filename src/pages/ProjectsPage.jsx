import { motion } from 'framer-motion';
import Projects from '../components/Projects';
import { useSEO } from '../hooks/useSEO';

const ProjectsPage = () => {
    useSEO({
        title: 'Projects — Selected Works & Case Studies',
        description: 'Browse AK Designs\' portfolio — a curated selection of high-end visual identity systems, brand designs, logos, and digital experiences engineered for global brands.',
        url: 'https://www.akdesigns.space/projects',
        breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Projects' },
        ],
    });

    return (
        <main className="projects-page-wrapper">
            <section className="page-header-premium">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="section-title">Case Studies</span>
                        <h1 className="hero-title">Selected <br /> <span className="outline-text">Works</span></h1>
                        <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '500px', fontSize: '1.1rem', marginTop: '30px' }}>
                            A curated selection of high-end visual systems and digital experiences engineered for global brands.
                        </p>
                    </motion.div>
                </div>
            </section>
            <Projects />

            <style>{`
                .projects-page-wrapper {
                    background: #050a07;
                }
                .page-header-premium {
                    padding: 140px 0 60px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }
                @media (max-width: 768px) {
                    .page-header-premium {
                        padding: 110px 0 40px;
                    }
                }
            `}</style>
        </main>
    );
};

export default ProjectsPage;
