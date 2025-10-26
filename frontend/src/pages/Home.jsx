import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import { useLocation, Link } from 'react-router-dom';
import { fakeCategories, fakeContent, fakeSlides, getMenuItems, getWatchModeItems, getStarsActors } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';
import {Trans, useTranslation} from 'react-i18next';
import '../i18n/i18n';

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
    const { t } = useTranslation();
    const { favorites, toggleFavorite } = useFavorites();
    const location = useLocation();


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
                setStarsActors(await getStarsActors());
            } catch (err) {
                console.error("Помилка завантаження допоміжних даних:", err);
            }
        };

        const loadInitialData = async () => {
            try {
                const loadedSlides = await fakeSlides();
                const loadedCategories = await fakeCategories();

                setSlides(loadedSlides);
                setCategories(loadedCategories);
                setOriginalCategories(loadedCategories);

                const allCategoryNames = loadedCategories.map(cat => cat.name);
                const loadedAllContent = await fakeContent(allCategoryNames);

                setAllContent(loadedAllContent);
                setFilteredContent(loadedAllContent);

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
                const slideWidth = 900;
                const gap = 20;
                const wrapperWidth = wrapper.offsetWidth;
                const centerOffset = (wrapperWidth - slideWidth) / 2;
                const slideOffset = currentSlide * (slideWidth + gap);
                track.style.transform = `translateX(${centerOffset - slideOffset}px)`;
            }
        };
        updatePosition();
        const timeoutId = setTimeout(updatePosition, 50);
        return () => clearTimeout(timeoutId);
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
                                {slides.map((slide, index) => (
                                    <Link key={slide.id} to={slide.link} className={`home_carousel_slide ${index === currentSlide ? 'active' : ''}`}>
                                        <div className={`home_slide_background ${slide.className}`}/>
                                        <div className="home_slide_text">
                                            <div className="home_slide_new">
                                                <div className="home_slide_new_title"><Trans i18nKey={slide.new}/></div>
                                            </div>
                                            <div className="home_slide_film_name"><Trans i18nKey={slide.filmname}/></div>
                                            <div className="home_slide_line_block">
                                                <div className="home_slide_line_rating">8.0</div>
                                                <div className="home_slide_line_time">2022-2025</div>
                                                <div className="home_slide_line_genre">
                                                    <Trans i18nKey={slide.genre} />
                                                </div>
                                                <div className="home_slide_line_time">
                                                    <Trans i18nKey={slide.time}/>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                ))}
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
                                        <span><Trans i18nKey={`category.${category.name}`} /></span>
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
                        .filter(sub => ['new-series', 'cartoons-liked'].includes(sub.id))
                        .map(sub => (
                            <div key={sub.id} className="home_block">
                                <div className="home_block_header">
                                    <div className="home_block_title"><Trans i18nKey={`subcategories.${sub.id}`} /></div>
                                    <div className="home_block_arrow"></div>
                                </div>
                                <div className={`films_scroll_btn left ${!scrollStates[sub.id]?.isScrollable || (scrollStates[sub.id]?.isAtStart ?? true) ? 'hidden' : ''}`} onClick={() => scrollFilms(sub.id, 'left')}/>
                                <div className={`films_scroll_btn right ${!scrollStates[sub.id]?.isScrollable || (scrollStates[sub.id]?.isAtEnd ?? false) ? 'hidden' : ''}`} onClick={() => scrollFilms(sub.id, 'right')}/>
                                <div className="home_films_wrapper"   onMouseDown={(e) => handleFilmsMouseDown(e, sub.id)} onMouseLeave={() => handleFilmsMouseLeave()}  onMouseUp={() => handleFilmsMouseUp()}
                                     onMouseMove={(e) => handleFilmsMouseMove(e, sub.id)} onScroll={() => handleScroll(sub.id)} ref={setFilmRef(sub.id)}>

                                    <div className="home_films">
                                        {sub.films.map(film => (
                                            <div key={film.id} className="home_film_card" onMouseEnter={() => setSelectedItemId(film.id)} onMouseLeave={() => setSelectedItemId(null)}>
                                                <img src={selectedItemId === film.id ? film.hoverImage : film.image} alt={film.title} className="film_img"/>
                                                <div className="home_film_header">
                                                    <div
                                                        className={`home_film_save home_film_action ${favorites.some(f => f.id === film.id) ? "active" : ""}`}
                                                        data-tooltip={t('tooltip.watch')}
                                                        onClick={() =>
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
                                                            })
                                                        }
                                                    />

                                                    <div className="home_film_repost home_film_action" data-tooltip={t('tooltip.share')}/>
                                                    <div className="home_film_remuve home_film_action" data-tooltip={t('tooltip.dislike')}/>
                                                </div>

                                                <div className="home_film_text">
                                                    <div className="home_film_rating">{film.rating}</div>
                                                    <div className="home_film_line">
                                                        <div className="home_film_line1"><span className="home_film_date"><Trans i18nKey={`films.${film.id}.linedate`} /></span>      <Trans i18nKey={`films.${film.id}.line1`} /></div>
                                                        <div className="home_film_line2"><Trans i18nKey={`films.${film.id}.line2`} /></div>
                                                    </div>
                                                    <div className="home_film_season"><Trans i18nKey={`films.${film.id}.season`} /></div>
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

                        <div className="home_trailer_block">
                            <div className="home_trailer">
                                <div className="home_trailer_logo"></div>

                                <div className="home_trailer_title"><Trans i18nKey="trailer.title" /></div>
                                <div className="home_trailer_line_block">
                                    <div className="home_trailer_line_rating">8.7</div>
                                    <div className="home_trailer_line_time">2024</div>
                                    <div className="home_trailer_line_genre"><Trans i18nKey="trailer.genre" /></div>
                                    <div className="home_trailer_line_time">•  2h 8m</div>
                                </div>

                                <div className="home_trailer_subtitle"><Trans i18nKey="trailer.description" /></div>

                                <div className="home_trailer_button">
                                    <div className="home_more_trailer_button"><Trans i18nKey="trailer.details" /></div>
                                    <div className={`home_save_trailer_button ${isTrailerSaved ? "active" : ""}`} onClick={toggleTrailerSave}/>
                                    <div className="home_left_trailer_button"></div>
                                    <div className="home_right_trailer_button"></div>
                                </div>

                                <div className="home_trailer_dropdowns">
                                    <div className="home_trailer_dropdown" ref={dropdownRef}>
                                        <button className={`home_trailer_dropdown_button ${isMenuOpen ? 'open' : ''}`} onClick={handleToggleMenu}>
                                            <img src={selectedMenuItem.emoji} alt="" className="menu_trailer_item_icon" />
                                            <span><Trans i18nKey={`trailerMenu.${selectedMenuItem.id}`} /></span>
                                            <img src="https://res.cloudinary.com/da9jqs8yq/image/upload/v1756800196/Status_list.png" alt="" className="menu_trailer_item_icon status_trailer_icon"/>
                                        </button>

                                        {isMenuOpen && (
                                            <div className="home_trailer_dropdown_menu">
                                                {menuItems.map(item => (
                                                    <div key={item.id} className={`home_trailer_dropdown_menu_item ${item.id === selectedItemId ? 'selected' : ''}`} onClick={() => handleMenuItemClick(item.id)}>
                                                        <img src={item.emoji} alt="" className="menu_trailer_item_icon" />
                                                        <span className="home_trailer_dropdown_menu_text">
                                                    <Trans i18nKey={`trailerMenu.${item.id}`} />
                                                    </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="home_trailer_dropdown" ref={dropdownRef2}>
                                        <button className={`home_trailer_dropdown_button ${isWatchModeMenuOpen ? 'open' : ''}`} onClick={handleToggleWatchModeMenu}>
                                            <img src={selectedWatchModeItem.emoji} alt="" className="menu_trailer_item_icon" />
                                            <span><Trans i18nKey={`watchMode.${selectedWatchModeItem.id}`} /></span>
                                            <img src="https://res.cloudinary.com/da9jqs8yq/image/upload/v1756800196/Status_list.png" alt="" className="menu_trailer_item_icon status_trailer_icon"/>
                                        </button>

                                        {isWatchModeMenuOpen && (
                                            <div className="home_trailer_dropdown_menu">
                                                {watchModeItems.map(item => (
                                                    <div key={item.id} className={`home_trailer_dropdown_menu_item ${item.id === selectedWatchModeId ? 'selected' : ''}`} onClick={() => handleWatchModeSelect(item.id)}>
                                                        <img src={item.emoji} alt="" className="menu_trailer_item_icon" />
                                                        <span><Trans i18nKey={`watchMode.${item.id}`} /></span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className={`home_trailer_volume ${isVolumeActive ? "active" : ""}`} onClick={toggleVolume}/>
                                </div>
                            </div>
                        </div>

                        <div className="home_stars_choice_block">
                            <div className="home_stars_header">
                                <div className="home_stars_choice_title"><Trans i18nKey="stars.title" /></div>
                                <div className="home_stars_choice_arrow"></div>
                            </div>

                            <div className="home_stars_actor">
                                {starsActors.map(actor => (
                                    <div key={actor.id} className={actor.className} onClick={() => handleActorClick(actor)}>
                                        <div className="home_stars_text">
                                            <div className="home_stars_collection">
                                                <div className="home_stars_collection_title">
                                                    <Trans i18nKey="stars.collection" />
                                                </div>
                                            </div>
                                            <div className="home_stars_collection_watch">
                                                <Trans i18nKey="stars.watch" />
                                            </div>
                                            <div className="home_stars_collection_watch_actor">
                                                <Trans i18nKey={actor.nameKey} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {filteredContent.map(cat =>
                            cat.subcategories
                                .filter(sub => sub.id === 'drama')
                                .map(sub => (
                                    <div key={sub.id} className="home_block">

                                        <div className="home_block_header">
                                            <div className="home_block_title"><Trans i18nKey={`subcategories.${sub.id}`} /></div>
                                            <div className="home_block_arrow"></div>
                                        </div>
                                        <div className={`films_scroll_btn left ${!scrollStates[sub.id]?.isScrollable || (scrollStates[sub.id]?.isAtStart ?? true) ? 'hidden' : ''}`} onClick={() => scrollFilms(sub.id, 'left')}/>
                                        <div className={`films_scroll_btn right ${!scrollStates[sub.id]?.isScrollable || (scrollStates[sub.id]?.isAtEnd ?? false) ? 'hidden' : ''}`} onClick={() => scrollFilms(sub.id, 'right')}/>
                                        <div className="home_films_wrapper"   onMouseDown={(e) => handleFilmsMouseDown(e, sub.id)} onMouseLeave={() => handleFilmsMouseLeave()} onMouseUp={() => handleFilmsMouseUp()}
                                             onMouseMove={(e) => handleFilmsMouseMove(e, sub.id)} onScroll={() => handleScroll(sub.id)} ref={setFilmRef(sub.id)}>

                                            <div className="home_films">
                                                {sub.films.map(film => (
                                                    <div key={film.id} className="home_film_card" onMouseEnter={() => setSelectedItemId(film.id)} onMouseLeave={() => setSelectedItemId(null)}>
                                                        <img src={selectedItemId === film.id ? film.hoverImage : film.image} alt={film.title} className="film_img"/>
                                                        <div className="home_film_header">
                                                            <div
                                                                className={`home_film_save home_film_action ${favorites.some(f => f.id === film.id) ? "active" : ""}`}
                                                                data-tooltip={t('tooltip.watch')}
                                                                onClick={() =>
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
                                                                    })
                                                                }
                                                            />

                                                            <div className="home_film_repost home_film_action" data-tooltip={t('tooltip.share')}/>
                                                            <div className="home_film_remuve home_film_action" data-tooltip={t('tooltip.dislike')}/>
                                                        </div>

                                                        <div className="home_film_text">
                                                            <div className="home_film_rating">{film.rating}</div>
                                                            <div className="home_film_line">
                                                                <div className="home_film_line1"><span className="home_film_date"><Trans i18nKey={`films.${film.id}.linedate`} /></span>      <Trans i18nKey={`films.${film.id}.line1`} /></div>
                                                                <div className="home_film_line2"><Trans i18nKey={`films.${film.id}.line2`} /></div>
                                                            </div>
                                                            <div className="home_film_season"><Trans i18nKey={`films.${film.id}.season`} /></div>
                                                        </div>
                                                    </div>

                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))
                        )}
                        <div className="home_ad_block">
                            <div className="home_ad">
                                <div className="home_ad_text_block">
                                    <div className="home_ad_new_block">
                                        <Trans i18nKey="ad.newSeason" />
                                    </div>
                                    <div className="home_ad_title">
                                        <Trans i18nKey="ad.title" />
                                    </div>
                                    <div className="home_ad_line_block">
                                        <div className="home_ad_line_rating">8.0</div>
                                        <div className="home_ad_line_time">2022-2025</div>
                                        <div className="home_ad_line_genre">
                                            <Trans i18nKey="ad.genre" />
                                        </div>
                                        <div className="home_ad_line_time">
                                            <Trans i18nKey="ad.duration" />
                                        </div>
                                    </div>

                                    <div className="home_ad_subtitle">
                                        <Trans i18nKey="ad.description" />
                                    </div>

                                    <div className="home_ad_button">
                                        <div className="home_ad_premium_button">
                                            <Trans i18nKey="ad.premiumButton" />
                                        </div>
                                        <div className="home_ad_info_button"></div>
                                        <div
                                            className={`home_ad_save_button ${isSaved ? "active" : ""}`}
                                            onClick={toggleSave}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {filteredContent.map(cat =>
                    cat.subcategories
                        .filter(sub => !['new-series', 'cartoons-liked', 'drama'].includes(sub.id))
                        .map(sub => (
                            <div key={sub.id} className="home_block">

                                <div className="home_block_header">
                                    <div className="home_block_title"><Trans i18nKey={`subcategories.${sub.id}`} /></div>
                                    <div className="home_block_arrow"></div>
                                </div>
                                <div className={`films_scroll_btn left ${!scrollStates[sub.id]?.isScrollable || (scrollStates[sub.id]?.isAtStart ?? true) ? 'hidden' : ''}`} onClick={() => scrollFilms(sub.id, 'left')}/>
                                <div className={`films_scroll_btn right ${!scrollStates[sub.id]?.isScrollable || (scrollStates[sub.id]?.isAtEnd ?? false) ? 'hidden' : ''}`} onClick={() => scrollFilms(sub.id, 'right')}/>
                                <div className="home_films_wrapper"   onMouseDown={(e) => handleFilmsMouseDown(e, sub.id)} onMouseLeave={() => handleFilmsMouseLeave()}  onMouseUp={() => handleFilmsMouseUp()}
                                     onMouseMove={(e) => handleFilmsMouseMove(e, sub.id)}  onScroll={() => handleScroll(sub.id)}  ref={setFilmRef(sub.id)}>
                                    <div className="home_films">
                                        {sub.films.map(film => (
                                            <div key={film.id} className="home_film_card" onMouseEnter={() => setSelectedItemId(film.id)} onMouseLeave={() => setSelectedItemId(null)}>
                                                <img src={selectedItemId === film.id ? film.hoverImage : film.image} alt={film.title} className="film_img"/>
                                                <div className="home_film_header">
                                                    <div
                                                        className={`home_film_save home_film_action ${savedFilms.includes(film.id) ? "active" : ""}`}
                                                        data-tooltip={t('tooltip.watch')}
                                                        onClick={() =>
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
                                                            })
                                                        }


                                                    />



                                                    <div className="home_film_repost home_film_action" data-tooltip={t('tooltip.share')}/>
                                                    <div className="home_film_remuve home_film_action" data-tooltip={t('tooltip.dislike')}/>
                                                </div>

                                                <div className="home_film_text">
                                                    <div className="home_film_rating">{film.rating}</div>
                                                    <div className="home_film_line">
                                                        <div className="home_film_line1"><span className="home_film_date"><Trans i18nKey={`films.${film.id}.linedate`} /></span>      <Trans i18nKey={`films.${film.id}.line1`} /></div>
                                                        <div className="home_film_line2"><Trans i18nKey={`films.${film.id}.line2`} /></div>
                                                    </div>
                                                    <div className="home_film_season"><Trans i18nKey={`films.${film.id}.season`} /></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                )}

            </div>
        </div>
    );
};