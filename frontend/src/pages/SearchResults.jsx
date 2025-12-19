import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { globalSearch } from 'services/api';
import { useFavorites } from '../context/FavoritesContext';
import './SearchResults.css';

export const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const { isFavorite, toggleFavorite } = useFavorites();
    
    const [searchData, setSearchData] = useState(null);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const performSearch = async () => {
            if (!query) {
                setSearchData(null);
                setLoading(false);
                return;
            }

            setLoading(true);
            
            try {
                const data = await globalSearch(query);
                setSearchData(data);
            } catch (error) {
                setSearchData(null);
            } finally {
                setLoading(false);
            }
        };

        performSearch();
    }, [query]);


    if (loading) {
        return (
            <div className="search_results_page">
                <div className="search_results_container centered">
                    <p></p>
                </div>
            </div>
        );
    }

    if (!searchData) {
        return null;
    }

    const hasNoResults = searchData.persons.length === 0 && searchData.titles.length === 0;

    return (
        <div className="search_results_page">
            <div className={`search_results_container ${hasNoResults ? 'centered' : ''}`}>
                <div className="search_results_title">
                    {searchData.ui?.resultsTitlePrefix || ''} {searchData.query}
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
                                {searchData.ui?.emptyTitle || ''}
                            </div>
                            <div className="search_no_results_message">
                                {searchData.ui?.emptyDescription || ''}
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {searchData.persons.length > 0 && (
                            <div className="search_results_section">
                                <div className="search_section_title">
                                    {searchData.ui?.personsSection || ''}
                                </div>
                                <div className="search_actors_grid">
                                    {searchData.persons.map(person => (
                                        <Link 
                                            to={`/actor/${person.id}`} 
                                            key={person.id} 
                                            className="search_actor_card"
                                        >
                                            {person.photoUrl && (
                                                <img 
                                                    src={person.photoUrl} 
                                                    alt={person.name} 
                                                    className="search_actor_image"
                                                />
                                            )}
                                            <div className="search_actor_name">
                                                {person.name}
                                            </div>
                                            {person.activityType && (
                                                <div className="search_actor_role">
                                                    {person.activityType}
                                                </div>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {searchData.titles.length > 0 && (
                            <div className="search_results_section">
                                <div className="search_section_title">
                                    {searchData.ui?.titlesSection || ''}
                                </div>
                                <div className="search_films_grid">
                                    {searchData.titles.map(title => (
                                        <div 
                                            key={title.id} 
                                            className="search_film_card"
                                            onMouseEnter={() => setSelectedItemId(title.id)}
                                            onMouseLeave={() => setSelectedItemId(null)}
                                        >
                                            <Link
                                                to={`/movie/${title.id}`}
                                                className="search_film_card_link"
                                            >
                                                {title.posterUrl && (
                                                    <img 
                                                        src={title.posterUrl} 
                                                        alt={title.title} 
                                                        className="search_film_poster" 
                                                    />
                                                )}
                                                
                                                <div className="search_film_card_header">
                                                    <div
                                                        className={`search_film_card_save search_film_action ${
                                                            isFavorite(title.id) ? 'active' : ''
                                                        }`}
                                                        onClick={async (e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            await toggleFavorite(title.id);
                                                        }}
                                                    />
                                                    <div
                                                        className="search_film_card_repost search_film_action"
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
                                                    {title.rating && title.rating > 0 && (
                                                        <div className="search_film_card_rating">{title.rating.toFixed(1)}</div>
                                                    )}
                                                    {title.year && (
                                                        <div className="search_film_card_line">
                                                            <div className="search_film_card_line1">
                                                                <span className="search_film_card_date">{title.year}</span>
                                                                {title.type && <span>{title.type}</span>}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>
                                            <div className="search_film_title">
                                                {title.title}
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

