import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { getFavorites as getFavoritesAPI, toggleFavorite as toggleFavoriteAPI } from "../services/api";
import { keycloak } from "../services/keycloak";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [favoriteIds, setFavoriteIds] = useState(new Set());

    const loadFavorites = useCallback(async () => {
        console.log("loadFavorites вызван, keycloak.authenticated:", keycloak?.authenticated);
        
        if (!keycloak || !keycloak.authenticated) {
            console.log("Пользователь не авторизован, избранное пустое");
            setFavorites([]);
            setFavoriteIds(new Set());
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            console.log("Загрузка избранного...");
            const data = await getFavoritesAPI();
            console.log("Получены данные избранного:", data);
            console.log("Тип данных:", Array.isArray(data) ? "массив" : typeof data);
            console.log("Количество элементов:", Array.isArray(data) ? data.length : "не массив");
            
            if (Array.isArray(data)) {
                const favoritesWithSaved = data.map(f => ({
                    ...f,
                    isSaved: f.isSaved !== undefined ? f.isSaved : true
                }));
                setFavorites(favoritesWithSaved);
                setFavoriteIds(new Set(favoritesWithSaved.map(f => f.id)));
                console.log("Избранное установлено, количество:", favoritesWithSaved.length);
            } else {
                console.error("Данные не являются массивом:", data);
                console.error("Структура данных:", JSON.stringify(data, null, 2));
                setFavorites([]);
                setFavoriteIds(new Set());
            }
        } catch (error) {
            console.error("Ошибка загрузки избранного:", error);
            console.error("Статус ошибки:", error.response?.status);
            console.error("Детали ошибки:", error.response?.data || error.message);
            console.error("URL запроса:", error.config?.url);
            setFavorites([]);
            setFavoriteIds(new Set());
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleFavorite = useCallback(async (titleId) => {
        if (!keycloak || !keycloak.authenticated) {
            console.log("Пользователь не авторизован, перенаправление на логин");
            if (keycloak) {
                keycloak.login();
            }
            return;
        }

        try {
            console.log("Переключение избранного для titleId:", titleId);
            const result = await toggleFavoriteAPI(titleId);
            console.log("Результат переключения:", result);
            console.log("isSaved после переключения:", result?.isSaved);
            
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
            }
            
            await loadFavorites();
        } catch (error) {
            console.error("Ошибка переключения избранного:", error);
            console.error("Статус ошибки:", error.response?.status);
            console.error("Данные ошибки:", error.response?.data);
            console.error("URL запроса:", error.config?.url);
            console.error("Сообщение ошибки:", error.message);
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
