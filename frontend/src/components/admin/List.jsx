import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { EditActor } from './EditActor';
import { api, fetchUiDictionary } from '../../services/api';
import './List.css';

const CATEGORY_PERSONS = 'persons';
const CATEGORY_MOVIES = 'movies';

export const List = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const modalRef = useRef(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(CATEGORY_PERSONS);
    const [persons, setPersons] = useState([]);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [selectedPersons, setSelectedPersons] = useState([]);
    const [selectedMovies, setSelectedMovies] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [actorToEdit, setActorToEdit] = useState(null);
    const [isEditActorOpen, setIsEditActorOpen] = useState(false);

    const dropdownWrapperRef = useRef(null);
    const [dropdownOpensUpward, setDropdownOpensUpward] = useState(false);
    const [uiDictionary, setUiDictionary] = useState(null);

    const resolveImageUrl = (path) => {
        if (!path) return 'https://via.placeholder.com/150?text=No+Photo';
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        const filename = path.replace(/^kyskfilms\//, '').replace(/^images\//, '').replace(/^\//, '');
        return `/kyskfilms/images/${filename}`;
    };

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchUiDictionary();
                setUiDictionary(data);
            } catch (error) {
            }
        })();
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                if (selectedCategory === CATEGORY_MOVIES) {
                    const url = searchQuery
                        ? `/public/titles?search=${encodeURIComponent(searchQuery)}&size=100`
                        : `/public/titles?size=100`;

                    const response = await api.get(url);
                    const data = response.data.content || response.data;

                    const mappedMovies = data.map(movie => ({
                        id: movie.id,
                        name: movie.title,
                        image: resolveImageUrl(movie.posterUrl)
                    }));
                    setMovies(mappedMovies);

                } else {
                    const response = await api.get(`/persons?search=${encodeURIComponent(searchQuery)}`);
                    const mappedPersons = response.data.map(person => ({
                        id: person.id,
                        name: person.name,
                        role: person.activityType || '',
                        image: resolveImageUrl(person.photoUrl),
                        ...person
                    }));
                    setPersons(mappedPersons);
                }
            } catch (error) {
                console.error("Error fetching list:", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => { fetchData(); }, 300);
        return () => clearTimeout(timeoutId);
    }, [isOpen, selectedCategory, searchQuery]);

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e) => {
            if (document.querySelector('.edit_actor_overlay')) return;

            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    useEffect(() => {
        setSearchQuery('');
        setSelectedPersons([]);
        setSelectedMovies([]);
        setIsEditing(false);
    }, [selectedCategory]);

    const handleSearch = (e) => setSearchQuery(e.target.value);

    const handlePersonClick = (personId) => {
        if (isEditing) {
            setSelectedPersons(prev => prev.includes(personId) ? prev.filter(id => id !== personId) : [...prev, personId]);
        } else {
            const person = persons.find(p => p.id === personId);
            setActorToEdit(person);
            setIsEditActorOpen(true);
        }
    };

    const handleMovieClick = (movieId) => {
        if (isEditing) {
            setSelectedMovies(prev => prev.includes(movieId) ? prev.filter(id => id !== movieId) : [...prev, movieId]);
        } else {
            onClose();
            navigate(`/admin/movie/${movieId}`);
        }
    };

    const handleDeleteClick = () => {
        if ((isMoviesMode && selectedMovies.length > 0) || (!isMoviesMode && selectedPersons.length > 0)) {
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
            alert("");
        }
    };

    const handleCreate = () => {
        if (selectedCategory === CATEGORY_MOVIES) {
            navigate('/admin/movie/new');
            onClose();
        } else {
            setActorToEdit(null);
            setIsEditActorOpen(true);
        }
    };

    const handleSaveList = () => {
        setIsEditing(false);
        onClose();
    };

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = 'https://via.placeholder.com/150?text=No+Image';
    };

    const isMoviesMode = selectedCategory === CATEGORY_MOVIES;
    const displayItems = isMoviesMode ? movies : persons;
    const selectedItems = isMoviesMode ? selectedMovies : selectedPersons;

    if (!isOpen) return null;

    return (
        <div className="admin_list_overlay">
            <div className="admin_list_modal" ref={modalRef}>
                <div className="admin_list_header">
                    <div className="admin_list_title">{uiDictionary?.list?.title || ''}</div>
                    <button className="admin_list_close" onClick={onClose}></button>
                </div>

                <div className="admin_list_controls">
                    <div className="admin_list_top_controls">
                        <div className="admin_list_dropdown_wrapper" ref={dropdownWrapperRef}>
                            <div className={`admin_list_dropdown ${isDropdownOpen ? 'open' : ''}`} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                <span className="admin_list_dropdown_value">{selectedCategory === CATEGORY_PERSONS ? (uiDictionary?.list?.persons || '') : (uiDictionary?.list?.movies || '')}</span>
                                <span className={`admin_list_dropdown_arrow ${isDropdownOpen ? 'open' : ''}`}></span>
                            </div>
                            {isDropdownOpen && (
                                <div className="admin_list_dropdown_menu">
                                    <div className="admin_list_dropdown_option" onClick={() => { setSelectedCategory(CATEGORY_PERSONS); setIsDropdownOpen(false); }}>{uiDictionary?.list?.persons || ''}</div>
                                    <div className="admin_list_dropdown_option" onClick={() => { setSelectedCategory(CATEGORY_MOVIES); setIsDropdownOpen(false); }}>{uiDictionary?.list?.movies || ''}</div>
                                </div>
                            )}
                        </div>
                        <div className="admin_list_buttons_group">
                            {!isEditing && displayItems.length > 0 && <button className={`admin_list_edit_button ${isEditing ? 'active' : ''}`} onClick={() => setIsEditing(!isEditing)}><span className="admin_list_edit_icon"></span>{uiDictionary?.list?.edit || ''}</button>}
                            {selectedItems.length > 0 && <button className="admin_list_delete_button" onClick={handleDeleteClick}><span className="admin_list_delete_icon"></span>{uiDictionary?.list?.delete || ''}</button>}
                        </div>
                    </div>
                    <div className="admin_list_search">
                        <div className="admin_list_search_icon"></div>
                        <input type="text" className="admin_list_search_input" placeholder={isMoviesMode ? (uiDictionary?.list?.searchMoviePlaceholder || '') : (uiDictionary?.list?.searchPersonPlaceholder || '')} value={searchQuery} onChange={handleSearch} />
                    </div>
                </div>

                <div className={`admin_list_grid ${isEditing ? 'admin_list_edit_mode' : ''}`}>
                    {!isEditing && !searchQuery && (
                        <div className="admin_list_item admin_list_create_placeholder" onClick={handleCreate}>
                             <div className="admin_list_avatar_placeholder"></div>
                            <button className="admin_list_create_in_grid_button"><span className="admin_list_create_icon"></span>{uiDictionary?.list?.create || ''}</button>
                        </div>
                    )}

                    {displayItems.map((item) => (
                        <div
                            key={item.id}
                            className={isMoviesMode ? `admin_list_poster ${selectedItems.includes(item.id) ? 'selected' : ''}` : `admin_list_item ${selectedItems.includes(item.id) ? 'selected' : ''}`}
                            onClick={() => isMoviesMode ? handleMovieClick(item.id) : handlePersonClick(item.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            {isEditing && <div className={`admin_list_edit_checkbox ${selectedItems.includes(item.id) ? 'selected' : ''}`}></div>}

                            {isMoviesMode ? (
                                <>
                                    <img src={item.image} alt={item.name} onError={handleImageError} />
                                    {isEditing && <div className="admin_list_edit_title_overlay">{item.name}</div>}
                                </>
                            ) : (
                                <>
                                    <div className="admin_list_avatar"><img src={item.image} alt={item.name} onError={handleImageError} /></div>
                                    <div className="admin_list_info"><div className="admin_list_name">{item.name}</div><div className="admin_list_role">{item.role}</div></div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <div className="admin_list_footer">
                    <button className="admin_list_exit_button" onClick={onClose}>{uiDictionary?.list?.exit || ''}</button>
                    <button className="admin_list_save_btn" onClick={handleSaveList}><span className="admin_list_save_icon"></span>{uiDictionary?.list?.save || ''}</button>
                </div>
            </div>

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                isMoviesMode={isMoviesMode}
                uiDictionary={uiDictionary}
            />

            <EditActor
                isOpen={isEditActorOpen}
                onClose={() => { setIsEditActorOpen(false); setActorToEdit(null); }}
                actor={actorToEdit}
                uiDictionary={uiDictionary}
                onSave={() => {
                    setSearchQuery(prev => prev + ' ');
                    setTimeout(() => setSearchQuery(prev => prev.trim()), 100);
                }}
            />
        </div>
    );
};