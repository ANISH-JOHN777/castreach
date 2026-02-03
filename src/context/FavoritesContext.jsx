import { createContext, useContext, useState, useEffect } from 'react';
import { mockFavorites } from '../mock-data/data';

const FavoritesContext = createContext();

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within FavoritesProvider');
    }
    return context;
};

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(() => {
        // Check localStorage for saved favorites
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : mockFavorites;
    });

    useEffect(() => {
        // Save favorites to localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const addFavorite = (profileId) => {
        setFavorites(prev => {
            if (!prev.includes(profileId)) {
                return [...prev, profileId];
            }
            return prev;
        });
    };

    const removeFavorite = (profileId) => {
        setFavorites(prev => prev.filter(id => id !== profileId));
    };

    const toggleFavorite = (profileId) => {
        if (favorites.includes(profileId)) {
            removeFavorite(profileId);
        } else {
            addFavorite(profileId);
        }
    };

    const isFavorite = (profileId) => {
        return favorites.includes(profileId);
    };

    return (
        <FavoritesContext.Provider value={{
            favorites,
            addFavorite,
            removeFavorite,
            toggleFavorite,
            isFavorite
        }}>
            {children}
        </FavoritesContext.Provider>
    );
};
