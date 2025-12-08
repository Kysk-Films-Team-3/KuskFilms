import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import './HeaderSearch.css';

export const HeaderSearch = ({ popularFilms, popularActors, searchResults, searchQuery }) => {
    const { t } = useTranslation();
    const showPopular = searchQuery === '';
    
    const filmsRef = useRef(null);
    const actorsRef = useRef(null);
    const [scrollStates, setScrollStates] = useState({
        films: { isAtStart: true, isAtEnd: false, isScrollable: false },
        actors: { isAtStart: true, isAtEnd: false, isScrollable: false }
    });
    
    const isDownFilms = useRef(false);
    const isDownActors = useRef(false);
    const startXFilms = useRef(0);
    const startXActors = useRef(0);
    const scrollLeftFilms = useRef(0);
    const scrollLeftActors = useRef(0);

    const scrollItems = (ref, direction) => {
        if (!ref || !ref.current) return;
        
        const el = ref.current;
        const firstItem = el.querySelector('.header_film_card, .header_actor_card');
        if (!firstItem) return;

        const itemWidth = firstItem.offsetWidth;
        const gap = 15;
        const visibleWidth = el.clientWidth;
        const scrollAmount = visibleWidth - itemWidth;

        el.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    const handleScroll = (ref, key) => {
        if (!ref || !ref.current) return;
        const el = ref.current;
        
        const isScrollable = el.scrollWidth > el.clientWidth;
        const scrollLeft = el.scrollLeft;
        const scrollWidth = el.scrollWidth;
        const clientWidth = el.clientWidth;

        const isAtEnd = !isScrollable || Math.abs(scrollWidth - scrollLeft - clientWidth) < 1;
        
        setScrollStates(prev => ({
            ...prev,
            [key]: {
                isAtStart: !isScrollable || scrollLeft === 0,
                isAtEnd: isAtEnd,
                isScrollable: isScrollable,
            }
        }));
    };

    const handleFilmsMouseDown = (e) => {
        if (e.target.tagName === 'IMG' || e.target.closest('a')) {
            e.preventDefault();
        }
        if (!filmsRef.current) return;
        isDownFilms.current = true;
        const el = filmsRef.current;
        startXFilms.current = e.pageX - el.offsetLeft;
        scrollLeftFilms.current = el.scrollLeft;
        el.style.cursor = 'grabbing';
    };

    const handleFilmsMouseLeave = () => {
        isDownFilms.current = false;
        if (filmsRef.current) {
            filmsRef.current.style.cursor = '';
        }
    };

    const handleFilmsMouseUp = () => {
        isDownFilms.current = false;
        if (filmsRef.current) {
            filmsRef.current.style.cursor = '';
        }
    };

    const handleFilmsMouseMove = (e) => {
        if (!isDownFilms.current || !filmsRef.current) return;
        e.preventDefault();
        e.stopPropagation();
        const el = filmsRef.current;
        const x = e.pageX - el.offsetLeft;
        const walk = (x - startXFilms.current) * 2;
        el.scrollLeft = scrollLeftFilms.current - walk;
    };

    const handleActorsMouseDown = (e) => {
        if (e.target.tagName === 'IMG' || e.target.closest('a')) {
            e.preventDefault();
        }
        if (!actorsRef.current) return;
        isDownActors.current = true;
        const el = actorsRef.current;
        startXActors.current = e.pageX - el.offsetLeft;
        scrollLeftActors.current = el.scrollLeft;
        el.style.cursor = 'grabbing';
    };

    const handleActorsMouseLeave = () => {
        isDownActors.current = false;
        if (actorsRef.current) {
            actorsRef.current.style.cursor = '';
        }
    };

    const handleActorsMouseUp = () => {
        isDownActors.current = false;
        if (actorsRef.current) {
            actorsRef.current.style.cursor = '';
        }
    };

    const handleActorsMouseMove = (e) => {
        if (!isDownActors.current || !actorsRef.current) return;
        e.preventDefault();
        e.stopPropagation();
        const el = actorsRef.current;
        const x = e.pageX - el.offsetLeft;
        const walk = (x - startXActors.current) * 2;
        el.scrollLeft = scrollLeftActors.current - walk;
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (filmsRef.current) {
                handleScroll(filmsRef, 'films');
            }
            if (actorsRef.current) {
                handleScroll(actorsRef, 'actors');
            }
        }, 100);

        const handleResize = () => {
            if (filmsRef.current) {
                handleScroll(filmsRef, 'films');
            }
            if (actorsRef.current) {
                handleScroll(actorsRef, 'actors');
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
        };
    }, [popularFilms, popularActors, searchQuery]);

    return (
        <div className={`header_search_results ${showPopular ? '' : 'no-before'}`}>
            {showPopular ? (
                <>
                    <span className="header_search_label"><Trans i18nKey="searchFrequently" /></span>

                    <div className="header_search_section">
                        <div 
                            className={`header_search_scroll_btn left ${!scrollStates.films.isScrollable || scrollStates.films.isAtStart ? 'hidden' : ''}`}
                            onClick={() => scrollItems(filmsRef, 'left')}
                        />
                        <div 
                            className={`header_search_scroll_btn right ${!scrollStates.films.isScrollable || scrollStates.films.isAtEnd ? 'hidden' : ''}`}
                            onClick={() => scrollItems(filmsRef, 'right')}
                        />
                        <div 
                            className="header_search_items_wrapper"
                            ref={filmsRef}
                            onMouseDown={handleFilmsMouseDown}
                            onMouseLeave={handleFilmsMouseLeave}
                            onMouseUp={handleFilmsMouseUp}
                            onMouseMove={handleFilmsMouseMove}
                            onScroll={() => handleScroll(filmsRef, 'films')}
                        >
                            <div className="header_search_films">
                                {popularFilms.map(film => (
                                    <div key={film.id} className="header_film_card">
                                        <Link to={`/movie/${film.id}`}>
                                            <img 
                                                src={film.image} 
                                                className="header_films_preview" 
                                                alt={film.title}
                                                draggable="false"
                                                onDragStart={(e) => e.preventDefault()}
                                            />
                                        </Link>
                                    </div>
                                ))}
                                <div className="header_search_spacer"></div>
                            </div>
                        </div>
                    </div>

                    <div className="header_search_section">
                        <div 
                            className={`header_search_scroll_btn left ${!scrollStates.actors.isScrollable || scrollStates.actors.isAtStart ? 'hidden' : ''}`}
                            onClick={() => scrollItems(actorsRef, 'left')}
                        />
                        <div 
                            className={`header_search_scroll_btn right ${!scrollStates.actors.isScrollable || scrollStates.actors.isAtEnd ? 'hidden' : ''}`}
                            onClick={() => scrollItems(actorsRef, 'right')}
                        />
                        <div 
                            className="header_search_items_wrapper"
                            ref={actorsRef}
                            onMouseDown={handleActorsMouseDown}
                            onMouseLeave={handleActorsMouseLeave}
                            onMouseUp={handleActorsMouseUp}
                            onMouseMove={handleActorsMouseMove}
                            onScroll={() => handleScroll(actorsRef, 'actors')}
                        >
                            <div className="header_search_actors">
                                {popularActors.map(actor => (
                                    <div key={actor.id} className="header_actor_card">
                                        <Link to={`/actor/${actor.id}`}>
                                            <img 
                                                src={actor.image} 
                                                className="header_actor_preview" 
                                                alt={actor.name}
                                                draggable="false"
                                                onDragStart={(e) => e.preventDefault()}
                                            />
                                            <p className="header_actor_name"><Trans i18nKey={`actors.${actor.name}`} /></p>
                                            <p className="header_actor_role"><Trans i18nKey={`actorRoles.${actor.role}`} /></p>
                                        </Link>
                                    </div>
                                ))}
                                <div className="header_search_spacer"></div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="search_results_display">
                    <div className="search_results_columns">
                        {searchResults.films.length > 0 && (
                            <div className="search_results_films_column">
                                <h3><Trans i18nKey="category.films" /></h3>
                                {searchResults.films.map(film => (
                                    <Link to={`/movie/${film.id}`} key={film.id} className="search_item_card">
                                        <img src={film.image} className="search_item_image" alt={film.title} />
                                        <div className="search_item_info">
                                            <p className="search_item_title">
                                                {film.title} <span className="search_item_type">(<Trans i18nKey="category.films" />)</span>
                                            </p>
                                            <p className="search_item_rating">6.8 <span className="search_item_year">(2023)</span></p>
                                            <p className="search_item_genre">USA • Adventure</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                        {searchResults.actors.length > 0 && (
                            <div className="search_results_actors_column">
                                <h3><Trans i18nKey="category.series" /></h3>
                                {searchResults.actors.map(actor => (
                                    <Link to={`/actor/${actor.id}`} key={actor.id} className="search_item_card actor">
                                        <img src={actor.image} className="search_item_image_actor" alt={actor.name} />
                                        <div className="search_item_info">
                                            <p className="search_item_title">
                                                {actor.name} <span className="search_item_type">(Actor)</span>
                                            </p>
                                            <p className="search_item_birthdate">Barbara Ferreira, 1996</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    {searchResults.films.length === 0 && searchResults.actors.length === 0 && (
                        <p className="no_results_text"><Trans i18nKey="home.errorLoading" /></p>
                    )}
                </div>
            )}
        </div>
    );
};

