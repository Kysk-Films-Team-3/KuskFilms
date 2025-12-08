import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import './Header.css';
import { getPopularFilms, getPopularActors } from 'services/api';
import { useHasRole } from 'services/useHasRole';
import { useKeycloak } from '@react-keycloak/web';
import { HeaderSearch } from './HeaderSearch';

export const Header = ({ userProfile, onProfileClick, onPromoInputClick, onOpenLogoutModal}) => {

    const { t, i18n } = useTranslation();
    const location = useLocation();
    const { keycloak } = useKeycloak();
    const hasAdminRole = useHasRole("ADMIN");
    const isPremiumPage = location.pathname === '/Premium';
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isSearchHovered, setIsSearchHovered] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({ films: [], actors: [] });
    const [popularFilms, setPopularFilms] = useState([]);
    const [popularActors, setPopularActors] = useState([]);
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);

    const isLoggedIn = keycloak?.authenticated;
    const avatarUrl = userProfile?.avatarUrl;
    const username = userProfile?.username || keycloak?.tokenParsed?.preferred_username;

    useEffect(() => {
        const savedLang = localStorage.getItem('lang');
        if (savedLang && savedLang !== i18n.language) {
            i18n.changeLanguage(savedLang).catch(() => {});
        }
    }, [i18n]);

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang).catch(() => {});
        localStorage.setItem('lang', lang);
    };

    useEffect(() => {
        (async () => {
            try {
                const films = await getPopularFilms();
                const actors = await getPopularActors();
                setPopularFilms(films);
                setPopularActors(actors);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const handleMenuItemClick = () => setIsDropdownOpen(false);

    const performSearch = (query) => {
        if (!query) {
            setSearchResults({ films: [], actors: [] });
            return;
        }
        const lowerCaseQuery = query.toLowerCase();
        const filteredFilms = popularFilms.filter(film =>
            film.title.toLowerCase().includes(lowerCaseQuery)
        );
        const filteredActors = popularActors.filter(actor =>
            actor.name.toLowerCase().includes(lowerCaseQuery)
        );

        const sortedFilms = filteredFilms.sort((a, b) => {
            const aStartsWith = a.title.toLowerCase().startsWith(lowerCaseQuery);
            const bStartsWith = b.title.toLowerCase().startsWith(lowerCaseQuery);
            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;
            return a.title.localeCompare(b.title);
        });

        const sortedActors = filteredActors.sort((a, b) => {
            const aStartsWith = a.name.toLowerCase().startsWith(lowerCaseQuery);
            const bStartsWith = b.name.toLowerCase().startsWith(lowerCaseQuery);
            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;
            return a.name.localeCompare(b.name);
        });

        setSearchResults({ films: sortedFilms, actors: sortedActors });
    };

    const handleSearchInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        performSearch(query);
    };

    const handleSearchToggle = () => {
        setIsSearchOpen(!isSearchOpen);
        if (isSearchOpen) {
            setSearchQuery('');
            setSearchResults({ films: [], actors: [] });
        }
    };

    const handleLogin = () => {
        if (keycloak) {
            keycloak.login();
        }
    };

    const fetchApi = async (endpoint) => {
        try {
            const headers = {
                'Content-Type': 'application/json',
            };
            if (keycloak.authenticated && endpoint !== '/api/test/public') {
                headers['Authorization'] = `Bearer ${keycloak.token}`;
            }

            const response = await fetch(`http://localhost/api/test${endpoint.replace('/api/test', '')}`, { headers });

            const data = await response.text();

            if (response.ok) {
                try {
                    const jsonData = JSON.parse(data);
                    alert(`УСПЕХ:\n\nEndpoint: ${endpoint}\n\nResponse:\n${JSON.stringify(jsonData, null, 2)}`);
                } catch (e) {
                    alert(`УСПЕХ:\n\nEndpoint: ${endpoint}\n\nResponse:\n${data}`);
                }
            } else {
                alert(`ОШИБКА (Статус: ${response.status}):\n\nEndpoint: ${endpoint}\n\nResponse:\n${data}`);
            }
        } catch (error) {
            console.error("Ошибка при вызове API:", error);
            alert(`КРИТИЧЕСКАЯ ОШИБКА:\n\nНе удалось подключиться к API. Смотрите консоль (F12).`);
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !event.target.closest('.header_profile_switch')) {
                setIsDropdownOpen(false);
            }
        }

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    useEffect(() => {
        if (isSearchOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            
            document.body.classList.add('search-open');
            
            const mainElement = document.querySelector('.layout-main');
            const footerElement = document.querySelector('.footer, footer');
            const layoutElement = document.querySelector('.layout');
            
            if (mainElement) {
                mainElement.classList.add('search-blocked');
                mainElement.style.pointerEvents = 'none';
                mainElement.style.userSelect = 'none';
            }
            if (footerElement) {
                footerElement.style.pointerEvents = 'none';
                footerElement.style.userSelect = 'none';
            }
            if (layoutElement && !layoutElement.querySelector('.header')) {
                layoutElement.style.pointerEvents = 'none';
            }
            
            const blockEvent = (e) => {
                const target = e.target;
                const isAllowed = target.closest('.header') ||
                                target.closest('.header_search') ||
                                target.closest('.header_search_box') ||
                                target.closest('.header_search_results') ||
                                target.closest('.header_search_overlay');
                
                if (!isAllowed) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    return false;
                }
            };

            const events = ['click', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'contextmenu', 'dblclick'];
            events.forEach(eventType => {
                document.addEventListener(eventType, blockEvent, { capture: true, passive: false });
            });

            return () => {
                document.body.style.overflow = originalOverflow;
                document.body.style.position = '';
                document.body.style.width = '';
                document.body.classList.remove('search-open');
                
                if (mainElement) {
                    mainElement.classList.remove('search-blocked');
                    mainElement.style.pointerEvents = '';
                    mainElement.style.userSelect = '';
                }
                if (footerElement) {
                    footerElement.style.pointerEvents = '';
                    footerElement.style.userSelect = '';
                }
                if (layoutElement) {
                    layoutElement.style.pointerEvents = '';
                }
                
                events.forEach(eventType => {
                    document.removeEventListener(eventType, blockEvent, { capture: true });
                });
            };
        }
    }, [isSearchOpen]);

    return (
        <>
            {isSearchOpen && createPortal(
                <div 
                    className="header_search_overlay"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsSearchOpen(false);
                        setSearchQuery('');
                        setSearchResults({ films: [], actors: [] });
                    }}
                />,
                document.body
            )}
            <header className="header">
                <div className="header_container">
                    <div className="header_left">
                        <Link to="/" className="logo">
                            <img src="https://res.cloudinary.com/da9jqs8yq/image/upload/v1754083133/Logo.png" className="header_logo" alt="Logo"/>
                        </Link>

                        {!isSearchOpen && !isPremiumPage && (
                            <nav className="header_nav">
                                <NavLink to="/" end><Trans i18nKey="header.nav.home" /></NavLink>
                                <NavLink to="/Catalog"><Trans i18nKey="header.nav.catalog" /></NavLink>
                                <NavLink to="/"><Trans i18nKey="header.nav.newAndPopular" /></NavLink>
                                <NavLink to="/Favorites"><Trans i18nKey="header.nav.favorites" /></NavLink>
                            </nav>
                        )}

                        {isSearchOpen && !isPremiumPage && (
                            <div className="header_search_box" ref={searchRef}>
                                <div className="header_search_bar">
                                    <div className="header_search_left_icon" />
                                    <input
                                        type="text"
                                        placeholder={String(t("header.search.placeholder"))}
                                        autoFocus
                                        value={searchQuery}
                                        onChange={handleSearchInputChange}
                                    />
                                </div>
                                {isSearchOpen && (
                                    <HeaderSearch
                                        popularFilms={popularFilms}
                                        popularActors={popularActors}
                                        searchResults={searchResults}
                                        searchQuery={searchQuery}
                                    />
                                )}
                            </div>
                        )}
                    </div>

                <div className="header_right">
                    {!isPremiumPage && (
                        <div
                            className="header_search"
                            onClick={handleSearchToggle}
                            onMouseEnter={() => setIsSearchHovered(true)}
                            onMouseLeave={() => setIsSearchHovered(false)}
                        >
                            <div
                                className={`header_search_right_icon ${isSearchOpen ? 'open' : isSearchHovered ? 'hover' : ''}`}
                                onMouseEnter={() => setIsSearchHovered(true)}
                                onMouseLeave={() => setIsSearchHovered(false)}
                            />
                        </div>
                    )}

                    {!isPremiumPage && (
                        <Link to="/Premium" className="header_premium"><Trans i18nKey="header.premium" /></Link>
                    )}

                    <div className="header_promo" onClick={onPromoInputClick}>
                        <div className="header_promo_icon" />
                        <span className="header_promo_text"><Trans i18nKey="header.promo" /></span>
                    </div>

                    {isLoggedIn ? (
                        <div className="header_profile">
                            <div onClick={toggleDropdown} className="header_profile_switch">
                                <div className={`header_arrow ${isDropdownOpen ? 'open' : ''}`} aria-label={isDropdownOpen ? 'Закрити меню' : 'Відкрити меню'} />

                                <div className="header_avatar">
                                    {avatarUrl && (
                                        <img
                                            src={avatarUrl}
                                            alt="Avatar"
                                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                    )}
                                </div>
                            </div>

                            {isDropdownOpen && (
                                <div className="header_dropdown" ref={dropdownRef}>
                                    <div className="profile_info_block">
                                        <div className="profile_block">
                                            <div className="header_avatar">
                                                {avatarUrl && (
                                                    <img
                                                        src={avatarUrl}
                                                        alt="Avatar"
                                                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                                    />
                                                )}
                                            </div>
                                            <div className="profile_text_block">
                                                <div className="profile_name">
                                                    {username || 'User'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="check_icon"></div>
                                    </div>
                                    <hr className="divider" />
                                    <ul>
                                        <li>
                                            <button onClick={() => {onProfileClick();  handleMenuItemClick();}}  className="dropdown_link">
                                                <div className="dropdown_icon manage_icon"></div>
                                                <Trans i18nKey="header.dropdown.manageProfile" />
                                            </button>
                                        </li>

                                        <li>
                                            <button
                                                className="dropdown_link language_switch"
                                                onClick={() => {
                                                    const newLang = i18n.language === 'ua' ? 'en' : 'ua';
                                                    changeLanguage(newLang);
                                                    handleMenuItemClick();
                                                }}
                                            >
                                                <div className="dropdown_icon language_icon"></div>
                                                {i18n.language === 'ua' ? 'English' : 'Українська'}
                                            </button>
                                        </li>
                                        <li className="header_dropdown_logout">
                                            <Link
                                                to="/"
                                                className="settings_logout_link dropdown_link"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleMenuItemClick();
                                                    onOpenLogoutModal();
                                                }}
                                            >
                                                <div className="dropdown_icon logout_icon"></div>
                                                <Trans i18nKey="settings.logout" />
                                            </Link>
                                        </li>
                                        {hasAdminRole && (
                                            <li>
                                                <Link
                                                    to="/admin"
                                                    onClick={handleMenuItemClick}
                                                    className="dropdown_link"
                                                    style={{ color: '#00ffaa', fontWeight: 'bold' }}
                                                >
                                                  <div className="dropdown_icon settings_icon"></div>
                                                    Адмін-панель
                                                </Link>
                                            </li>
                                        )}
                                    </ul>

                                    <div style={{ padding: '10px 10px', color: 'gray' }}>
                                        <p style={{ margin: '5px 0', fontWeight: 'bold' }}>API ТЕСТЫ</p>
                                        <ul>
                                            <li>
                                                <button onClick={() => fetchApi('/api/test/public')} className="dropdown_link">
                                                    <div className="dropdown_icon language_icon"></div>
                                                    Тест: Public
                                                </button>
                                            </li>
                                            <li>
                                                <button onClick={() => fetchApi('/api/test/private')} className="dropdown_link">
                                                    <div className="dropdown_icon manage_icon"></div>
                                                    Тест: Private (JIT Trigger)
                                                </button>
                                            </li>
                                            {hasAdminRole && (
                                                <li>
                                                    <button onClick={() => fetchApi('/api/test/admin')} className="dropdown_link" style={{color: '#00ffaa'}}>
                                                        <div className="dropdown_icon manage_icon"></div>
                                                        Тест: Admin
                                                    </button>
                                                </li>
                                            )}
                                        </ul>
                                    </div>

                                </div>
                            )}
                        </div>
                    ) : (
                        <div onClick={handleLogin} className="header_log_button">
                            <div className="log_button_icon"></div>
                            <span><Trans i18nKey="header.login" /></span>
                        </div>
                    )}
                </div>
            </div>
        </header>
        </>
    );
};