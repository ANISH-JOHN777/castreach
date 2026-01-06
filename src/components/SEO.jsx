import { useEffect } from 'react';

const SEO = ({
    title = 'CastReach - Connect. Record. Grow.',
    description = 'The ultimate platform connecting podcast hosts and guests. Discover talent, book appearances, and create amazing content together.',
    keywords = 'podcast, podcasting, podcast guests, podcast hosts, podcast booking, podcast platform, audio content',
    author = 'CastReach',
    ogImage = '/og-image.jpg',
    ogType = 'website',
    twitterCard = 'summary_large_image'
}) => {
    useEffect(() => {
        // Update title
        document.title = title;

        // Update or create meta tags
        const updateMetaTag = (name, content, attribute = 'name') => {
            let element = document.querySelector(`meta[${attribute}="${name}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attribute, name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        // Standard meta tags
        updateMetaTag('description', description);
        updateMetaTag('keywords', keywords);
        updateMetaTag('author', author);

        // Open Graph meta tags
        updateMetaTag('og:title', title, 'property');
        updateMetaTag('og:description', description, 'property');
        updateMetaTag('og:type', ogType, 'property');
        updateMetaTag('og:image', ogImage, 'property');
        updateMetaTag('og:url', window.location.href, 'property');

        // Twitter Card meta tags
        updateMetaTag('twitter:card', twitterCard);
        updateMetaTag('twitter:title', title);
        updateMetaTag('twitter:description', description);
        updateMetaTag('twitter:image', ogImage);

        // Additional SEO tags
        updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
        updateMetaTag('robots', 'index, follow');
        updateMetaTag('language', 'English');

    }, [title, description, keywords, author, ogImage, ogType, twitterCard]);

    return null;
};

export default SEO;
