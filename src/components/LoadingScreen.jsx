import Loader from './Loader';
import './LoadingScreen.css';

const LoadingScreen = () => {
    return (
        <div className="loading-screen">
            <Loader />
        </div>
    );
};

export default LoadingScreen;
