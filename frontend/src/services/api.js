import axios from "axios";
import { keycloak } from "./keycloak";
import { API_URL } from "./config";
import { fakeSlides, fakeCategories, fakeContent, getPopularFilms, getPopularActors, getMenuItems, getWatchModeItems, getStarsActors} from "./mockdata";
export { fakeSlides, fakeCategories, fakeContent, getPopularFilms, getPopularActors, getMenuItems, getWatchModeItems, getStarsActors };

export const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
    if (keycloak.authenticated && keycloak.token) {
        try {
            await keycloak.updateToken(30);
        } catch (error) {
            console.error('Failed to refresh token. Initiating Keycloak logout.', error);
            keycloak.logout();
            return Promise.reject('Token refresh failed, logging out.');
        }
        config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

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
