import React, { useState, useEffect, useRef } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { api } from '../../services/api';
import './List.css';

const CATEGORY_PERSONS = 'persons';
const CATEGORY_MOVIES = 'movies';

export const List = ({ isOpen, onClose, onOpenEditActor }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const modalRef = useRef(null);

    // Состояния данных
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(CATEGORY_PERSONS);
    const [persons, setPersons] = useState([]);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    // Состояния UI
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPersons, setSelectedPersons] = useState([]);
    const [selectedMovies, setSelectedMovies] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const dropdownWrapperRef = useRef(null);
    const [dropdownOpensUpward, setDropdownOpensUpward] = useState(false);

    // --- 1. ЗАГРУЗКА ДАННЫХ ---
    useEffect(() => {
        if (!isOpen) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                if (selectedCategory === CATEGORY_MOVIES) {
                    // Используем /public/titles (axios сам добавит /api в начало)
                    const url = searchQuery
                        ? `/public/titles?search=${searchQuery}&size=100`
                        : `/public/titles?size=100`;

                    const response = await api.get(url);

                    const mappedMovies = (response.data.content || response.data).map(movie => ({
                        id: movie.id,
                        name: movie.title,
                        // Формируем ссылку на картинку
                        image: movie.posterUrl
                            ? (movie.posterUrl.startsWith('http') ? movie.posterUrl : `/kyskfilms/${movie.posterUrl}`)
                            : 'https://via.placeholder.com/200x300?text=No+Poster'
                    }));
                    setMovies(mappedMovies);

                } else {
                    const response = await api.get(`/persons?search=${searchQuery}`);

                    const mappedPersons = response.data.map(person => ({
                        id: person.id,
                        name: person.name,
                        role: person.activityType || 'Aktor',
                        image: person.photoUrl
                            ? (person.photoUrl.startsWith('http') ? person.photoUrl : `/kyskfilms/${person.photoUrl}`)
                            : 'https://via.placeholder.com/150?text=No+Photo'
                    }));
                    setPersons(mappedPersons);
                }
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [isOpen, selectedCategory, searchQuery]);

    // --- UI ЭФФЕКТЫ ---
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

    // --- КЛИКИ ПО ЭЛЕМЕНТАМ (ИСПРАВЛЕНО) ---

    const handlePersonClick = (personId) => {
        if (isEditing) {
            // Режим выбора для удаления
            setSelectedPersons(prev =>
                prev.includes(personId) ? prev.filter(id => id !== personId) : [...prev, personId]
            );
        } else {
            // Обычный режим: Открыть редактирование актера
            // Передаем ID актера, если нужно (пока просто открываем модалку)
            if (onOpenEditActor) onOpenEditActor(personId);
        }
    };

    const handleMovieClick = (movieId) => {
        if (isEditing) {
            // Режим выбора для удаления
            setSelectedMovies(prev =>
                prev.includes(movieId) ? prev.filter(id => id !== movieId) : [...prev, movieId]
            );
        } else {
            // Обычный режим: Переход на страницу редактирования фильма
            onClose(); // Закрываем список
            navigate(`/admin/movie/${movieId}`); // Переходим на страницу
        }
    };

    // --- УДАЛЕНИЕ ---
    const handleDeleteClick = () => {
        const hasSelection = isMoviesMode
            ? selectedMovies.length > 0
            : selectedPersons.length > 0;

        if (hasSelection) {
            setIsDeleteModalOpen(true);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            if (isMoviesMode) {
                await Promise.all(selectedMovies.map(id => api.delete(`/admin/titles/${id}`)));
                setMovies(prev => prev.filter(m => !selectedMovies.includes(m.id)));
                setSelectedMovies([]);
            } else {
                await Promise.all(selectedPersons.map(id => api.delete(`/admin/persons/${id}`)));
                setPersons(prev => prev.filter(p => !selectedPersons.includes(p.id)));
                setSelectedPersons([]);
            }
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Ошибка при удалении:", error);
            alert("Помилка видалення. Перевірте консоль.");
        }
    };

    const handleCreate = () => {
        if (selectedCategory === CATEGORY_MOVIES) {
            navigate('/admin/movie/new');
            if (onClose) onClose();
        } else {
            if (onOpenEditActor) onOpenEditActor();
        }
    };

    const handleSave = () => {
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

    // Функция-заглушка для битых картинок
    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = 'https://via.placeholder.com/200x300?text=No+Image';
    };

    const isMoviesMode = selectedCategory === CATEGORY_MOVIES;
    const displayItems = isMoviesMode ? movies : persons;
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
                                        setDropdownOpensUpward(spaceBelow < 200 + 10);
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
                                        onClick={() => { setSelectedCategory(CATEGORY_PERSONS); setIsDropdownOpen(false); }}
                                    >
                                        <Trans i18nKey="admin.list.persons" />
                                    </div>
                                    <div
                                        className={`admin_list_dropdown_option ${selectedCategory === CATEGORY_MOVIES ? 'selected' : ''}`}
                                        onClick={() => { setSelectedCategory(CATEGORY_MOVIES); setIsDropdownOpen(false); }}
                                    >
                                        <Trans i18nKey="admin.list.movies" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="admin_list_buttons_group">
                            {!isEditing && displayItems.length > 0 && (
                                <button
                                    className={`admin_list_edit_button ${isEditing ? 'active' : ''}`}
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    <span className="admin_list_edit_icon"></span>
                                    <Trans i18nKey="admin.list.edit" />
                                </button>
                            )}
                            {((isMoviesMode && selectedMovies.length > 0) || (!isMoviesMode && selectedPersons.length > 0)) ? (
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
                    {!isEditing && !searchQuery && (
                        <div className={`admin_list_item admin_list_create_placeholder ${isMoviesMode ? 'admin_list_poster_placeholder' : ''}`} onClick={handleCreate}>
                            <div className={`admin_list_avatar_placeholder ${isMoviesMode ? 'admin_list_poster_avatar_placeholder' : ''}`}></div>
                            <button className="admin_list_create_in_grid_button">
                                <span className="admin_list_create_icon"></span>
                                <Trans i18nKey={isMoviesMode ? "admin.list.addMovie" : "admin.list.create"} />
                            </button>
                        </div>
                    )}

                    {displayItems.length === 0 && searchQuery && !loading && (
                        <div className="admin_list_empty_state">
                            <div className="admin_list_empty_icon"></div>
                            <div className="admin_list_empty_title"><Trans i18nKey="admin.list.emptyStateTitle" /></div>
                            <div className="admin_list_empty_message"><Trans i18nKey="admin.list.emptyStateMessage" /></div>
                        </div>
                    )}

                    {displayItems.map((item) => {
                        if (isMoviesMode) {
                            return (
                                <div
                                    key={item.id}
                                    className={`admin_list_poster ${isEditing ? 'edit-mode' : ''} ${selectedItems.includes(item.id) ? 'selected' : ''}`}
                                    onClick={() => handleMovieClick(item.id)}
                                >
                                    {isEditing && (
                                        <>
                                            <div className={`admin_list_edit_checkbox ${selectedItems.includes(item.id) ? 'selected' : ''}`}></div>
                                            <div className="admin_list_edit_actions" onClick={(e) => e.stopPropagation()}></div>
                                        </>
                                    )}
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        onError={handleImageError}
                                    />
                                    {isEditing && <div className="admin_list_edit_title_overlay">{item.name}</div>}
                                </div>
                            );
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
                                            <img src={item.image} alt={item.name} onError={handleImageError} />
                                        </div>
                                        <div className="admin_list_edit_info">
                                            <div className="admin_list_edit_title_uk">{item.name}</div>
                                            <div className="admin_list_edit_title_en">{item.role}</div>
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div
                                        key={item.id}
                                        className="admin_list_item"
                                        onClick={() => handlePersonClick(item.id)} // Теперь кликабельно и здесь
                                    >
                                        <div className="admin_list_avatar">
                                            <img src={item.image} alt={item.name} onError={handleImageError} />
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