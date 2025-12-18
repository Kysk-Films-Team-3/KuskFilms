import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { fakeContent, getPopularActors } from 'services/api';
import { useFavorites } from '../context/FavoritesContext';
import './SearchResults.css';

export const SearchResults = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const { isFavorite, toggleFavorite } = useFavorites();
    
    const [films, setFilms] = useState([]);
    const [actors, setActors] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const performSearch = async () => {
            if (!query) {
                setFilms([]);
                setActors([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            const lowerCaseQuery = query.toLowerCase();
            
            try {
                const content = await fakeContent();
                const allFilms = [];
                content.forEach(category => {
                    category.subcategories.forEach(sub => {
                        sub.films.forEach(film => {
                            const filmTitle = t(`filmsPage.filmTitles.${film.id}`, { defaultValue: `Фільм ${film.id}` });
                            const filmTitleLower = filmTitle.toLowerCase();
                            
                            const line1Lower = (film.line1 || '').toLowerCase();
                            const line2Lower = (film.line2 || '').toLowerCase();
                            const searchableText = `${filmTitleLower} ${line1Lower} ${line2Lower}`;
                            
                            if (searchableText.includes(lowerCaseQuery)) {
                                allFilms.push({
                                    id: film.id,
                                    name: filmTitle,
                                    image: film.image,
                                    hoverImage: film.hoverImage || film.image,
                                    rating: parseFloat(film.rating) || 0,
                                    year: film.linedate ? parseInt(film.linedate.split('-')[0]) : null,
                                    genre: film.line1 ? film.line1.split(' • ').filter(g => g && g !== 'USA' && g !== 'UK' && g !== 'South Korea' && g !== 'Південна Корея' && g !== 'Велика Британія' && g !== 'France' && g !== 'Latvia')[0] : null,
                                    linedate: film.linedate,
                                    line1: film.line1,
                                    line2: film.line2,
                                    season: film.season
                                });
                            }
                        });
                    });
                });

                const popularActors = await getPopularActors();
                const filteredActors = popularActors.filter(actor =>
                    actor.name.toLowerCase().includes(lowerCaseQuery)
                );

                setFilms(allFilms);
                setActors(filteredActors);
            } catch (error) {
                console.error('Error performing search:', error);
                setFilms([]);
                setActors([]);
            } finally {
                setLoading(false);
            }
        };

        performSearch();
    }, [query]);


    const hasNoResults = !loading && films.length === 0 && actors.length === 0;

    return (
        <div className="search_results_page">
            <div className={`search_results_container ${hasNoResults ? 'centered' : ''}`}>
                <div className="search_results_title">
                    <Trans i18nKey="searchResults.title" values={{ query }} />
                </div>

                {hasNoResults ? (
                    <div className="search_no_results">
                        <img 
                            src="https://res.cloudinary.com/da9jqs8yq/image/upload/v1763916596/Search_q3bwsh.png" 
                            alt="No results" 
                            className="search_no_results_image"
                        />
                        <div className="search_no_results_text">
                            <div className="search_no_results_title">
                                <Trans i18nKey="searchResults.errorTitle" />
                            </div>
                            <div className="search_no_results_message">
                                <Trans i18nKey="searchResults.errorMessage" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <>

                        {actors.length > 0 && (
                    <div className="search_results_section">
                        <div className="search_section_title">
                            <Trans i18nKey="searchResults.actorsAndDirectors" />
                        </div>
                        <div className="search_actors_grid">
                            {actors.map(actor => (
                                <Link 
                                    to={`/actor/${actor.id}`} 
                                    key={actor.id} 
                                    className="search_actor_card"
                                >
                                    <img 
                                        src={actor.image} 
                                        alt={actor.name} 
                                        className="search_actor_image"
                                    />
                                    <div className="search_actor_name">
                                        <Trans i18nKey={`actors.${actor.name}`} />
                                    </div>
                                    <div className="search_actor_role">
                                        <Trans i18nKey={`actorRoles.${actor.role}`} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {films.length > 0 && (
                    <div className="search_results_section">
                        <div className="search_section_title">
                            <Trans i18nKey="searchResults.filmsAndSeries" />
                        </div>
                        <div className="search_films_grid">
                            {films.map(film => (
                                <div 
                                    key={film.id} 
                                    className="search_film_card"
                                    onMouseEnter={() => setSelectedItemId(film.id)}
                                    onMouseLeave={() => setSelectedItemId(null)}
                                >
                                    <Link
                                        to={`/movie/${film.id}`}
                                        className="search_film_card_link"
                                    >
                                        <img 
                                            src={selectedItemId === film.id ? film.hoverImage : film.image} 
                                            alt={film.name} 
                                            className="search_film_poster" 
                                        />
                                        
                                        <div className="search_film_card_header">
                                            <div
                                                className={`search_film_card_save search_film_action ${
                                                    isFavorite(film.id) ? 'active' : ''
                                                }`}
                                                data-tooltip={t('tooltip.watch')}
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    await toggleFavorite(film.id);
                                                }}
                                            />
                                            <div
                                                className="search_film_card_repost search_film_action"
                                                data-tooltip={t('tooltip.share')}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }}
                                            />
                                        </div>

                                        <div className="search_film_card_place">
                                            <div className="search_film_card_play"></div>
                                        </div>

                                        <div className="search_film_card_text">
                                            {film.rating > 0 && (
                                                <div className="search_film_card_rating">{film.rating.toFixed(1)}</div>
                                            )}
                                            <div className="search_film_card_line">
                                                {(film.linedate || film.line1) && (
                                                    <div className="search_film_card_line1">
                                                        {film.linedate && (
                                                            <span className="search_film_card_date">{film.linedate.trim()}</span>
                                                        )}
                                                        {film.line1 && <span>{film.line1}</span>}
                                                    </div>
                                                )}
                                                {film.line2 && (
                                                    <div className="search_film_card_line2">{film.line2}</div>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="search_film_title">
                                        {t(`filmsPage.filmTitles.${film.id}`, { defaultValue: film.name })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                    </>
                )}
            </div>
        </div>
    );
};

