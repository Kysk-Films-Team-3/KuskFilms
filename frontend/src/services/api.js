import axios from "axios";
import { keycloak } from "./keycloak";
import { API_URL } from "./config";
import {
    fakeSlides,
    fakeCategories,
    fakeContent,
    getPopularFilms,
    getPopularActors,
    getMenuItems,
    getWatchModeItems,
    getStarsActors
} from "./mockdata";

export { fakeSlides, fakeCategories, fakeContent, getPopularFilms, getPopularActors, getMenuItems, getWatchModeItems, getStarsActors };

const baseURL = API_URL || "";
console.log("API Base URL:", baseURL || "не установлен");

export const api = axios.create({
    baseURL: baseURL,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
    if (keycloak.authenticated && keycloak.token) {
        try {
            await keycloak.updateToken(30);
            config.headers.Authorization = `Bearer ${keycloak.token}`;
        } catch (error) {
            console.error('Failed to refresh token. Initiating Keycloak logout.', error);
            keycloak.logout();
            return Promise.reject('Token refresh failed, logging out.');
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const getHomeContent = async () => {
    try {
        const response = await api.get('/api/public/titles');
        const titles = response.data;
        const mappedContent = [
            {
                category: "Главная",
                subcategories: [
                    {
                        id: 'new-series',
                        title: 'Новинки KyskFilms',
                        films: titles.map(t => ({
                            id: t.id,
                            title: t.title,
                            image: t.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster',
                            hoverImage: t.posterUrl || 'https://via.placeholder.com/300x450?text=Watch',
                            rating: t.rating || 0,
                            linedate: t.releaseDate ? t.releaseDate.substring(0, 4) : "2025",
                            line1: t.genres ? t.genres.join(", ") : "Кино",
                            line2: "Дивитися зараз",
                            season: t.type === 'SERIES' ? "1 Сезон" : ""
                        }))
                    }
                ]
            }
        ];
        return mappedContent;
    } catch (error) {
        console.error("Помилка завантаження контенту:", error);
        return [];
    }
};

export const getHomePageData = async () => {
    try {
        const baseURL = api.defaults.baseURL || '';
        let url = '/api/public/home';

        if (baseURL.endsWith('/api') || baseURL.match(/\/api\/?$/)) {
            url = '/public/home';
        }

        console.log("Base URL:", baseURL);
        console.log("Используемый путь:", url);
        console.log("Полный URL будет:", baseURL + url);

        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Помилка завантаження даних головної сторінки:", error);
        console.error("URL запроса:", error.config?.url);
        console.error("Base URL:", api.defaults.baseURL);
        throw error;
    }
};

export const transformCarouselItems = (carouselItems) => {
    if (!carouselItems || !Array.isArray(carouselItems)) {
        return [];
    }

    return carouselItems.map((item, index) => {
        const className = `home_slide${(index % 4) + 1}`;
        const link = `/movie/${item.id}`;

        let rating = null;
        if (item.rating !== null && item.rating !== undefined) {
            const ratingNum = typeof item.rating === 'string' ? parseFloat(item.rating) : Number(item.rating);
            if (!isNaN(ratingNum)) {
                rating = ratingNum.toFixed(1);
            }
        }

        return {
            id: item.id,
            className: className,
            link: link,
            title: item.title || '',
            isNew: Boolean(item.isNew),
            genre: item.genre || '',
            duration: item.duration || '',
            imageUrl: item.imageUrl || '',
            rating: rating,
            year: item.year || null
        };
    });
};

export const transformCategories = (categories) => {
    if (!categories || !Array.isArray(categories)) {
        return [];
    }

    return categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        icon: cat.iconUrl,
        activeIcon: cat.iconUrl,
        slug: cat.slug
    }));
};

export const transformSections = (sections) => {
    if (!sections || !Array.isArray(sections)) {
        return [];
    }

    return sections.map(section => ({
        id: section.categoryId,
        title: section.title,
        films: section.items.map(item => {
            let rating = null;
            if (item.rating !== null && item.rating !== undefined) {
                const ratingNum = typeof item.rating === 'string' ? parseFloat(item.rating) : Number(item.rating);
                if (!isNaN(ratingNum)) {
                    rating = ratingNum.toFixed(1);
                }
            }

            return {
                id: item.id,
                title: item.title,
                image: item.posterUrl || '',
                hoverImage: item.posterUrl || '',
                rating: rating,
                linedate: item.year ? String(item.year) : '',
                line1: item.genre || '',
                line2: item.country || '',
                season: item.seasonsCount ? `${item.seasonsCount} сезон${item.seasonsCount > 1 ? 'ів' : ''}` : '',
                isSaved: item.isSaved || false
            };
        })
    }));
};

export const transformCelebrities = (celebrities) => {
    if (!celebrities || !Array.isArray(celebrities)) {
        return [];
    }

    return celebrities.map((celeb, index) => ({
        id: celeb.actorId || celeb.collectionId,
        collectionId: celeb.collectionId,
        actorId: celeb.actorId,
        actorName: celeb.actorName,
        actorImageUrl: celeb.actorImageUrl,
        badgeText: celeb.badgeText,
        description: celeb.description,
        nameKey: celeb.actorName,
        className: `home_stars_actor_${index + 1}`
    }));
};

export const transformPromo = (promo) => {
    if (!promo) {
        return null;
    }

    let rating = null;
    if (promo.rating !== null && promo.rating !== undefined) {
        const ratingNum = typeof promo.rating === 'string' ? parseFloat(promo.rating) : Number(promo.rating);
        if (!isNaN(ratingNum)) {
            rating = ratingNum.toFixed(1);
        }
    }

    return {
        id: promo.id,
        imageUrl: promo.imageUrl,
        badgeText: promo.badgeText || '',
        title: promo.title,
        rating: rating,
        year: promo.year,
        genre: promo.genre,
        duration: promo.duration,
        description: promo.description,
        buttonText: promo.buttonText,
        isSaved: promo.isSaved || false
    };
};

export const fetchTitles = async (params = {}) => {
    const baseURL = api.defaults.baseURL || '';
    const {
        page = 0,
        size = 20,
        genre = null,
        year = null,
        ratingFrom = null,
        sort = null,
        search = null
    } = params;

    let url = `/api/public/titles?page=${page}&size=${size}`;

    if (baseURL.endsWith('/api') || baseURL.match(/\/api\/?$/)) {
        url = `/public/titles?page=${page}&size=${size}`;
    }

    if (genre) url += `&genre=${encodeURIComponent(genre)}`;
    if (year) url += `&year=${year}`;
    if (ratingFrom !== null) url += `&ratingFrom=${ratingFrom}`;
    if (sort) url += `&sort=${encodeURIComponent(sort)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const response = await api.get(url);
    return response.data;
};

export const fetchTitleById = async (id) => {
    try {
        const baseURL = api.defaults.baseURL || '';
        let url = `/api/public/titles/${id}`;

        if (baseURL.endsWith('/api') || baseURL.match(/\/api\/?$/)) {
            url = `/public/titles/${id}`;
        }

        console.log("Загрузка фильма ID:", id);
        console.log("Base URL:", baseURL);
        console.log("Используемый путь:", url);
        console.log("Полный URL будет:", baseURL + url);

        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Ошибка загрузки фильма:", error);
        console.error("URL запроса:", error.config?.url);
        console.error("Base URL:", api.defaults.baseURL);
        console.error("Детали ошибки:", error.response?.data || error.message);
        throw error;
    }
};

export const fetchUserProfile = async () => {
    try {
        const response = await api.get('/users/profile/me');
        console.log("📥 Профиль загружен:", response.data);
        console.log("📥 isPremium:", response.data?.isPremium);
        if (!response.data) {
            throw new Error("Профиль не найден в ответе");
        }
        return response.data;
    } catch (e) {
        console.error("Ошибка загрузки профиля:", e);
        console.error("Детали ошибки:", e.response?.data || e.message);
        if (keycloak.tokenParsed) {
            console.log("⚠️ Используем fallback данные из Keycloak");
            return {
                username: keycloak.tokenParsed.preferred_username,
                email: keycloak.tokenParsed.email,
                avatarUrl: null,
                isPremium: false
            };
        }
        console.warn("⚠️ Keycloak token недоступен, возвращаем пустой профиль");
        return {
            username: null,
            email: null,
            avatarUrl: null,
            isPremium: false
        };
    }
};

export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/users/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

const loadUsers = () => {
    try { return JSON.parse(localStorage.getItem('mockUsers') || '[]'); }
    catch (e) { console.error('Не вдалося прочитати користувачів', e); return []; }
};

const saveUsers = (users) => {
    try { localStorage.setItem('mockUsers', JSON.stringify(users)); }
    catch (e) { console.error('Не вдалося зберегти користувачів', e); }
};

const mockVerificationCodes = {};

export const loginUserAPI = async (emailOrPhone, password) => {
    const key = emailOrPhone.trim().toLowerCase();
    await new Promise(r => setTimeout(r, 300));
    const users = loadUsers();
    const user = users.find(u => u.emailOrPhone === key);
    if (!user) return { success: false, message: 'Користувача не знайдено' };
    if (user.password !== password) return { success: false, message: 'Невірний пароль' };
    const token = 'fake_jwt_token_123';
    localStorage.setItem('user', JSON.stringify({ emailOrPhone: key }));
    localStorage.setItem('token', token);
    return { success: true, user: { emailOrPhone: key }, token };
};

export const logoutUser = async () => {
    await new Promise(r => setTimeout(r, 200));
    try {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return { success: true };
    } catch (e) {
        return { success: false, message: 'Не вдалося вийти' };
    }
};

export const getRememberedUser = () => {
    try { return localStorage.getItem('rememberedUser'); }
    catch (e) { console.error("Помилка в getRememberedUser:", e); return null; }
};

export const getAuthUser = () => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); }
    catch (e) { console.error("Помилка в getAuthUser:", e); return null; }
};

export const fakeRegisterEmail = async (emailOrPhone) => {
    const key = emailOrPhone.trim().toLowerCase();
    await new Promise(r => setTimeout(r, 300));
    const users = loadUsers();
    if (users.some(u => u.emailOrPhone === key)) return { success: false, message: 'Ця адреса вже зареєстрована' };
    users.push({ emailOrPhone: key, password: '' });
    saveUsers(users);
    return { success: true };
};

export const sendVerificationCodeAPI = async (emailOrPhone) => {
    const key = emailOrPhone.trim().toLowerCase();
    const LENGTH = 5;
    const code = Array.from({ length: LENGTH }, () => Math.floor(Math.random() * 10)).join('');
    mockVerificationCodes[key] = { code, verified: false };
    await new Promise(r => setTimeout(r, 300));
    return { success: true, code };
};

export const verifyCodeAPI = async (emailOrPhone, code) => {
    const key = emailOrPhone.trim().toLowerCase();
    await new Promise(r => setTimeout(r, 300));

    if (mockVerificationCodes[key]?.code === code) {
        mockVerificationCodes[key].verified = true;
        return { success: true };
    }

    return { success: false, message: 'Невірний код' };
};

export const setPasswordAPI = async (emailOrPhone, password) => {
    const key = emailOrPhone.trim().toLowerCase();
    await new Promise(r => setTimeout(r, 300));

    const users = loadUsers();
    const idx = users.findIndex(u => u.emailOrPhone === key);
    const verified = mockVerificationCodes[key]?.verified || false;

    if (!verified && !(idx >= 0 && users[idx].password)) {
        return { success: false, message: 'Спочатку підтвердіть email/телефон' };
    }

    if (!password || password.length < 4) {
        return { success: false, message: 'Пароль повинен містити щонайменше 4 символи' };
    }

    if (idx >= 0) users[idx].password = password;
    else users.push({ emailOrPhone: key, password });

    saveUsers(users);

    delete mockVerificationCodes[key];

    const userData = { emailOrPhone: key };
    const token = "fake_jwt_token_" + Date.now();
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);

    return { success: true, user: userData, token };
};

export const refreshAccessTokenAPI = async () => {
    await new Promise(r => setTimeout(r, 200));
    const authUser = getAuthUser();
    if (!authUser) return { success: false, message: 'Користувач не увійшов' };
    const token = "fake_jwt_token_" + Date.now();
    localStorage.setItem("token", token);
    return { success: true, token };
};

export const createCheckoutSession = async () => {
    try {
        if (!keycloak.authenticated) {
            keycloak.login();
            return { success: false, message: "Login required" };
        }

        const response = await api.post('/payment/checkout');

        if (response.data && response.data.url) {
            return { success: true, url: response.data.url };
        } else {
            return { success: false, message: "No URL returned" };
        }
    } catch (error) {
        console.error("Payment Error:", error);
        return { success: false, message: error.message };
    }
};

export const fetchHeaderData = async () => {
    try {
        const baseURL = api.defaults.baseURL || '';
        let url = '/api/public/layout/header';

        if (baseURL.endsWith('/api') || baseURL.match(/\/api\/?$/)) {
            url = '/public/layout/header';
        }

        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Ошибка загрузки данных хедера:", error);
        console.error("URL запроса:", error.config?.url);
        console.error("Base URL:", api.defaults.baseURL);
        throw error;
    }
};

export const fetchFooterData = async () => {
    try {
        const baseURL = api.defaults.baseURL || '';
        let url = '/api/public/layout/footer';

        if (baseURL.endsWith('/api') || baseURL.match(/\/api\/?$/)) {
            url = '/public/layout/footer';
        }

        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Ошибка загрузки данных футера:", error);
        console.error("URL запроса:", error.config?.url);
        console.error("Base URL:", api.defaults.baseURL);
        throw error;
    }
};

export const getCatalogPageData = async () => {
    try {
        const baseURL = api.defaults.baseURL || '';
        let url = '/api/public/catalog';

        if (baseURL.endsWith('/api') || baseURL.match(/\/api\/?$/)) {
            url = '/public/catalog';
        }

        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Ошибка загрузки данных каталога:", error);
        throw error;
    }
};

export const getNewPopularPageData = async () => {
    try {
        const baseURL = api.defaults.baseURL || '';
        let url = '/api/public/new-popular';

        if (baseURL.endsWith('/api') || baseURL.match(/\/api\/?$/)) {
            url = '/public/new-popular';
        }

        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Ошибка загрузки данных страницы новинок:", error);
        throw error;
    }
};

export const getFilmsPageMeta = async () => {
    try {
        const baseURL = api.defaults.baseURL || '';
        let url = '/api/public/titles/page-meta';

        if (baseURL.endsWith('/api') || baseURL.match(/\/api\/?$/)) {
            url = '/public/titles/page-meta';
        }

        console.log("Загрузка метаданных страницы Films, baseURL:", baseURL, "url:", url);
        const response = await api.get(url);
        console.log("Метаданные страницы Films:", response.data);
        return response.data;
    } catch (error) {
        console.error("Ошибка загрузки метаданных страницы Films:", error);
        throw error;
    }
};

export const getFavorites = async () => {
    try {
        const baseURL = api.defaults.baseURL || '';
        let url = '/api/favorites';

        if (baseURL.endsWith('/api') || baseURL.match(/\/api\/?$/)) {
            url = '/favorites';
        }

        console.log("Запрос к favorites, baseURL:", baseURL, "url:", url);
        const response = await api.get(url);
        console.log("Ответ от API:", response.data);
        
        if (response.data && response.data.content) {
            return response.data.content;
        }
        if (Array.isArray(response.data)) {
            return response.data;
        }
        return [];
    } catch (error) {
        console.error("Ошибка загрузки избранного:", error);
        if (error.response?.status === 401) {
            return [];
        }
        if (error.response?.status === 404) {
            console.error("Эндпоинт /api/favorites не найден (404)");
            return [];
        }
        throw error;
    }
};

export const toggleFavorite = async (titleId) => {
    try {
        const baseURL = api.defaults.baseURL || '';
        let url = `/api/favorites/${titleId}`;

        if (baseURL.endsWith('/api') || baseURL.match(/\/api\/?$/)) {
            url = `/favorites/${titleId}`;
        }

        console.log("POST запрос к favorites, baseURL:", baseURL, "url:", url, "titleId:", titleId);
        const response = await api.post(url);
        console.log("Ответ от toggleFavorite:", response.data);
        return response.data;
    } catch (error) {
        console.error("Ошибка переключения избранного:", error);
        console.error("Статус ошибки:", error.response?.status);
        console.error("Данные ошибки:", error.response?.data);
        console.error("URL запроса:", error.config?.url);
        if (error.response?.status === 401) {
            if (keycloak && !keycloak.authenticated) {
                keycloak.login();
            }
            throw new Error("Требуется авторизация");
        }
        if (error.response?.status === 500) {
            console.error("Ошибка 500 на сервере при переключении избранного");
            console.error("Детали ошибки с сервера:", error.response?.data);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || "Ошибка сервера при переключении избранного";
            throw new Error(errorMessage);
        }
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Ошибка при переключении избранного";
        throw new Error(errorMessage);
    }
};