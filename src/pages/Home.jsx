import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Projects from '../components/Projects';
import Blog from '../components/Blog';
import Contact from '../components/Contact';
import Testimonials from '../components/Testimonials';

const Home = () => {
    return (
        <main>
            <Hero />
            <About />
            <Services />
            <Projects />
            <Blog />
            <Testimonials />
            <Contact />
        </main>
    );
};

export default Home;
