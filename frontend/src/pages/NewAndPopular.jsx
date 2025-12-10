import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { fakeContent } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';
import './NewAndPopular.css';

export const NewAndPopular = () => {
    const collectionsRef = useRef(null);
    const [scrollState, setScrollState] = useState({
        isAtStart: true,
        isAtEnd: false,
        isScrollable: false
    });
    const scrollTimeoutRef = useRef(null);
    const [seriesData, setSeriesData] = useState([]);
    const [filmsData, setFilmsData] = useState([]);
    const filmsRefs = useRef({});
    const [scrollStates, setScrollStates] = useState({});
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [shareModal, setShareModal] = useState({ isOpen: false, film: null });
    const { favorites, toggleFavorite } = useFavorites();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const collections = [
        {
            id: 1,
            nameKey: 'newAndPopular.collectionsList.dystopia',
            image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1765288109/Frame_101_lkkf1x.png'
        },
        {
            id: 2,
            nameKey: 'newAndPopular.collectionsList.antiheroes',
            image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1765288110/Frame_101_1_vek5dj.png'
        },
        {
            id: 3,
            nameKey: 'newAndPopular.collectionsList.powerOfFriendship',
            image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1765288110/Frame_101_2_ijcn0y.png'
        },
        {
            id: 4,
            nameKey: 'newAndPopular.collectionsList.romance',
            image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1765290991/Frame_101_p1jsxz.png'
        }
    ];

    const scrollCollections = (direction) => {
        if (!collectionsRef.current) return;
        const list = collectionsRef.current.querySelector('.popular_collections_list');
        if (!list) return;
        const card = list.querySelector('.collection_item');
        if (!card) return;
        
        const cardWidth = card.offsetWidth;
        const gap = 30;
        const scrollAmount = cardWidth + gap;

        collectionsRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    const handleCollectionsScroll = () => {
        if (!collectionsRef.current) return;
        const el = collectionsRef.current;
        const scrollWidth = el.scrollWidth;
        const clientWidth = el.clientWidth;
        const scrollLeft = el.scrollLeft;
        const isScrollable = scrollWidth > clientWidth + 5;

        const isAtStart = !isScrollable || scrollLeft <= 5;
        const isAtEnd = !isScrollable || scrollLeft + clientWidth >= scrollWidth - 5;

        setScrollState(prevState => {
            if (prevState.isAtStart === isAtStart && 
                prevState.isAtEnd === isAtEnd && 
                prevState.isScrollable === isScrollable) {
                return prevState;
            }
            return {
                isAtStart,
                isAtEnd,
                isScrollable
            };
        });
    };
    
    const handleScrollDebounced = () => {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
            requestAnimationFrame(handleCollectionsScroll);
        }, 16);
    };

    useEffect(() => {
        let rafId = null;
        let timeoutId = null;
        let scrollTimeoutId = null;
        
        const checkScroll = () => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                handleCollectionsScroll();
            });
        };
        
        checkScroll();
        
        const handleResize = () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                checkScroll();
            }, 100);
        };
        
        const handleScrollDebounced = () => {
            if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
            scrollTimeoutId = setTimeout(() => {
                requestAnimationFrame(() => {
                    handleCollectionsScroll();
                });
            }, 16);
        };
        
        window.addEventListener('resize', handleResize);
        
        timeoutId = setTimeout(checkScroll, 100);
        
        const checkImagesLoaded = () => {
            if (!collectionsRef.current) return;
            const images = collectionsRef.current.querySelectorAll('img');
            if (images && images.length > 0) {
                let loadedCount = 0;
                const totalImages = images.length;
                const onImageLoad = () => {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        setTimeout(checkScroll, 100);
                    }
                };
                images.forEach(img => {
                    if (img.complete) {
                        onImageLoad();
                    } else {
                        img.addEventListener('load', onImageLoad, { once: true });
                        img.addEventListener('error', onImageLoad, { once: true });
                    }
                });
            }
        };
        
        setTimeout(checkImagesLoaded, 50);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            if (timeoutId) clearTimeout(timeoutId);
            if (rafId) cancelAnimationFrame(rafId);
            if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
        };
    }, [collections]);

    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const handleMouseDown = (e) => {
        if (!collectionsRef.current) return;
        if (e.target.closest('.popular_collections_scroll_btn')) return;
        isDown.current = true;
        const el = collectionsRef.current;
        startX.current = e.pageX - el.offsetLeft;
        scrollLeft.current = el.scrollLeft;
    };

    const handleMouseLeave = () => {
        isDown.current = false;
    };

    const handleMouseUp = () => {
        isDown.current = false;
        requestAnimationFrame(() => {
            handleCollectionsScroll();
        });
    };

    const handleMouseMove = (e) => {
        if (!isDown.current || !collectionsRef.current) return;
        e.preventDefault();
        const el = collectionsRef.current;
        const x = e.pageX - el.offsetLeft;
        const walk = (x - startX.current) * 2;
        el.scrollLeft = scrollLeft.current - walk;
        requestAnimationFrame(() => {
            handleCollectionsScroll();
        });
    };

    const setFilmRef = (id) => (el) => {
        filmsRefs.current[id] = el;
    };

    const scrollFilms = (id, direction) => {
        const el = filmsRefs.current[id];
        if (!el) return;
        const filmCard = el.querySelector('.popular_film_card');
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
            const scrollWidth = el.scrollWidth;
            const clientWidth = el.clientWidth;
            const scrollLeft = el.scrollLeft;
            const isScrollable = scrollWidth > clientWidth + 2;
            const isAtStart = !isScrollable || scrollLeft <= 2;
            const isAtEnd = !isScrollable || scrollLeft + clientWidth >= scrollWidth - 2;
            setScrollStates(prev => ({
                ...prev,
                [id]: {
                    isAtStart,
                    isAtEnd,
                    isScrollable,
                }
            }));
        }
    };

    const handleFilmsMouseDown = (e, id) => {
        isDown.current = true;
        const el = filmsRefs.current[id];
        startX.current = e.pageX - el.offsetLeft;
        scrollLeft.current = el.scrollLeft;
    };

    const handleFilmsMouseLeave = () => {
        isDown.current = false;
    };

    const handleFilmsMouseUp = () => {
        isDown.current = false;
    };

    const handleFilmsMouseMove = (e, id) => {
        if (!isDown.current) return;
        e.preventDefault();
        const el = filmsRefs.current[id];
        const x = e.pageX - el.offsetLeft;
        const walk = (x - startX.current) * 2;
        el.scrollLeft = scrollLeft.current - walk;
    };

    useEffect(() => {
        const loadSeriesData = async () => {
            try {
                const allContent = await fakeContent(['Серіали']);
                const newSeries = allContent
                    .find(cat => cat.category === 'Серіали')
                    ?.subcategories
                    .find(sub => sub.id === 'new-series');
                if (newSeries) {
                    setSeriesData(newSeries.films || []);
                }
            } catch (err) {
                console.error('Ошибка загрузки данных о сериалах:', err);
            }
        };
        loadSeriesData();
    }, []);

    useEffect(() => {
        const loadFilmsData = async () => {
            try {
                const allContent = await fakeContent(['Фільми']);
                const newFilms = allContent
                    .find(cat => cat.category === 'Фільми')
                    ?.subcategories
                    .find(sub => sub.id === 'new-films');
                if (newFilms) {
                    setFilmsData(newFilms.films || []);
                } else {
                    // Если нет new-films, берем первую подкатегорию из Фільми
                    const filmsCategory = allContent.find(cat => cat.category === 'Фільми');
                    if (filmsCategory && filmsCategory.subcategories && filmsCategory.subcategories.length > 0) {
                        setFilmsData(filmsCategory.subcategories[0].films || []);
                    }
                }
            } catch (err) {
                console.error('Ошибка загрузки данных о фильмах:', err);
            }
        };
        loadFilmsData();
    }, []);

    useEffect(() => {
        const filmIds = ['new-series', 'new-films'];
        filmIds.forEach(id => {
            requestAnimationFrame(() => {
                handleScroll(id);
            });
        });
        const handleResize = () => {
            filmIds.forEach(id => {
                requestAnimationFrame(() => {
                    handleScroll(id);
                });
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [seriesData, filmsData]);

    return (
        <div className="popular_page">
                <div className="popular_page_title"><Trans i18nKey="newAndPopular.pageTitle" /></div>
                <div className="popular_ad_block">
                    <div className="popular_wensday_ad">
                        <div className="popular_ad_text_block">
                            <div className="popular_ad_new_block">
                                <Trans i18nKey="ad.newSeason" />
                            </div>
                            <div className="popular_ad_title">
                                <Trans i18nKey="ad.title" />
                            </div>
                            <div className="popular_ad_line_block">
                                <div className="popular_ad_line_rating">8.0</div>
                                <div className="popular_ad_line_time">2022-2025</div>
                                <div className="popular_ad_line_genre">
                                    <Trans i18nKey="ad.genre" />
                                </div>
                                <div className="popular_ad_line_time">
                                    <Trans i18nKey="ad.duration" />
                                </div>
                            </div>
                            <div className="popular_ad_subtitle">
                                <Trans i18nKey="ad.description" />
                            </div>
                            <div className="popular_ad_button">
                                <div className="popular_ad_premium_button">
                                    <Trans i18nKey="ad.premiumButton" />
                                </div>
                                <div className="popular_ad_info_button"></div>
                                <div className="popular_ad_save_button"></div>
                            </div>
                        </div>
                    </div>
                </div>
            {/* Collections Section */}
            <div className="popular_collections_section">
                <div className="popular_collections_header">
                    <h2 className="popular_collections_title"><Trans i18nKey="newAndPopular.collections" /></h2>
                    <div className="popular_collections_arrow"></div>
                </div>
                <div
                    className={`popular_collections_scroll_btn left ${!scrollState.isScrollable || scrollState.isAtStart ? 'hidden' : ''}`}
                    onClick={() => scrollCollections('left')}
                />
                <div
                    className={`popular_collections_scroll_btn right ${!scrollState.isScrollable || scrollState.isAtEnd ? 'hidden' : ''}`}
                    onClick={() => scrollCollections('right')}
                />
                <div
                    className="popular_collections_wrapper"
                    ref={collectionsRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onScroll={handleScrollDebounced}
                >
                    <div
                        className="popular_collections_list"
                    >
                        {collections.map((collection) => (
                            <div key={collection.id} className="collection_item">
                                <div className="collection_card">
                                    <div className="collection_badge"><Trans i18nKey="newAndPopular.collectionBadge" /></div>
                                    <img
                                        src={collection.image}
                                        alt={t(collection.nameKey)}
                                        className="collection_image"
                                        draggable="false"
                                        onDragStart={(e) => e.preventDefault()}
                                    />
                                    <h3 className="collection_name"><Trans i18nKey={collection.nameKey} /></h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Новинки сериалов Section */}
            {seriesData.length > 0 && (
                <div className="popular_films_block">
                    <div className="popular_films_header">
                        <div className="popular_films_title"><Trans i18nKey="subcategories.new-series" /></div>
                        <div className="popular_films_arrow"></div>
                    </div>
                    <div className={`popular_films_scroll_btn left ${!scrollStates['new-series']?.isScrollable || (scrollStates['new-series']?.isAtStart ?? true) ? 'hidden' : ''}`} onClick={() => scrollFilms('new-series', 'left')}/>
                    <div className={`popular_films_scroll_btn right ${!scrollStates['new-series']?.isScrollable || (scrollStates['new-series']?.isAtEnd ?? false) ? 'hidden' : ''}`} onClick={() => scrollFilms('new-series', 'right')}/>
                    <div className="popular_films_wrapper" onMouseDown={(e) => handleFilmsMouseDown(e, 'new-series')} onMouseLeave={() => handleFilmsMouseLeave()} onMouseUp={() => handleFilmsMouseUp()}
                         onMouseMove={(e) => handleFilmsMouseMove(e, 'new-series')} onScroll={() => requestAnimationFrame(() => handleScroll('new-series'))} ref={setFilmRef('new-series')}>
                        <div className="popular_films">
                            {seriesData.map(film => (
                                <div 
                                    key={film.id} 
                                    className="popular_film_card" 
                                    onMouseEnter={() => setSelectedItemId(film.id)} 
                                    onMouseLeave={() => setSelectedItemId(null)}
                                    onClick={(e) => {
                                        if (!e.target.closest('.popular_film_action')) {
                                            navigate(`/movie/${film.id}`);
                                        }
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img src={selectedItemId === film.id ? film.hoverImage : film.image} alt={film.title} className="popular_film_img"/>
                                    <div className="popular_film_header">
                                        <div
                                            className={`popular_film_save popular_film_action ${favorites.some(f => f.id === film.id) ? "active" : ""}`}
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
                                                    source: 'new-popular',
                                                });
                                            }}
                                        />
                                        <div 
                                            className="popular_film_repost popular_film_action" 
                                            data-tooltip={t('tooltip.share')}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShareModal({ isOpen: true, film: film });
                                            }}
                                        />
                                        <div 
                                            className="popular_film_remuve popular_film_action" 
                                            data-tooltip={t('tooltip.dislike')}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <div className="popular_film_text">
                                        <div className="popular_film_rating">{film.rating}</div>
                                        <div className="popular_film_line">
                                            <div className="popular_film_line1"><span className="popular_film_date"><Trans i18nKey={`films.${film.id}.linedate`} /></span>      <Trans i18nKey={`films.${film.id}.line1`} /></div>
                                            <div className="popular_film_line2"><Trans i18nKey={`films.${film.id}.line2`} /></div>
                                        </div>
                                        <div className="popular_film_season"><Trans i18nKey={`films.${film.id}.season`} /></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

                <div className="popular_ad_block">
                    <div className="popular_superman_ad">
                        <div className="popular_ad_text_block">
                            <div className="popular_ad_new_block">
                                <Trans i18nKey="newAndPopular.supermanAd.new" />
                            </div>
                            <div className="popular_ad_title">
                                <Trans i18nKey="ad.title" />
                            </div>
                            <div className="popular_ad_line_block">
                                <div className="popular_ad_line_rating_gold">7.2</div>
                                <div className="popular_ad_line_time">2025</div>
                                <div className="popular_ad_line_genre">
                                    <Trans i18nKey="newAndPopular.supermanAd.genre" />
                                </div>
                                <div className="popular_ad_line_time">
                                    • 2h 9m
                                </div>
                            </div>
                            <div className="popular_ad_subtitle">
                                <Trans i18nKey="newAndPopular.supermanAd.description" />
                            </div>
                            <div className="popular_ad_button">
                                <div className="popular_ad_premium_button">
                                    <Trans i18nKey="ad.premiumButton" />
                                </div>
                                <div className="popular_ad_info_button"></div>
                                <div className="popular_ad_save_button"></div>
                            </div>
                        </div>
                    </div>
                </div>



            {/* Новинки фильмов Section */}
            {filmsData.length > 0 && (
                <div className="popular_films_block">
                    <div className="popular_films_header">
                        <div className="popular_films_title"><Trans i18nKey="subcategories.new-films" /></div>
                        <div className="popular_films_arrow"></div>
                    </div>
                    <div className={`popular_films_scroll_btn left ${!scrollStates['new-films']?.isScrollable || (scrollStates['new-films']?.isAtStart ?? true) ? 'hidden' : ''}`} onClick={() => scrollFilms('new-films', 'left')}/>
                    <div className={`popular_films_scroll_btn right ${!scrollStates['new-films']?.isScrollable || (scrollStates['new-films']?.isAtEnd ?? false) ? 'hidden' : ''}`} onClick={() => scrollFilms('new-films', 'right')}/>
                    <div className="popular_films_wrapper" onMouseDown={(e) => handleFilmsMouseDown(e, 'new-films')} onMouseLeave={() => handleFilmsMouseLeave()} onMouseUp={() => handleFilmsMouseUp()}
                         onMouseMove={(e) => handleFilmsMouseMove(e, 'new-films')} onScroll={() => requestAnimationFrame(() => handleScroll('new-films'))} ref={setFilmRef('new-films')}>
                        <div className="popular_films">
                            {filmsData.map(film => (
                                <div 
                                    key={film.id} 
                                    className="popular_film_card" 
                                    onMouseEnter={() => setSelectedItemId(film.id)} 
                                    onMouseLeave={() => setSelectedItemId(null)}
                                    onClick={(e) => {
                                        if (!e.target.closest('.popular_film_action')) {
                                            navigate(`/movie/${film.id}`);
                                        }
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img src={selectedItemId === film.id ? film.hoverImage : film.image} alt={film.title} className="popular_film_img"/>
                                    <div className="popular_film_header">
                                        <div
                                            className={`popular_film_save popular_film_action ${favorites.some(f => f.id === film.id) ? "active" : ""}`}
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
                                                    source: 'new-popular',
                                                });
                                            }}
                                        />
                                        <div 
                                            className="popular_film_repost popular_film_action" 
                                            data-tooltip={t('tooltip.share')}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShareModal({ isOpen: true, film: film });
                                            }}
                                        />
                                        <div 
                                            className="popular_film_remuve popular_film_action" 
                                            data-tooltip={t('tooltip.dislike')}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <div className="popular_film_text">
                                        <div className="popular_film_rating">{film.rating}</div>
                                        <div className="popular_film_line">
                                            <div className="popular_film_line1"><span className="popular_film_date"><Trans i18nKey={`films.${film.id}.linedate`} /></span>      <Trans i18nKey={`films.${film.id}.line1`} /></div>
                                            <div className="popular_film_line2"><Trans i18nKey={`films.${film.id}.line2`} /></div>
                                        </div>
                                        {film.season && (
                                            <div className="popular_film_season"><Trans i18nKey={`films.${film.id}.season`} /></div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

