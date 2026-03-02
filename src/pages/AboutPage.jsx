import { motion } from 'framer-motion';
import About from '../components/About';
import ToolsSection from '../components/ToolsSection';

const AboutPage = () => {
    return (
        <main className="about-page-wrapper">
            <section className="page-header-premium">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="section-title">The Mastermind</span>
                        <h1 className="hero-title">Creative <br /> <span className="outline-text">Visionary</span></h1>
                        <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '500px', fontSize: '1.1rem', marginTop: '30px' }}>
                            A multidisciplinary visual artist dedicated to pushing the boundaries of digital identity and cinematic design.
                        </p>
                    </motion.div>
                </div>
            </section>
            <About />
            <ToolsSection />

            <style>{`
                .about-page-wrapper {
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

export default AboutPage;
