import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import './Hero.css';

const Hero = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section className="hero" ref={ref}>
            <div className="hero-background"></div>
            <div className="hero-overlay"></div>

            <motion.div
                className="container hero-content"
                style={{ y: yText, opacity }}
            >
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="hero-subtitle"
                >
                    Visual & Brand Designer
                </motion.h2>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="hero-title"
                >
                    CRAFTING BOLD <br />
                    <span className="highlight">VISUAL EXPERIENCES</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="hero-description"
                >
                    Specializing in premium brand identities, immersive web design, and digital art that leaves a lasting impression.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="hero-buttons"
                >
                    <a href="#projects" className="btn btn-primary">
                        View Work
                    </a>
                    <a href="/contact" className="btn btn-outline">
                        Contact Me <ArrowRight size={18} />
                    </a>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
