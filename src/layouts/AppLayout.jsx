import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './AppLayout.css';

const AppLayout = () => {
    return (
        <div className="app-layout">
            <Header />
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default AppLayout;
