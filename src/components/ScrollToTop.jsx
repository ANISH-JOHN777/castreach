import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Automatically scrolls to the top of the page whenever the route changes
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scroll to top with smooth behavior
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant' // Use 'instant' for immediate scroll, 'smooth' for animated
        });
    }, [pathname]); // Trigger whenever the pathname changes

    return null; // This component doesn't render anything
};

export default ScrollToTop;
