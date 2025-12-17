import React, { useState, useEffect, useRef } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import './List.css';

const mockPersons = [
    { id: 1, name: 'Джейсон Стетхем', role: 'Актер', image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756265326/Statham.png' },
    { id: 2, name: 'Джейсон Стетхем', role: 'Актор', image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756265326/Statham.png' },
    { id: 3, name: 'Джейсон Стетхем', role: 'Актор', image: 'https://via.placeholder.com/150?text=Timothée+Chalamet' },
    { id: 4, name: 'Джейсон Стетхем', role: 'Актор', image: 'https://via.placeholder.com/150?text=Anya+Taylor-Joy' },
    { id: 5, name: 'Джейсон Стетхем', role: 'Актор', image: 'https://via.placeholder.com/150?text=Elizabeth+Olsen' },
    { id: 6, name: 'Джейсон Стетхем', role: 'Актор', image: 'https://via.placeholder.com/150?text=Scarlett+Johansson' },
    { id: 7, name: 'Джейсон Стетхем', role: 'Актор', image: 'https://via.placeholder.com/150?text=Tom+Hiddleston' },
    { id: 8, name: 'Джейсон Стетхем', role: 'Актор', image: 'https://via.placeholder.com/150?text=Brad+Pitt' },
    { id: 9, name: 'Джейсон Стетхем', role: 'Актор', image: 'https://via.placeholder.com/150?text=Anthony+Hopkins' },
    { id: 10, name: 'Джейсон Стетхем', role: 'Актор', image: 'https://via.placeholder.com/150?text=Angelina+Jolie' },
    { id: 11, name: 'Джейсон Стетхем', role: 'Актор', image: 'https://via.placeholder.com/150?text=Person+11' },
    { id: 12, name: 'Джейсон Стетхем', role: 'Актор', image: 'https://via.placeholder.com/150?text=Person+12' },
];

const mockMovies = [
    { id: 1, name: 'ДЕДПУЛ РОСОМАХА', image: 'https://via.placeholder.com/200x300?text=Deadpool+Wolverine' },
    { id: 2, name: 'Барбі', image: 'https://via.placeholder.com/200x300?text=Barbie' },
    { id: 3, name: 'ВОВК З ВОЛЛ СТРІТ', image: 'https://via.placeholder.com/200x300?text=Wolf+of+Wall+Street' },
    { id: 4, name: 'WICKED ЧАРОДІЙКА', image: 'https://via.placeholder.com/200x300?text=Wicked' },
    { id: 5, name: 'СМЕРТЬ ЕДИНОРОГА', image: 'https://via.placeholder.com/200x300?text=Death+of+Unicorn' },
    { id: 6, name: 'ВОЛОДАР ПЕРСНІВ', image: 'https://via.placeholder.com/200x300?text=LOTR' },
    { id: 7, name: 'Гаррі Поттер ФІЛОСОФСЬКИЙ КАМІНЬ', image: 'https://via.placeholder.com/200x300?text=Harry+Potter' },
    { id: 8, name: 'ДЖЕРЕЛО ВІЧНОЇ МОЛОДОСТІ', image: 'https://via.placeholder.com/200x300?text=Source+of+Youth' },
    { id: 9, name: 'ХОББІТ', image: 'https://via.placeholder.com/200x300?text=Hobbit' },
    { id: 10, name: 'Без Образ', image: 'https://via.placeholder.com/200x300?text=No+Hard+Feelings' },
    { id: 11, name: 'сутінки', image: 'https://via.placeholder.com/200x300?text=Twilight' },
    { id: 12, name: 'ІНТЕРСТЕЛЛАР', image: 'https://via.placeholder.com/200x300?text=Interstellar' },
    { id: 13, name: 'НАЧАЛО', image: 'https://via.placeholder.com/200x300?text=Inception' },
    { id: 14, name: 'МАТРИЦЯ', image: 'https://via.placeholder.com/200x300?text=Matrix' },
    { id: 15, name: 'ТЕМНИЙ ЛИЦАР', image: 'https://via.placeholder.com/200x300?text=Dark+Knight' },
    { id: 16, name: 'АВАТАР', image: 'https://via.placeholder.com/200x300?text=Avatar' },
    { id: 17, name: 'ТИТАНІК', image: 'https://via.placeholder.com/200x300?text=Titanic' },
    { id: 18, name: 'ФОРСАЖ', image: 'https://via.placeholder.com/200x300?text=Fast+Furious' },
    { id: 19, name: 'МАРВЕЛ', image: 'https://via.placeholder.com/200x300?text=Marvel' },
    { id: 20, name: 'ЗВІРІ', image: 'https://via.placeholder.com/200x300?text=Zviri' },
    { id: 21, name: 'ДЖОКЕР', image: 'https://via.placeholder.com/200x300?text=Joker' },
    { id: 22, name: 'ПАРАЗИТИ', image: 'https://via.placeholder.com/200x300?text=Parasite' },
    { id: 23, name: '1917', image: 'https://via.placeholder.com/200x300?text=1917' },
];

const CATEGORY_PERSONS = 'persons';
const CATEGORY_MOVIES = 'movies';

export const List = ({ isOpen, onClose, onOpenEditActor }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const modalRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(CATEGORY_PERSONS);
    const [persons, setPersons] = useState(mockPersons);
    const [movies, setMovies] = useState(mockMovies);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPersons, setSelectedPersons] = useState([]);
    const [selectedMovies, setSelectedMovies] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const dropdownWrapperRef = useRef(null);
    const [dropdownOpensUpward, setDropdownOpensUpward] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };

        const handleScroll = () => {
            setIsDropdownOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll, true);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        setSearchQuery('');
        setSelectedPersons([]);
        setSelectedMovies([]);
        setIsEditing(false);
    }, [selectedCategory]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredPersons = persons.filter(person =>
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredMovies = movies.filter(movie =>
        movie.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePersonClick = (personId) => {
        setSelectedPersons(prev =>
            prev.includes(personId)
                ? prev.filter(id => id !== personId)
                : [...prev, personId]
        );
    };

    const handleMovieClick = (movieId) => {
        setSelectedMovies(prev =>
            prev.includes(movieId)
                ? prev.filter(id => id !== movieId)
                : [...prev, movieId]
        );
    };

    const handleDeleteMovies = () => {
        setMovies(prev => prev.filter(movie => !selectedMovies.includes(movie.id)));
        setSelectedMovies([]);
    };

    const handleDeleteSelectedMovie = () => {
        if (selectedMovies.length > 0) {
            setMovies(prev => prev.filter(movie => !selectedMovies.includes(movie.id)));
            setSelectedMovies([]);
        }
    };

    const handleDeleteSelectedPerson = () => {
        if (selectedPersons.length > 0) {
            setPersons(prev => prev.filter(person => !selectedPersons.includes(person.id)));
            setSelectedPersons([]);
        }
    };

    const handleDeleteClick = () => {
        if ((!isMoviesMode && selectedPersons.length > 1) || (isMoviesMode && selectedMovies.length > 1)) {
            setIsDeleteModalOpen(true);
        } else {
            if (isEditing) {
                if (isMoviesMode) {
                    handleDeleteSelectedMovie();
                } else {
                    handleDeleteSelectedPerson();
                }
            } else {
                if (isMoviesMode) {
                    handleDeleteMovies();
                } else {
                    setPersons(prev => prev.filter(person => !selectedPersons.includes(person.id)));
                    setSelectedPersons([]);
                }
            }
        }
    };

    const handleConfirmDelete = () => {
        if (!isMoviesMode && selectedPersons.length > 1) {
            setPersons(prev => prev.filter(person => !selectedPersons.includes(person.id)));
            setSelectedPersons([]);
        } else if (isMoviesMode && selectedMovies.length > 1) {
            setMovies(prev => prev.filter(movie => !selectedMovies.includes(movie.id)));
            setSelectedMovies([]);
        }
        setIsDeleteModalOpen(false);
    };

    const handleCreate = () => {
        if (selectedCategory === CATEGORY_MOVIES) {
            navigate('/admin/movie/new');
            if (onClose) {
                onClose();
            }
        } else {
            if (onOpenEditActor) {
                onOpenEditActor();
            }
        }
    };

    const handleSave = () => {
        console.log('Зберегти зміни');
        setIsEditing(false);
        setSelectedPersons([]);
        setSelectedMovies([]);
    };

    const handleExit = () => {
        setIsEditing(false);
        setSelectedPersons([]);
        setSelectedMovies([]);
        onClose();
    };

    const isMoviesMode = selectedCategory === CATEGORY_MOVIES;
    const displayItems = isMoviesMode ? filteredMovies : filteredPersons;
    const selectedItems = isMoviesMode ? selectedMovies : selectedPersons;

    useEffect(() => {
        if (isEditing && displayItems.length === 0) {
            setIsEditing(false);
        }
    }, [isEditing, displayItems.length]);

    if (!isOpen) return null;

    return (
        <div className="admin_list_overlay">
            <div className="admin_list_modal" ref={modalRef}>
                <div className="admin_list_header">
                    <div className="admin_list_title"><Trans i18nKey="admin.list.title" /></div>
                    <button className="admin_list_close" onClick={handleExit}></button>
                </div>

                <div className="admin_list_controls">
                    <div className="admin_list_top_controls">
                        <div className="admin_list_dropdown_wrapper" ref={dropdownWrapperRef}>
                            <div 
                                className={`admin_list_dropdown ${isDropdownOpen ? 'open' : ''}`}
                                onClick={() => {
                                    if (!isDropdownOpen && dropdownWrapperRef.current) {
                                        const rect = dropdownWrapperRef.current.getBoundingClientRect();
                                        const spaceBelow = window.innerHeight - rect.bottom;
                                        const estimatedMenuHeight = 200;
                                        setDropdownOpensUpward(spaceBelow < estimatedMenuHeight + 10);
                                    }
                                    setIsDropdownOpen(!isDropdownOpen);
                                }}
                            >
                                <span className="admin_list_dropdown_value">{selectedCategory === CATEGORY_PERSONS ? t('admin.list.persons') : t('admin.list.movies')}</span>
                                <span className={`admin_list_dropdown_arrow ${isDropdownOpen ? 'open' : ''}`}></span>
                            </div>
                            {isDropdownOpen && (
                                <div className={`admin_list_dropdown_menu ${dropdownOpensUpward ? 'opens-upward' : ''}`}>
                                    <div 
                                        className={`admin_list_dropdown_option ${selectedCategory === CATEGORY_PERSONS ? 'selected' : ''}`}
                                        onClick={() => {
                                            setSelectedCategory(CATEGORY_PERSONS);
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        <Trans i18nKey="admin.list.persons" />
                                    </div>
                                    <div 
                                        className={`admin_list_dropdown_option ${selectedCategory === CATEGORY_MOVIES ? 'selected' : ''}`}
                                        onClick={() => {
                                            setSelectedCategory(CATEGORY_MOVIES);
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        <Trans i18nKey="admin.list.movies" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="admin_list_buttons_group">
                            {!isEditing && !((isMoviesMode && selectedMovies.length > 1) || (!isMoviesMode && selectedPersons.length > 1)) && displayItems.length > 0 && (
                                <button
                                    className={`admin_list_edit_button ${isEditing ? 'active' : ''}`}
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    <span className="admin_list_edit_icon"></span>
                                    <Trans i18nKey="admin.list.edit" />
                                </button>
                            )}
                            {(isMoviesMode && selectedMovies.length >= 1) || (!isMoviesMode && selectedPersons.length >= 1) ? (
                                <button
                                    className="admin_list_delete_button"
                                    onClick={handleDeleteClick}
                                >
                                    <span className="admin_list_delete_icon"></span>
                                    <Trans i18nKey="admin.list.delete" />
                                </button>
                            ) : null}
                        </div>
                    </div>

                    <div className="admin_list_search">
                        <div className="admin_list_search_icon"></div>
                        <input
                            type="text"
                            className="admin_list_search_input"
                            placeholder={isMoviesMode ? t('admin.list.searchMoviePlaceholder') : t('admin.list.searchPersonPlaceholder')}
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <div className={`admin_list_grid ${isEditing ? 'admin_list_edit_mode' : ''}`}>
                    {!isEditing && isMoviesMode && !searchQuery && (
                        <div className="admin_list_poster admin_list_poster_placeholder" onClick={handleCreate}>
                            <button className="admin_list_create_in_grid_button">
                                <span className="admin_list_create_icon"></span>
                                <Trans i18nKey="admin.list.addMovie" />
                            </button>
                        </div>
                    )}
                    {!isEditing && !isMoviesMode && !searchQuery && (
                        <div className="admin_list_item admin_list_create_placeholder">
                            <div className="admin_list_avatar admin_list_avatar_placeholder">
                            </div>
                            <button className="admin_list_create_in_grid_button" onClick={handleCreate}>
                                <span className="admin_list_create_icon"></span>
                                <Trans i18nKey="admin.list.create" />
                            </button>
                        </div>
                    )}

                    {displayItems.length === 0 && searchQuery && (
                        <div className="admin_list_empty_state">
                            <div className="admin_list_empty_icon"></div>
                            <div className="admin_list_empty_title"><Trans i18nKey="admin.list.emptyStateTitle" /></div>
                            <div className="admin_list_empty_message">
                                <Trans i18nKey="admin.list.emptyStateMessage" />
                            </div>
                        </div>
                    )}

                    {displayItems.length > 0 && displayItems.map((item) => {
                        if (isMoviesMode) {
                            if (isEditing) {
                                return (
                                    <div 
                                        key={item.id} 
                                        className={`admin_list_edit_item ${selectedItems.includes(item.id) ? 'selected' : ''}`}
                                        onClick={() => handleMovieClick(item.id)}
                                    >
                                        <div className={`admin_list_edit_checkbox ${selectedItems.includes(item.id) ? 'selected' : ''}`}></div>
                                        <div className="admin_list_edit_poster">
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                        <div className="admin_list_edit_info">
                                            <div className="admin_list_edit_title_uk">{item.name}</div>
                                        </div>
                                        <div className="admin_list_edit_actions" onClick={(e) => e.stopPropagation()}>
                                            <button className="admin_list_edit_item_button">
                                                <span className="admin_list_edit_icon"></span>
                                                <Trans i18nKey="admin.list.edit" />
                                            </button>
                                            <button 
                                                className="admin_list_delete_item_button"
                                                onClick={() => {
                                                    setMovies(prev => prev.filter(movie => movie.id !== item.id));
                                                }}
                                            >
                                                <span className="admin_list_delete_icon"></span>
                                                <Trans i18nKey="admin.list.delete" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div
                                        key={item.id}
                                        className={`admin_list_poster ${selectedItems.includes(item.id) ? 'selected' : ''}`}
                                        onClick={() => handleMovieClick(item.id)}
                                    >
                                        {selectedItems.includes(item.id) && (
                                            <div className="admin_list_checkmark selected"></div>
                                        )}
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                );
                            }
                        } else {
                            if (isEditing) {
                                return (
                                    <div 
                                        key={item.id} 
                                        className={`admin_list_edit_item ${selectedItems.includes(item.id) ? 'selected' : ''}`}
                                        onClick={() => handlePersonClick(item.id)}
                                    >
                                        <div className={`admin_list_edit_checkbox ${selectedItems.includes(item.id) ? 'selected' : ''}`}></div>
                                        <div className="admin_list_edit_avatar">
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                        <div className="admin_list_edit_info">
                                            <div className="admin_list_edit_title_uk">{item.name}</div>
                                            <div className="admin_list_edit_title_en">{item.role}</div>
                                        </div>
                                        <div className="admin_list_edit_actions" onClick={(e) => e.stopPropagation()}>
                                            <button className="admin_list_edit_item_button">
                                                <span className="admin_list_edit_icon"></span>
                                                <Trans i18nKey="admin.list.edit" />
                                            </button>
                                            <button 
                                                className="admin_list_delete_item_button"
                                                onClick={() => {
                                                    setPersons(prev => prev.filter(person => person.id !== item.id));
                                                }}
                                            >
                                                <span className="admin_list_delete_icon"></span>
                                                <Trans i18nKey="admin.list.delete" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div
                                        key={item.id}
                                        className={`admin_list_item ${selectedItems.includes(item.id) ? 'selected' : ''}`}
                                        onClick={() => handlePersonClick(item.id)}
                                    >
                                        {selectedItems.includes(item.id) && (
                                            <div className="admin_list_checkmark selected"></div>
                                        )}
                                        <div className="admin_list_avatar">
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                        <div className="admin_list_info">
                                            <div className="admin_list_name">{item.name}</div>
                                            <div className="admin_list_role">{item.role}</div>
                                        </div>
                                    </div>
                                );
                            }
                        }
                    })}
                </div>

                <div className={`admin_list_footer ${!isMoviesMode ? 'admin_list_footer_persons' : ''}`}>
                    <button className="admin_list_exit_button" onClick={handleExit}>
                        <Trans i18nKey="admin.list.exit" />
                    </button>
                    <button className="admin_list_save_btn" onClick={handleSave}>
                        <span className="admin_list_save_icon"></span>
                        <Trans i18nKey="admin.list.save" />
                    </button>
                </div>
            </div>

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                isMoviesMode={isMoviesMode}
            />
        </div>
    );
};

