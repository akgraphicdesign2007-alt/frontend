import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Projects from '../components/Projects';
import Blog from '../components/Blog';
import Cta from '../components/Cta';
import Testimonials from '../components/Testimonials';

const Home = () => {
    return (
        <main>
            <Hero />
            <About />
            <Services />
            <Projects />
            <Blog limit={3} />
            <Testimonials />
            <Cta />
        </main>
    );
};

export default Home;
