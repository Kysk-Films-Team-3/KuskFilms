import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { getMenuItems, getWatchModeItems, getHomePageData, transformCarouselItems, transformCategories, transformSections, transformCelebrities, transformPromo } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';
import {Trans, useTranslation} from 'react-i18next';
import '../i18n/i18n';
import { ShareModal } from '../components/modal/ShareModal';

export const Home = ({ onOpenActorRecs }) => {
    const [currentSlide, setCurrentSlide] = useState(1);
    const [isHovered, setIsHovered] = useState(false);
    const carouselTrackRef = useRef(null);
    const carouselWrapperRef = useRef(null);
    const [activeCategories, setActiveCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [originalCategories, setOriginalCategories] = useState([]);
    const [filteredContent, setFilteredContent] = useState([]);
    const [allContent, setAllContent] = useState([]);
    const [slides, setSlides] = useState([]);
    const [error, setError] = useState(null);
    const categoriesRef = useRef(null);
    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const [isSaved, setIsSaved] = useState(false);
    const [isTrailerSaved, setIsTrailerSaved] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [isWatchModeMenuOpen, setIsWatchModeMenuOpen] = useState(false);
    const [selectedWatchModeId, setSelectedWatchModeId] = useState(null);
    const handleToggleMenu = () => setIsMenuOpen(prev => !prev);
    const handleMenuItemClick = (id) => setSelectedItemId(id);
    const handleToggleWatchModeMenu = () => setIsWatchModeMenuOpen(prev => !prev);
    const handleWatchModeSelect = (id) => setSelectedWatchModeId(id);
    const dropdownRef = useRef(null);
    const dropdownRef2 = useRef(null);
    const [savedFilms, setSavedFilms] = useState([]);
    const filmsRefs = useRef({});
    const [scrollStates, setScrollStates] = useState({});
    const [isVolumeActive, setIsVolumeActive] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [watchModeItems, setWatchModeItems] = useState([]);
    const [starsActors, setStarsActors] = useState([]);
    const [promoData, setPromoData] = useState(null);
    const [shareModal, setShareModal] = useState({ isOpen: false, film: null });
    const { t } = useTranslation();
    const { favorites, toggleFavorite } = useFavorites();
    const location = useLocation();
    const navigate = useNavigate();


    const toggleVolume = () => {
        setIsVolumeActive(prev => !prev);
    };

    const setFilmRef = (id) => (el) => {
        filmsRefs.current[id] = el;
    };

    const scrollFilms = (id, direction) => {
        const el = filmsRefs.current[id];
        if (!el) return;

        const filmCard = el.querySelector('.home_film_card');
        if (!filmCard) return;

        const filmCardWidth = filmCard.offsetWidth;
        const gap = 30;
        const scrollAmount = filmCardWidth + gap;

        el.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    const handleScroll = (id) => {
        const el = filmsRefs.current[id];
        if (el) {
            const isScrollable = el.scrollWidth > el.clientWidth;

            setScrollStates(prev => ({
                ...prev,
                [id]: {
                    isAtStart: !isScrollable || el.scrollLeft === 0,
                    isAtEnd: !isScrollable || el.scrollWidth - el.scrollLeft <= el.clientWidth + 1,
                    isScrollable: isScrollable,
                }
            }));
        }
    };

    const toggleFilmSave = (filmId) => {
        setSavedFilms((prev) =>
            prev.includes(filmId)
                ? prev.filter((id) => id !== filmId)
                : [...prev, filmId]
        );
    };

    const handleActorClick = (actor) => {
        onOpenActorRecs(actor);
    };

    const selectedMenuItem = menuItems.find(item => item.id === selectedItemId) || menuItems[0] || {};
    const selectedWatchModeItem = watchModeItems.find(item => item.id === selectedWatchModeId) || watchModeItems[0] || {};

    useEffect(() => {
        const savedCategories = localStorage.getItem('activeCategories');
        if (savedCategories) setActiveCategories(JSON.parse(savedCategories));
    }, []);

    useEffect(() => {
        localStorage.setItem('activeCategories', JSON.stringify(activeCategories));
    }, [activeCategories]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
            if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
                setIsWatchModeMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const loadAuxiliaryData = async () => {
            try {
                setMenuItems(await getMenuItems());
                setWatchModeItems(await getWatchModeItems());
            } catch (err) {
                console.error("Помилка завантаження допоміжних даних:", err);
            }
        };

        const loadInitialData = async () => {
            try {
                const homeData = await getHomePageData();
                
                const slides = transformCarouselItems(homeData.carousel);
                setSlides(slides);
                
                const categories = transformCategories(homeData.categories);
                setCategories(categories);
                setOriginalCategories(categories);
                
                const sections = transformSections(homeData.sections);
                const mappedContent = [{
                    category: "Главная",
                    subcategories: sections.map(section => ({
                        id: `section-${section.id}`,
                        title: section.title,
                        films: section.films
                    }))
                }];
                
                setAllContent(mappedContent);
                setFilteredContent(mappedContent);
                
                const celebrities = transformCelebrities(homeData.celebrities);
                setStarsActors(celebrities);
                
                const promo = transformPromo(homeData.promo);
                setPromoData(promo);

                await loadAuxiliaryData();
            } catch (err) {
                console.error("Ошибка загрузки данных:", err);
                setError(<Trans i18nKey="home.errorLoading" />);
            }
        };

        void loadInitialData();
    }, []);
    useEffect(() => {
        if (activeCategories.length === 0) {
            setFilteredContent(allContent);
        } else {
            setFilteredContent(
                allContent.filter(item => activeCategories.includes(item.category))
            );
        }
    }, [activeCategories, allContent]);

    const nextSlide = () => {
        if (slides.length > 0) setCurrentSlide(prev => (prev + 1) % slides.length);
    };
    const prevSlide = () => {
        if (slides.length > 0) setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
    };



    useEffect(() => {
        const savedMenuId = localStorage.getItem('selectedMenuItemId');
        if (savedMenuId) {
            setSelectedItemId(savedMenuId);
        }
    }, []);

    useEffect(() => {
        if (selectedItemId !== null && selectedItemId !== undefined) {
            localStorage.setItem('selectedMenuItemId', String(selectedItemId));
        }
    }, [selectedItemId]);

    useEffect(() => {
        const savedWatchModeId = localStorage.getItem('selectedWatchModeId');
        if (savedWatchModeId) {
            setSelectedWatchModeId(Number(savedWatchModeId));
        }
    }, []);

    useEffect(() => {
        if (selectedWatchModeId !== null) {
            localStorage.setItem('selectedWatchModeId', selectedWatchModeId.toString());
        }
    }, [selectedWatchModeId]);



    const handleMouseDown = (e) => {
        isDown.current = true;
        startX.current = e.pageX - categoriesRef.current.offsetLeft;
        scrollLeft.current = categoriesRef.current.scrollLeft;
    };

    const handleMouseLeave = () => { isDown.current = false; };
    const handleMouseUp = () => { isDown.current = false; };
    const handleMouseMove = (e) => {
        if (!isDown.current) return;
        e.preventDefault();
        const x = e.pageX - categoriesRef.current.offsetLeft;
        const walk = (x - startX.current) * 10;
        categoriesRef.current.scrollLeft = scrollLeft.current - walk;
    };

    useEffect(() => {
        let intervalId;
        if (!isHovered && slides.length > 0) {
            intervalId = setInterval(() => setCurrentSlide(prev => (prev + 1) % slides.length), 5000);
        }
        return () => clearInterval(intervalId);
    }, [isHovered, slides.length]);

    useEffect(() => {
        const updatePosition = () => {
            const track = carouselTrackRef.current;
            const wrapper = carouselWrapperRef.current;
            if (track && wrapper && slides.length > 0) {
                const firstSlide = track.querySelector('.home_carousel_slide');
                if (!firstSlide) return;
                
                const slideWidth = firstSlide.offsetWidth;
                const gap = 20;
                const wrapperWidth = wrapper.offsetWidth;
                
                if (slideWidth <= 0 || wrapperWidth <= 0) return;
                
                const slideLeftPosition = currentSlide * (slideWidth + gap);
                
                const wrapperCenter = wrapperWidth / 2;
                const slideCenter = slideLeftPosition + slideWidth / 2;
                const offset = wrapperCenter - slideCenter;
                
                track.style.transform = `translateX(${offset}px)`;
            }
        };
        
        updatePosition();
        const timeoutId1 = setTimeout(updatePosition, 10);
        const timeoutId2 = setTimeout(updatePosition, 50);
        
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updatePosition();
            }, 50);
        };
        
        window.addEventListener('resize', handleResize);
        
        let resizeObserver = null;
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(() => {
                requestAnimationFrame(updatePosition);
            });
            
            const wrapper = carouselWrapperRef.current;
            const track = carouselTrackRef.current;
            if (wrapper) resizeObserver.observe(wrapper);
            if (track) {
                const firstSlide = track.querySelector('.home_carousel_slide');
                if (firstSlide) resizeObserver.observe(firstSlide);
            }
        }
        
        return () => {
            clearTimeout(timeoutId1);
            clearTimeout(timeoutId2);
            clearTimeout(resizeTimeout);
            window.removeEventListener('resize', handleResize);
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
        };
    }, [currentSlide, slides.length]);

    useEffect(() => {
        const filmIds = Object.keys(filmsRefs.current);

        filmIds.forEach(id => {
            handleScroll(id);
        });

        const handleResize = () => {
            filmIds.forEach(id => {
                handleScroll(id);
            });
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [filteredContent]);

    if (error) return <div>{error}</div>;

    const toggleSave = () => {
        setIsSaved(prev => !prev);
    };

    const toggleTrailerSave = () => {
        setIsTrailerSaved(prev => !prev);
    };

    const handleFilmsMouseDown = (e, id) => {
        isDown.current = true;
        const el = filmsRefs.current[id];
        startX.current = e.pageX - el.offsetLeft;
        scrollLeft.current = el.scrollLeft;
    };
    const handleFilmsMouseLeave = () => { isDown.current = false; };
    const handleFilmsMouseUp = () => { isDown.current = false; };

    const handleFilmsMouseMove = (e, id) => {
        if (!isDown.current) return;
        e.preventDefault();
        const el = filmsRefs.current[id];
        const x = e.pageX - el.offsetLeft;
        const walk = (x - startX.current) * 2;
        el.scrollLeft = scrollLeft.current - walk;
    };


    return (
        <div className="home">
            <div className="home_static">
                <div className="home_carousel_container" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                    <div className="home_carousel_outer_wrapper">
                        <div className="home_carousel_wrapper" ref={carouselWrapperRef}>
                            <div className="home_carousel_track" ref={carouselTrackRef}>
                                {slides.length > 0 ? slides.map((slide, index) => (
                                    <Link key={slide.id || index} to={slide.link || '#'} className={`home_carousel_slide ${index === currentSlide ? 'active' : ''}`}>
                                        <div 
                                            className={`home_slide_background ${slide.className || 'home_slide1'}`} 
                                            style={slide.imageUrl ? { 
                                                backgroundImage: `url(${slide.imageUrl})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                            } : {}}
                                        />
                                        <div className="home_slide_text">
                                            {slide.isNew && (
                                                <div className="home_slide_new">
                                                    <div className="home_slide_new_title"><Trans i18nKey="slide.new"/></div>
                                                </div>
                                            )}
                                            <div className="home_slide_film_name">
                                                {slide.title || 'Без названия'}
                                            </div>
                                            <div className="home_slide_line_block">
                                                {slide.rating && (
                                                    <div className="home_slide_line_rating">{slide.rating}</div>
                                                )}
                                                {slide.year && (
                                                    <div className="home_slide_line_time">{slide.year}</div>
                                                )}
                                                {slide.genre && (
                                                    <div className="home_slide_line_genre">
                                                        {slide.genre}
                                                    </div>
                                                )}
                                                {slide.duration && (
                                                    <div className="home_slide_line_time">
                                                        {slide.duration}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                )) : (
                                    <div className="home_carousel_slide">
                                        <div className="home_slide_text">
                                            <div className="home_slide_film_name">Загрузка...</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {slides.length > 0 && (
                                <>
                                    <button onClick={prevSlide} className={`home_nav_button prev ${isHovered ? 'show' : ''}`} />
                                    <button onClick={nextSlide} className={`home_nav_button next ${isHovered ? 'show' : ''}`} />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {categories.length > 0 && (
                    <div className="home_categories" ref={categoriesRef} onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
                        {categories
                            .slice()
                            .sort((a, b) => {
                                const aIndex = activeCategories.indexOf(a.name);
                                const bIndex = activeCategories.indexOf(b.name);
                                if (aIndex !== -1 && bIndex === -1) return -1;
                                if (aIndex === -1 && bIndex !== -1) return 1;
                                if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                                return originalCategories.findIndex(c => c.name === a.name) - originalCategories.findIndex(c => c.name === b.name);
                            })
                            .map(category => {
                                const isActive = activeCategories.includes(category.name);

                                return (
                                    <button key={category.name} className={`home_categories_button ${isActive ? 'active' : ''}`} onClick={() => {if (!isActive) {setActiveCategories(prev => [category.name, ...prev]);
                                        setTimeout(() => { if (categoriesRef.current) { categoriesRef.current.scrollTo({ left: 0, behavior: 'auto' }); } }, 10); } }}>
                                        <img src={isActive ? category.activeIcon : category.icon} className="home_button_icon" alt={category.name} onDragStart={e => e.preventDefault()}/>
                                        <span>{category.name}</span>
                                        {isActive && (
                                            <span className="home_category_remove" onClick={(e) => {e.stopPropagation();setActiveCategories(prev => prev.filter(name => name !== category.name));}}/>)}
                                    </button>
                                );
                            })}

                    </div>
                )}
            </div>

            <div className="home_dynamic">
                {filteredContent.map(cat =>
                    cat.subcategories
                        .map(sub => (
                            <div key={sub.id} className="home_block">
                                <div className="home_block_header">
                                    <div className="home_block_title">{sub.title}</div>
                                    <div className="home_block_arrow"></div>
                                </div>
                                <div className={`films_scroll_btn left ${!scrollStates[sub.id]?.isScrollable || (scrollStates[sub.id]?.isAtStart ?? true) ? 'hidden' : ''}`} onClick={() => scrollFilms(sub.id, 'left')}/>
                                <div className={`films_scroll_btn right ${!scrollStates[sub.id]?.isScrollable || (scrollStates[sub.id]?.isAtEnd ?? false) ? 'hidden' : ''}`} onClick={() => scrollFilms(sub.id, 'right')}/>
                                <div className="home_films_wrapper"   onMouseDown={(e) => handleFilmsMouseDown(e, sub.id)} onMouseLeave={() => handleFilmsMouseLeave()}  onMouseUp={() => handleFilmsMouseUp()}
                                     onMouseMove={(e) => handleFilmsMouseMove(e, sub.id)} onScroll={() => handleScroll(sub.id)} ref={setFilmRef(sub.id)}>

                                    <div className="home_films">
                                        {sub.films.map(film => (
                                            <div 
                                                key={film.id} 
                                                className="home_film_card" 
                                                onMouseEnter={() => setSelectedItemId(film.id)} 
                                                onMouseLeave={() => setSelectedItemId(null)}
                                                onClick={(e) => {

                                                    if (!e.target.closest('.home_film_action')) {
                                                        navigate(`/movie/${film.id}`);
                                                    }
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <img src={selectedItemId === film.id ? film.hoverImage : film.image} alt={film.title} className="film_img"/>
                                                <div className="home_film_header">
                                                    <div
                                                        className={`home_film_save home_film_action ${favorites.some(f => f.id === film.id) ? "active" : ""}`}
                                                        data-tooltip={t('tooltip.watch')}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleFavorite({
                                                                id: film.id,
                                                                image: film.image,
                                                                hoverImage: film.hoverImage,
                                                                rating: film.rating,
                                                                linedate: film.linedate,
                                                                line1: film.line1,
                                                                line2: film.line2,
                                                                season: film.season,
                                                                source: 'home',
                                                            });
                                                        }}
                                                    />

                                                    <div 
                                                        className="home_film_repost home_film_action" 
                                                        data-tooltip={t('tooltip.share')}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShareModal({ isOpen: true, film: film });
                                                        }}
                                                    />
                                                    <div 
                                                        className="home_film_remuve home_film_action" 
                                                        data-tooltip={t('tooltip.dislike')}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>

                                                <div className="home_film_text">
                                                    <div className="home_film_rating">{film.rating}</div>
                                                    <div className="home_film_line">
                                                        <div className="home_film_line1">
                                                            {film.linedate && <span className="home_film_date">{film.linedate}</span>}
                                                            {film.line1 && ` ${film.line1}`}
                                                        </div>
                                                        {film.line2 && <div className="home_film_line2">{film.line2}</div>}
                                                    </div>
                                                    {film.season && <div className="home_film_season">{film.season}</div>}
                                                </div>
                                            </div>

                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                )}

                {activeCategories.length === 0 && (
                    <>

                        <div className="home_stars_choice_block">
                            <div className="home_stars_header">
                                <div className="home_stars_choice_title"><Trans i18nKey="stars.title" /></div>
                                <div className="home_stars_choice_arrow"></div>
                            </div>

                            <div className="home_stars_actor">
                                {starsActors.map((actor, index) => (
                                    <div 
                                        key={actor.id || actor.collectionId} 
                                        className={actor.className || `home_stars_actor_${index + 1}`} 
                                        style={actor.actorImageUrl ? { backgroundImage: `url(${actor.actorImageUrl})` } : {}}
                                        onClick={() => handleActorClick(actor)}
                                    >
                                        <div className="home_stars_text">
                                            {actor.badgeText && (
                                                <div className="home_stars_collection">
                                                    <div className="home_stars_collection_title">
                                                        {actor.badgeText}
                                                    </div>
                                                </div>
                                            )}
                                            {actor.description && (
                                                <div className="home_stars_collection_watch">
                                                    {actor.description}
                                                </div>
                                            )}
                                            {actor.actorName && (
                                                <div className="home_stars_collection_watch_actor">
                                                    {actor.actorName}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {filteredContent.map(cat =>
                            cat.subcategories
                                .map(sub => (
                                    <div key={sub.id} className="home_block">

                                        <div className="home_block_header">
                                            <div className="home_block_title">{sub.title}</div>
                                            <div className="home_block_arrow"></div>
                                        </div>
                                        <div className={`films_scroll_btn left ${!scrollStates[sub.id]?.isScrollable || (scrollStates[sub.id]?.isAtStart ?? true) ? 'hidden' : ''}`} onClick={() => scrollFilms(sub.id, 'left')}/>
                                        <div className={`films_scroll_btn right ${!scrollStates[sub.id]?.isScrollable || (scrollStates[sub.id]?.isAtEnd ?? false) ? 'hidden' : ''}`} onClick={() => scrollFilms(sub.id, 'right')}/>
                                        <div className="home_films_wrapper"   onMouseDown={(e) => handleFilmsMouseDown(e, sub.id)} onMouseLeave={() => handleFilmsMouseLeave()} onMouseUp={() => handleFilmsMouseUp()}
                                             onMouseMove={(e) => handleFilmsMouseMove(e, sub.id)} onScroll={() => handleScroll(sub.id)} ref={setFilmRef(sub.id)}>

                                            <div className="home_films">
                                                {sub.films.map(film => (
                                                    <div 
                                                        key={film.id} 
                                                        className="home_film_card" 
                                                        onMouseEnter={() => setSelectedItemId(film.id)} 
                                                        onMouseLeave={() => setSelectedItemId(null)}
                                                        onClick={(e) => {
                                                            if (!e.target.closest('.home_film_action')) {
                                                                navigate(`/movie/${film.id}`);
                                                            }
                                                        }}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <img src={selectedItemId === film.id ? film.hoverImage : film.image} alt={film.title} className="film_img"/>
                                                        <div className="home_film_header">
                                                            <div
                                                                className={`home_film_save home_film_action ${favorites.some(f => f.id === film.id) ? "active" : ""}`}
                                                                data-tooltip={t('tooltip.watch')}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleFavorite({
                                                                        id: film.id,
                                                                        image: film.image,
                                                                        hoverImage: film.hoverImage,
                                                                        rating: film.rating,
                                                                        linedate: `films.${film.id}.linedate`,
                                                                        line1: `films.${film.id}.line1`,
                                                                        line2: film.line2 ? `films.${film.id}.line2` : undefined,
                                                                        season: film.season ? `films.${film.id}.season` : undefined,
                                                                        source: 'home',
                                                                    });
                                                                }}
                                                            />

                                                            <div 
                                                                className="home_film_repost home_film_action" 
                                                                data-tooltip={t('tooltip.share')}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setShareModal({ isOpen: true, film: film });
                                                                }}
                                                            />
                                                            <div 
                                                                className="home_film_remuve home_film_action" 
                                                                data-tooltip={t('tooltip.dislike')}
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </div>

                                                        <div className="home_film_text">
                                                            <div className="home_film_rating">{film.rating}</div>
                                                            <div className="home_film_line">
                                                                <div className="home_film_line1">
                                                                {film.linedate && <span className="home_film_date">{film.linedate}</span>}
                                                                {film.line1 && ` ${film.line1}`}
                                                            </div>
                                                            {film.line2 && <div className="home_film_line2">{film.line2}</div>}
                                                        </div>
                                                        {film.season && <div className="home_film_season">{film.season}</div>}
                                                        </div>
                                                    </div>

                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))
                        )}
                        {promoData && (
                            <div className="home_ad_block">
                                <div className="home_ad" style={{ backgroundImage: `url(${promoData.imageUrl})` }}>
                                    <div className="home_ad_text_block">
                                        {promoData.badgeText && (
                                            <div className="home_ad_new_block">
                                                {promoData.badgeText}
                                            </div>
                                        )}
                                        <div className="home_ad_title">
                                            {promoData.title}
                                        </div>
                                        <div className="home_ad_line_block">
                                            {promoData.rating && (
                                                <div className="home_ad_line_rating">{promoData.rating}</div>
                                            )}
                                            {promoData.year && (
                                                <div className="home_ad_line_time">{promoData.year}</div>
                                            )}
                                            {promoData.genre && (
                                                <div className="home_ad_line_genre">
                                                    {promoData.genre}
                                                </div>
                                            )}
                                            {promoData.duration && (
                                                <div className="home_ad_line_time">
                                                    {promoData.duration}
                                                </div>
                                            )}
                                        </div>

                                        {promoData.description && (
                                            <div className="home_ad_subtitle">
                                                {promoData.description}
                                            </div>
                                        )}

                                        <div className="home_ad_button">
                                            {promoData.buttonText && (
                                                <div className="home_ad_premium_button">
                                                    {promoData.buttonText}
                                                </div>
                                            )}
                                            <div className="home_ad_info_button"></div>
                                            <div
                                                className={`home_ad_save_button ${promoData.isSaved ? "active" : ""}`}
                                                onClick={() => setPromoData({...promoData, isSaved: !promoData.isSaved})}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
                {filteredContent.map(cat =>
                    cat.subcategories
                        .map(sub => (
                            <div key={sub.id} className="home_block">

                                <div className="home_block_header">
                                    <div className="home_block_title">{sub.title}</div>
                                    <div className="home_block_arrow"></div>
                                </div>
                                <div className={`films_scroll_btn left ${!scrollStates[sub.id]?.isScrollable || (scrollStates[sub.id]?.isAtStart ?? true) ? 'hidden' : ''}`} onClick={() => scrollFilms(sub.id, 'left')}/>
                                <div className={`films_scroll_btn right ${!scrollStates[sub.id]?.isScrollable || (scrollStates[sub.id]?.isAtEnd ?? false) ? 'hidden' : ''}`} onClick={() => scrollFilms(sub.id, 'right')}/>
                                <div className="home_films_wrapper"   onMouseDown={(e) => handleFilmsMouseDown(e, sub.id)} onMouseLeave={() => handleFilmsMouseLeave()}  onMouseUp={() => handleFilmsMouseUp()}
                                     onMouseMove={(e) => handleFilmsMouseMove(e, sub.id)}  onScroll={() => handleScroll(sub.id)}  ref={setFilmRef(sub.id)}>
                                    <div className="home_films">
                                        {sub.films.map(film => (
                                            <div 
                                                key={film.id} 
                                                className="home_film_card" 
                                                onMouseEnter={() => setSelectedItemId(film.id)} 
                                                onMouseLeave={() => setSelectedItemId(null)}
                                                onClick={(e) => {
                                                    if (!e.target.closest('.home_film_action')) {
                                                        navigate(`/movie/${film.id}`);
                                                    }
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <img src={selectedItemId === film.id ? film.hoverImage : film.image} alt={film.title} className="film_img"/>
                                                <div className="home_film_header">
                                                    <div
                                                        className={`home_film_save home_film_action ${savedFilms.includes(film.id) ? "active" : ""}`}
                                                        data-tooltip={t('tooltip.watch')}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleFavorite({
                                                                id: film.id,
                                                                image: film.image,
                                                                hoverImage: film.hoverImage,
                                                                rating: film.rating,
                                                                linedate: film.linedate,
                                                                line1: film.line1,
                                                                line2: film.line2,
                                                                season: film.season,
                                                                source: 'home',
                                                            });
                                                        }}
                                                    />



                                                    <div 
                                                        className="home_film_repost home_film_action" 
                                                        data-tooltip={t('tooltip.share')}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShareModal({ isOpen: true, film: film });
                                                        }}
                                                    />
                                                    <div 
                                                        className="home_film_remuve home_film_action" 
                                                        data-tooltip={t('tooltip.dislike')}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>

                                                <div className="home_film_text">
                                                    <div className="home_film_rating">{film.rating}</div>
                                                    <div className="home_film_line">
                                                        <div className="home_film_line1">
                                                            {film.linedate && <span className="home_film_date">{film.linedate}</span>}
                                                            {film.line1 && ` ${film.line1}`}
                                                        </div>
                                                        {film.line2 && <div className="home_film_line2">{film.line2}</div>}
                                                    </div>
                                                    {film.season && <div className="home_film_season">{film.season}</div>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                )}

            </div>
            <ShareModal
                isOpen={shareModal.isOpen}
                onClose={() => setShareModal({ isOpen: false, film: null })}
                filmTitle={shareModal.film?.title || null}
                filmTitleKey={shareModal.film?.line1 ? `films.${shareModal.film.id}.line1` : null}
                filmId={shareModal.film?.id}
            />
        </div>
    );
};