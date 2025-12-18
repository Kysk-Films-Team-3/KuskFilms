import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { getFavorites as getFavoritesAPI, toggleFavorite as toggleFavoriteAPI } from "../services/api";
import { keycloak } from "../services/keycloak";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [favoriteIds, setFavoriteIds] = useState(new Set());

    const loadFavorites = useCallback(async () => {
        if (!keycloak || !keycloak.authenticated) {
            setFavorites([]);
            setFavoriteIds(new Set());
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await getFavoritesAPI();
            
            if (Array.isArray(data)) {
                const favoritesWithSaved = data.map(f => {
                    let rating = f.rating;
                    if (rating && typeof rating === 'object' && rating.scale !== undefined) {
                        rating = parseFloat(rating.toString());
                    } else if (rating !== null && rating !== undefined) {
                        rating = parseFloat(rating) || 0;
                    }
                    
                    return {
                        ...f,
                        rating: rating,
                        isSaved: f.isSaved !== undefined ? f.isSaved : true
                    };
                });
                setFavorites(favoritesWithSaved);
                setFavoriteIds(new Set(favoritesWithSaved.map(f => f.id)));
            } else {
                setFavorites([]);
                setFavoriteIds(new Set());
            }
        } catch (error) {
            console.error("Ошибка загрузки избранного:", error);
            setFavorites([]);
            setFavoriteIds(new Set());
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleFavorite = useCallback(async (titleId) => {
        if (!keycloak || !keycloak.authenticated) {
            if (keycloak) {
                keycloak.login();
            }
            return;
        }

        try {
            const result = await toggleFavoriteAPI(titleId);
            
            if (result && typeof result.isSaved === 'boolean') {
                setFavoriteIds(prev => {
                    const newSet = new Set(prev);
                    if (result.isSaved) {
                        newSet.add(titleId);
                    } else {
                        newSet.delete(titleId);
                    }
                    return newSet;
                });
                
                await loadFavorites();
            }
        } catch (error) {
            console.error("Ошибка переключения избранного:", error);
        }
    }, [loadFavorites]);

    const isFavorite = useCallback((titleId) => {
        return favoriteIds.has(titleId);
    }, [favoriteIds]);

    useEffect(() => {
        loadFavorites();
        
        const onAuthSuccess = () => {
            loadFavorites();
        };
        
        const onAuthLogout = () => {
            setFavorites([]);
            setFavoriteIds(new Set());
        };

        if (keycloak) {
            keycloak.onAuthSuccess = onAuthSuccess;
            keycloak.onAuthLogout = onAuthLogout;
        }

        return () => {
            if (keycloak) {
                keycloak.onAuthSuccess = null;
                keycloak.onAuthLogout = null;
            }
        };
    }, [loadFavorites]);

    return (
        <FavoritesContext.Provider value={{ 
            favorites, 
            toggleFavorite, 
            isFavorite,
            loadFavorites,
            loading 
        }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export const useFavorites = () => useContext(FavoritesContext);

export { FavoritesContext };
