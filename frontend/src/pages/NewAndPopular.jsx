import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNewPopularPageData } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';
import { ShareModal } from '../components/modal/ShareModal';
import './NewAndPopular.css';

export const NewAndPopular = () => {
    const collectionsRef = useRef(null);
    const [scrollState, setScrollState] = useState({
        isAtStart: true,
        isAtEnd: false,
        isScrollable: false
    });
    const scrollTimeoutRef = useRef(null);
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const filmsRefs = useRef({});
    const [scrollStates, setScrollStates] = useState({});
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [shareModal, setShareModal] = useState({ isOpen: false, film: null });
    const { isFavorite, toggleFavorite } = useFavorites();
    const navigate = useNavigate();

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
    }, [pageData?.collections]);

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
        const loadPageData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getNewPopularPageData();
                setPageData(data);
            } catch (err) {
                setError(err.message || 'Ошибка загрузки данных');
                setPageData(null);
            } finally {
                setLoading(false);
            }
        };
        loadPageData();
    }, []);

    useEffect(() => {
        if (!pageData) return;
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
    }, [pageData]);

    if (loading) {
        return (
            <div className="popular_page">
                <div className="popular_page_title"></div>
                <div style={{ padding: '20px', textAlign: 'center' }}>Загрузка...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="popular_page">
                <div className="popular_page_title"></div>
                <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
                    Ошибка: {error}
                </div>
            </div>
        );
    }

    if (!pageData) {
        return (
            <div className="popular_page">
                <div className="popular_page_title"></div>
                <div style={{ padding: '20px', textAlign: 'center' }}>Нет данных</div>
            </div>
        );
    }


    const transformTitleToFilm = (title) => {
        let year = '';
        if (title.releaseDate) {
            if (typeof title.releaseDate === 'string') {
                year = title.releaseDate.substring(0, 4);
            } else if (title.releaseDate.year) {
                year = String(title.releaseDate.year);
            }
        }
        
        return {
            id: title.id,
            title: title.title || '',
            image: title.posterUrl || '',
            hoverImage: title.posterUrl || '',
            rating: title.rating ? parseFloat(title.rating).toFixed(1) : null,
            linedate: year,
            line1: title.genres && Array.isArray(title.genres) ? title.genres.join(", ") : '',
            line2: '',
            season: title.type === 'SERIES' ? '1 Сезон' : '',
            isSaved: title.isSaved || false
        };
    };

    const newSeriesFilms = pageData.newSeries?.map(transformTitleToFilm) || [];
    const newMoviesFilms = pageData.newMovies?.map(transformTitleToFilm) || [];

    return (
        <div className="popular_page">
            <div className="popular_page_title"></div>
            
            {pageData.promo1 && (
                <div className="popular_ad_block">
                    <div className="popular_wensday_ad" style={{ backgroundImage: `url(${pageData.promo1.imageUrl})` }}>
                        <div className="popular_ad_text_block">
                            {pageData.promo1.badgeText && (
                                <div className="popular_ad_new_block">{pageData.promo1.badgeText}</div>
                            )}
                            <div className="popular_ad_title">{pageData.promo1.title}</div>
                            <div className="popular_ad_line_block">
                                {pageData.promo1.rating && (
                                    <div className="popular_ad_line_rating">{pageData.promo1.rating}</div>
                                )}
                                {pageData.promo1.year && (
                                    <div className="popular_ad_line_time">{pageData.promo1.year}</div>
                                )}
                                {pageData.promo1.genre && (
                                    <div className="popular_ad_line_genre">{pageData.promo1.genre}</div>
                                )}
                                {pageData.promo1.duration && (
                                    <div className="popular_ad_line_time">{pageData.promo1.duration}</div>
                                )}
                            </div>
                            {pageData.promo1.description && (
                                <div className="popular_ad_subtitle">{pageData.promo1.description}</div>
                            )}
                            <div className="popular_ad_button">
                                {pageData.promo1.buttonText && (
                                    <div className="popular_ad_premium_button">{pageData.promo1.buttonText}</div>
                                )}
                                <div className="popular_ad_info_button"></div>
                                <div 
                                    className={`popular_ad_save_button ${pageData.promo1.isSaved ? 'active' : ''}`}
                                    onClick={async () => await toggleFavorite(pageData.promo1.id)}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {pageData.collectionsTitle && (
                <div className="popular_collections_section">
                    <div className="popular_collections_header">
                        <h2 className="popular_collections_title">{pageData.collectionsTitle}</h2>
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
                    <div className="popular_collections_list">
                        {pageData.collections && pageData.collections.length > 0 ? (
                            pageData.collections.map((collection, index) => {
                            const collectionImage = collection.items?.find(item => item.posterUrl)?.posterUrl || 
                                                   (collection.items && collection.items.length > 0 ? collection.items[0].posterUrl : null);
                            
                            return (
                                <div key={index} className="collection_item">
                                    <div className="collection_card">
                                        <div className="collection_badge"></div>
                                        {collectionImage ? (
                                            <img
                                                src={collectionImage}
                                                alt={collection.title}
                                                className="collection_image"
                                                draggable="false"
                                                onDragStart={(e) => e.preventDefault()}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="collection_image" style={{ 
                                                backgroundColor: '#333', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                color: '#fff'
                                            }}>
                                                {collection.title}
                                            </div>
                                        )}
                                        <h3 className="collection_name">{collection.title}</h3>
                                        {collection.description && (
                                            <p className="collection_description" style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                                                {collection.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                            })
                        ) : (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                                Коллекции временно недоступны
                            </div>
                        )}
                    </div>
                </div>
            </div>
            )}

            {newSeriesFilms.length > 0 && (
                <div className="popular_films_block">
                    <div className="popular_films_header">
                        <div className="popular_films_title">{pageData.newSeriesTitle}</div>
                        <div className="popular_films_arrow"></div>
                    </div>
                    <div className={`popular_films_scroll_btn left ${!scrollStates['new-series']?.isScrollable || (scrollStates['new-series']?.isAtStart ?? true) ? 'hidden' : ''}`} onClick={() => scrollFilms('new-series', 'left')}/>
                    <div className={`popular_films_scroll_btn right ${!scrollStates['new-series']?.isScrollable || (scrollStates['new-series']?.isAtEnd ?? false) ? 'hidden' : ''}`} onClick={() => scrollFilms('new-series', 'right')}/>
                    <div className="popular_films_wrapper" onMouseDown={(e) => handleFilmsMouseDown(e, 'new-series')} onMouseLeave={() => handleFilmsMouseLeave()} onMouseUp={() => handleFilmsMouseUp()}
                         onMouseMove={(e) => handleFilmsMouseMove(e, 'new-series')} onScroll={() => requestAnimationFrame(() => handleScroll('new-series'))} ref={setFilmRef('new-series')}>
                        <div className="popular_films">
                            {newSeriesFilms.map(film => (
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
                                            className={`popular_film_save popular_film_action ${isFavorite(film.id) ? "active" : ""}`}
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                await toggleFavorite(film.id);
                                            }}
                                        />
                                        <div 
                                            className="popular_film_repost popular_film_action" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShareModal({ isOpen: true, film: film });
                                            }}
                                        />
                                        <div 
                                            className="popular_film_remuve popular_film_action" 
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <div className="popular_film_text">
                                        {film.rating && (
                                            <div className="popular_film_rating">{film.rating}</div>
                                        )}
                                        <div className="popular_film_line">
                                            <div className="popular_film_line1">
                                                {film.linedate && <span className="popular_film_date">{film.linedate}</span>}
                                                {film.line1 && <span> {film.line1}</span>}
                                            </div>
                                            {film.line2 && (
                                                <div className="popular_film_line2">{film.line2}</div>
                                            )}
                                        </div>
                                        {film.season && (
                                            <div className="popular_film_season">{film.season}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {pageData.promo2 && (
                <div className="popular_ad_block">
                    <div className="popular_superman_ad" style={{ backgroundImage: `url(${pageData.promo2.imageUrl})` }}>
                        <div className="popular_ad_text_block">
                            {pageData.promo2.badgeText && (
                                <div className="popular_ad_new_block">{pageData.promo2.badgeText}</div>
                            )}
                            <div className="popular_ad_title">{pageData.promo2.title}</div>
                            <div className="popular_ad_line_block">
                                {pageData.promo2.rating && (
                                    <div className="popular_ad_line_rating_gold">{pageData.promo2.rating}</div>
                                )}
                                {pageData.promo2.year && (
                                    <div className="popular_ad_line_time">{pageData.promo2.year}</div>
                                )}
                                {pageData.promo2.genre && (
                                    <div className="popular_ad_line_genre">{pageData.promo2.genre}</div>
                                )}
                                {pageData.promo2.duration && (
                                    <div className="popular_ad_line_time">{pageData.promo2.duration}</div>
                                )}
                            </div>
                            {pageData.promo2.description && (
                                <div className="popular_ad_subtitle">{pageData.promo2.description}</div>
                            )}
                            <div className="popular_ad_button">
                                {pageData.promo2.buttonText && (
                                    <div className="popular_ad_premium_button">{pageData.promo2.buttonText}</div>
                                )}
                                <div className="popular_ad_info_button"></div>
                                <div 
                                    className={`popular_ad_save_button ${pageData.promo2.isSaved ? 'active' : ''}`}
                                    onClick={async () => await toggleFavorite(pageData.promo2.id)}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {newMoviesFilms.length > 0 && (
                <div className="popular_films_block">
                    <div className="popular_films_header">
                        <div className="popular_films_title">{pageData.newMoviesTitle}</div>
                        <div className="popular_films_arrow"></div>
                    </div>
                    <div className={`popular_films_scroll_btn left ${!scrollStates['new-films']?.isScrollable || (scrollStates['new-films']?.isAtStart ?? true) ? 'hidden' : ''}`} onClick={() => scrollFilms('new-films', 'left')}/>
                    <div className={`popular_films_scroll_btn right ${!scrollStates['new-films']?.isScrollable || (scrollStates['new-films']?.isAtEnd ?? false) ? 'hidden' : ''}`} onClick={() => scrollFilms('new-films', 'right')}/>
                    <div className="popular_films_wrapper" onMouseDown={(e) => handleFilmsMouseDown(e, 'new-films')} onMouseLeave={() => handleFilmsMouseLeave()} onMouseUp={() => handleFilmsMouseUp()}
                         onMouseMove={(e) => handleFilmsMouseMove(e, 'new-films')} onScroll={() => requestAnimationFrame(() => handleScroll('new-films'))} ref={setFilmRef('new-films')}>
                        <div className="popular_films">
                            {newMoviesFilms.map(film => (
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
                                            className={`popular_film_save popular_film_action ${isFavorite(film.id) ? "active" : ""}`}
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                await toggleFavorite(film.id);
                                            }}
                                        />
                                        <div 
                                            className="popular_film_repost popular_film_action" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShareModal({ isOpen: true, film: film });
                                            }}
                                        />
                                        <div 
                                            className="popular_film_remuve popular_film_action" 
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <div className="popular_film_text">
                                        {film.rating && (
                                            <div className="popular_film_rating">{film.rating}</div>
                                        )}
                                        <div className="popular_film_line">
                                            <div className="popular_film_line1">
                                                {film.linedate && <span className="popular_film_date">{film.linedate}</span>}
                                                {film.line1 && <span> {film.line1}</span>}
                                            </div>
                                            {film.line2 && (
                                                <div className="popular_film_line2">{film.line2}</div>
                                            )}
                                        </div>
                                        {film.season && (
                                            <div className="popular_film_season">{film.season}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <ShareModal
                isOpen={shareModal.isOpen}
                onClose={() => setShareModal({ isOpen: false, film: null })}
                filmTitle={shareModal.film?.title || null}
                filmId={shareModal.film?.id}
            />
        </div>
    );
};

