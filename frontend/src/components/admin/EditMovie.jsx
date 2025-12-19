import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { api } from '../../services/api';
import './EditMovie.css';
import './EditMovie_ReviewModal.css';

const ratings = Array.from({ length: 101 }, (_, i) => (i / 10).toFixed(1));
const years = Array.from({ length: 125 }, (_, i) => (2025 - i).toString());
const hours = Array.from({ length: 25 }, (_, i) => i.toString());
const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

export const EditMovie = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [coverFile, setCoverFile] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [backgroundFile, setBackgroundFile] = useState(null);
    const [contentFile, setContentFile] = useState(null);

    const [allGenres, setAllGenres] = useState([]);
    const [foundPersons, setFoundPersons] = useState([]);

    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedDirectors, setSelectedDirectors] = useState([]);
    const [selectedActors, setSelectedActors] = useState([]);

    const [actorsAndDirectors, setActorsAndDirectors] = useState([]);

    const [coverImage, setCoverImage] = useState(null);
    const [logoImage, setLogoImage] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(null);

    const coverInputRef = useRef(null);
    const logoInputRef = useRef(null);
    const backgroundInputRef = useRef(null);
    const contentInputRef = useRef(null);
    const episodeCoverInputRefs = useRef({});
    const episodeContentInputRefs = useRef({});

    const [formData, setFormData] = useState({
        title: '',
        shortDescription: '',
        rating: '10.0',
        yearStart: '2025',
        yearEnd: '2025',
        durationHours: '0',
        durationMinutes: '00',
        description: ''
    });

    const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
    const [genreInputValue, setGenreInputValue] = useState('');

    const [isDirectorDropdownOpen, setIsDirectorDropdownOpen] = useState(false);
    const [directorInputValue, setDirectorInputValue] = useState('');

    const [isActorDropdownOpen, setIsActorDropdownOpen] = useState(false);
    const [actorInputValue, setActorInputValue] = useState('');

    const genreDropdownRef = useRef(null);
    const genreInputRef = useRef(null);
    const directorDropdownRef = useRef(null);
    const directorInputRef = useRef(null);
    const actorDropdownRef = useRef(null);
    const actorInputRef = useRef(null);

    const [catalog, setCatalog] = useState({
        films: false, series: false, cartoons: false, animatedSeries: false,
        interview: false, anime: false, concerts: false, realityShow: false,
        cooking: false, programs: false, opera: false, nature: false,
        art: false, fitness: false, lectures: false
    });

    const [contentType, setContentType] = useState('series');

    const [episodes, setEpisodes] = useState([
        { id: 1, season: 1, episode: 1, title: '', description: '', cover: null, coverFile: null, content: null }
    ]);
    const [availableSeasons, setAvailableSeasons] = useState([1]);
    const [availableEpisodes, setAvailableEpisodes] = useState([1]);
    const [openDropdowns, setOpenDropdowns] = useState({});

    const [selectedReview, setSelectedReview] = useState(null);
    const [reviews, setReviews] = useState([]);

    const [isRatingOpen, setIsRatingOpen] = useState(false);
    const [isYearStartOpen, setIsYearStartOpen] = useState(false);
    const [isYearEndOpen, setIsYearEndOpen] = useState(false);
    const [isDurationHoursOpen, setIsDurationHoursOpen] = useState(false);
    const [isDurationMinutesOpen, setIsDurationMinutesOpen] = useState(false);

    const ratingDropdownRef = useRef(null);
    const yearStartDropdownRef = useRef(null);
    const yearEndDropdownRef = useRef(null);
    const durationHoursDropdownRef = useRef(null);
    const durationMinutesDropdownRef = useRef(null);
    const dropdownMenuClickRef = useRef(false);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const res = await api.get('/genres');
                setAllGenres(res.data);
            } catch (err) {
            }
        };
        fetchGenres();
    }, []);

    useEffect(() => {
        setActorsAndDirectors([
            ...selectedDirectors.map(d => ({ ...d, role: 'Режисер' })),
            ...selectedActors.map(a => ({ ...a, role: 'Актор' }))
        ]);
    }, [selectedDirectors, selectedActors]);

    const searchPersons = async (query) => {
        if (!query || query.length < 2) {
            setFoundPersons([]);
            return;
        }
        try {
            const res = await api.get(`/persons?search=${query}`);
            setFoundPersons(res.data);
        } catch (e) { }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCatalogChange = (key) => {
        setCatalog(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleImageUpload = (e, setPreview, setFile) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    };

    const handleImageReload = (inputRef) => {
        if (inputRef.current) inputRef.current.click();
    };

    const handleContentUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) setContentFile(file);
        e.target.value = '';
    };

    const uploadImageToServer = async (file) => {
        if (!file) return null;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await api.post('/admin/titles/upload-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data.url;
        } catch (error) {
            return null;
        }
    };

    const handleSave = async () => {
        try {

            const posterUrl = await uploadImageToServer(coverFile);
            const logoUrl = await uploadImageToServer(logoFile);
            const backgroundUrl = await uploadImageToServer(backgroundFile);

            const seasonsMap = {};
            availableSeasons.forEach(num => {
                seasonsMap[num] = {
                    seasonNumber: num,
                    seasonTitle: `Сезон ${num}`,
                    episodes: []
                };
            });

            for (const ep of episodes) {
                const epPosterUrl = await uploadImageToServer(ep.coverFile);
                const dto = {
                    episodeNumber: ep.episode,
                    title: ep.title || `Episode ${ep.episode}`,
                    description: ep.description,
                    posterUrl: epPosterUrl,
                    releaseDate: `${formData.yearStart}-01-01`
                };
                if (seasonsMap[ep.season]) {
                    seasonsMap[ep.season].episodes.push({
                        dto,
                        originalVideoFile: ep.content
                    });
                }
            }

            const payload = {
                title: formData.title,
                description: formData.description || formData.shortDescription,
                type: contentType === 'film' ? 'MOVIE' : 'SERIES',
                releaseDate: `${formData.yearStart}-01-01`,
                rating: parseFloat(formData.rating),
                posterUrl, logoUrl, backgroundUrl,

                genreIds: selectedGenres.map(g => g.id),
                persons: [
                    ...selectedActors.map(a => ({ personId: a.id, role: 'ACTOR' })),
                    ...selectedDirectors.map(d => ({ personId: d.id, role: 'DIRECTOR' }))
                ],

                seasons: contentType === 'series' ? Object.values(seasonsMap).map(s => ({
                    seasonNumber: s.seasonNumber,
                    seasonTitle: s.seasonTitle,
                    episodes: s.episodes.map(e => e.dto)
                })) : [],
                videoUrl: null
            };

            const createResponse = await api.post('/admin/titles', payload);
            const savedTitle = createResponse.data;
            const titleId = savedTitle.id;


            if (contentType === 'film' && contentFile) {
                const fd = new FormData(); fd.append('file', contentFile);
                await api.post(`/titles/${titleId}/feature-video`, fd, { headers: { 'Content-Type': 'multipart/form-data' }});
            } else if (contentType === 'series') {
                for (const savedSeason of savedTitle.seasons) {
                    for (const savedEp of savedSeason.episodes) {
                        const local = seasonsMap[savedSeason.seasonNumber].episodes
                            .find(l => l.dto.episodeNumber === savedEp.episodeNumber);
                        if (local?.originalVideoFile) {
                            const fd = new FormData(); fd.append('file', local.originalVideoFile);
                            await api.post(`/episodes/${savedEp.id}/video`, fd, { headers: { 'Content-Type': 'multipart/form-data' }});
                        }
                    }
                }
            }

            alert("Успішно збережено!");
            navigate('/');
        } catch (error) {
            alert("Сталася помилка при збереженні: " + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = () => {
    };

    const closeAllDropdownsExcept = (exceptStateSetter) => {
        if (exceptStateSetter !== setIsRatingOpen) setIsRatingOpen(false);
        if (exceptStateSetter !== setIsYearStartOpen) setIsYearStartOpen(false);
        if (exceptStateSetter !== setIsYearEndOpen) setIsYearEndOpen(false);
        if (exceptStateSetter !== setIsDurationHoursOpen) setIsDurationHoursOpen(false);
        if (exceptStateSetter !== setIsDurationMinutesOpen) setIsDurationMinutesOpen(false);
        if (exceptStateSetter !== setIsGenreDropdownOpen) setIsGenreDropdownOpen(false);
        if (exceptStateSetter !== setIsDirectorDropdownOpen) setIsDirectorDropdownOpen(false);
        if (exceptStateSetter !== setIsActorDropdownOpen) setIsActorDropdownOpen(false);
    };

    const handleGenreToggle = (genre) => {
        setSelectedGenres(prev => {
            if (prev.find(g => g.id === genre.id)) {
                return prev.filter(g => g.id !== genre.id);
            } else {
                return [...prev, genre];
            }
        });
    };

    const handlePersonToggle = (person, type) => {
        const setter = type === 'actor' ? setSelectedActors : setSelectedDirectors;
        const inputSetter = type === 'actor' ? setActorInputValue : setDirectorInputValue;
        setter(prev => {
            const exists = prev.find(p => p.id === person.id);
            return exists ? prev.filter(p => p.id !== person.id) : [...prev, person];
        });
        inputSetter('');
    };

    const handleDirectorToggle = (director) => {
        handlePersonToggle(director, 'director');
    };

    const handleActorToggle = (actor) => {
        handlePersonToggle(actor, 'actor');
    };

    const handleRemovePersonFromList = (id) => {
        setSelectedActors(prev => prev.filter(a => a.id !== id));
        setSelectedDirectors(prev => prev.filter(d => d.id !== id));
    };

    const handleClearAllGenres = () => setSelectedGenres([]);
    const handleClearAllDirectors = () => setSelectedDirectors([]);
    const handleClearAllActors = () => setSelectedActors([]);

    const handleAddNewGenre = () => {
    };

    const handleAddEpisode = () => {
        setEpisodes(prev => {
            const maxEpisode = prev.length > 0 ? Math.max(...prev.map(ep => ep.episode)) : 0;
            return [...prev, {
                id: Date.now(),
                season: 1,
                episode: maxEpisode + 1,
                title: '',
                description: '',
                cover: null, coverFile: null, content: null
            }];
        });
    };

    const handleAddSeason = (episodeId) => {
        setAvailableSeasons(prev => {
            const newSeason = prev.length > 0 ? Math.max(...prev) + 1 : 1;
            if (!prev.includes(newSeason)) {
                return [...prev, newSeason];
            }
            return prev;
        });
    };

    const handleDeleteSeason = (seasonNum, e) => {
        e.stopPropagation();
        setAvailableSeasons(prev => prev.filter(s => s !== seasonNum));
        setEpisodes(prev => prev.filter(ep => ep.season !== seasonNum));
    };

    const handleAddEpisodeToList = (episodeId) => {
        setAvailableEpisodes(prev => {
            const newEpisode = prev.length > 0 ? Math.max(...prev) + 1 : 1;
            if (!prev.includes(newEpisode)) {
                return [...prev, newEpisode];
            }
            return prev;
        });
    };

    const handleDeleteEpisodeFromList = (episodeNum, e) => {
        e.stopPropagation();
        setAvailableEpisodes(prev => prev.filter(e => e !== episodeNum));
        setEpisodes(prev => prev.filter(ep => ep.episode !== episodeNum));
    };

    const handleDeleteEpisode = (id) => {
        setEpisodes(prev => prev.filter(ep => ep.id !== id));
    };

    const handleDeleteReview = (id) => {
        setReviews(prev => prev.filter(review => review.id !== id));
        if (selectedReview && selectedReview.id === id) {
            setSelectedReview(null);
        }
    };

    const handleToggleReview = (review) => setSelectedReview(review);
    const handleCloseReviewModal = () => setSelectedReview(null);

    useEffect(() => {
        if (selectedReview) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [selectedReview]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownMenuClickRef.current) {
                dropdownMenuClickRef.current = false;
                return;
            }
            const clickedMenu = e.target.closest('.edit_movie_dropdown_menu');
            const clickedOption = e.target.closest('.edit_movie_dropdown_option');
            const clickedWrapper = e.target.closest('.edit_movie_dropdown_wrapper');
            const clickedGenreMenu = e.target.closest('.edit_movie_genre_dropdown_menu');
            const clickedGenreOption = e.target.closest('.edit_movie_genre_option');
            const clickedGenreWrapper = e.target.closest('.edit_movie_genre_dropdown_wrapper');

            if (clickedMenu || clickedOption || clickedGenreMenu || clickedGenreOption) {
                return;
            }

            if (!clickedWrapper && !clickedGenreWrapper) {
                closeAllDropdownsExcept(null);
            }

            if (!e.target.closest('.edit_movie_season_list_wrapper') &&
                !e.target.closest('.edit_movie_episode_list_wrapper')) {
                setOpenDropdowns({});
            }
        };

        const handleScroll = (e) => {
            const target = e.target;
            if (target && typeof target.closest === 'function') {
                const clickedMenu = target.closest('.edit_movie_dropdown_menu');
                const clickedGenreMenu = target.closest('.edit_movie_genre_dropdown_menu');
                if (clickedMenu || clickedGenreMenu) return;
            }
            closeAllDropdownsExcept(null);
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, []);

    const renderDropdown = (label, value, options, isOpen, setIsOpen, onChange, id, dropdownRef) => {
        const handleToggle = () => {
            if (!isOpen) {
                closeAllDropdownsExcept(setIsOpen);
            }
            setIsOpen(!isOpen);
        };

        const getOpensUpward = () => {
            if (!isOpen || !dropdownRef.current) return false;
            const rect = dropdownRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            return spaceBelow < 200 + 10;
        };

        const opensUpward = getOpensUpward();

        return (
            <div className="edit_movie_dropdown_block">
                <div className="edit_movie_dropdown_wrapper" ref={dropdownRef}>
                    <div
                        className={`edit_movie_dropdown ${isOpen ? 'open' : ''} ${value ? 'has-value' : ''}`}
                        onClick={handleToggle}
                    >
                        <span className="edit_movie_dropdown_value">{value || ''}</span>
                    </div>
                    {isOpen && (
                        <div
                            className={`edit_movie_dropdown_menu ${opensUpward ? 'opens-upward' : ''}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {options.map((option, index) => (
                                <div
                                    key={index}
                                    className={`edit_movie_dropdown_option ${value === option ? 'selected' : ''}`}
                                    onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        dropdownMenuClickRef.current = true;
                                        onChange(option);
                                        setTimeout(() => {
                                            setIsOpen(false);
                                            dropdownMenuClickRef.current = false;
                                        }, 100);
                                    }}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <label htmlFor={id} className={value ? 'edit_movie_dropdown_label_active' : ''}>{label}</label>
            </div>
        );
    };

    return (
        <div className="edit_movie_page">
            <div className="edit_movie_container">
                <div className="edit_movie_back" onClick={() => navigate('/')}>
                    <span className="edit_movie_back_icon"></span>
                    До списку
                </div>

                <div className="edit_movie_title"><Trans i18nKey="admin.editMovie.title" /></div>

                <div className="edit_movie_content">
                    <div className="edit_movie_images">
                        <div className="edit_movie_section_title"><Trans i18nKey="admin.editMovie.images" /></div>

                        <div className="edit_movie_images_row">
                            <div className="edit_movie_image_upload">
                                <div className="edit_movie_image_label"><Trans i18nKey="admin.editMovie.cover" /></div>
                                <input
                                    ref={coverInputRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleImageUpload(e, setCoverImage, setCoverFile)}
                                />
                                {coverImage ? (
                                    <>
                                        <div className="edit_movie_cover_placeholder has-image">
                                            <img src={coverImage} alt="Cover" className="edit_movie_image_preview" />
                                        </div>
                                        <div className="edit_movie_image_buttons">
                                            <button
                                                className="edit_movie_reload_button"
                                                onClick={() => handleImageReload(coverInputRef)}
                                            >
                                                <Trans i18nKey="admin.editMovie.reload" />
                                                <span className="edit_movie_reload_icon"></span>
                                            </button>
                                            <button className="edit_movie_delete_button" onClick={() => { setCoverImage(null); setCoverFile(null); }}>
                                                <span className="edit_movie_delete_icon"></span>
                                                <Trans i18nKey="admin.editMovie.delete" />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="edit_movie_cover_placeholder">
                                        <button
                                            className="edit_movie_upload_button"
                                            onClick={() => handleImageReload(coverInputRef)}
                                        >
                                            <Trans i18nKey="admin.editMovie.upload" />
                                            <span className="edit_movie_upload_icon"></span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="edit_movie_image_upload">
                                <div className="edit_movie_image_label"><Trans i18nKey="admin.editMovie.logo" /></div>
                                <input
                                    ref={logoInputRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleImageUpload(e, setLogoImage, setLogoFile)}
                                />
                                {logoImage ? (
                                    <>
                                        <div className="edit_movie_logo_placeholder has-image">
                                            <img src={logoImage} alt="Logo" className="edit_movie_image_preview" />
                                        </div>
                                        <div className="edit_movie_image_buttons">
                                            <button
                                                className="edit_movie_reload_button"
                                                onClick={() => handleImageReload(logoInputRef)}
                                            >
                                                <Trans i18nKey="admin.editMovie.reload" />
                                                <span className="edit_movie_reload_icon"></span>
                                            </button>
                                            <button className="edit_movie_delete_button" onClick={() => { setLogoImage(null); setLogoFile(null); }}>
                                                <span className="edit_movie_delete_icon"></span>
                                                Видалити
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="edit_movie_logo_placeholder">
                                        <button
                                            className="edit_movie_upload_button"
                                            onClick={() => handleImageReload(logoInputRef)}
                                        >
                                            <Trans i18nKey="admin.editMovie.upload" />
                                            <span className="edit_movie_upload_icon"></span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="edit_movie_image_upload">
                            <div className="edit_movie_image_label"><Trans i18nKey="admin.editMovie.background" /></div>
                            <input
                                ref={backgroundInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handleImageUpload(e, setBackgroundImage, setBackgroundFile)}
                            />
                            {backgroundImage ? (
                                <>
                                    <div className="edit_movie_background_placeholder has-image">
                                        <img src={backgroundImage} alt="Background" className="edit_movie_image_preview" />
                                    </div>
                                    <div className="edit_movie_image_buttons edit_movie_background_buttons">
                                        <button
                                            className="edit_movie_reload_button"
                                            onClick={() => handleImageReload(backgroundInputRef)}
                                        >
                                            Перезавантажити
                                            <span className="edit_movie_reload_icon"></span>
                                        </button>
                                        <button className="edit_movie_delete_button" onClick={() => { setBackgroundImage(null); setBackgroundFile(null); }}>
                                            <span className="edit_movie_delete_icon"></span>
                                            Видалити
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="edit_movie_background_placeholder">
                                    <button
                                        className="edit_movie_upload_button"
                                        onClick={() => handleImageReload(backgroundInputRef)}
                                    >
                                        Завантажити
                                        <span className="edit_movie_upload_icon"></span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="edit_movie_info">
                        <div className="edit_movie_section">
                            <div className="edit_movie_section_title">Основна інформація</div>

                            <div className="edit_movie_input_group">
                                <label className="edit_movie_input_label"><Trans i18nKey="admin.editMovie.movieTitle" /></label>
                                <input
                                    type="text"
                                    name="title"
                                    className="edit_movie_input"
                                    placeholder="Введіть назву фільму чи серіалу"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="edit_movie_input_group">
                                <label className="edit_movie_input_label"><Trans i18nKey="admin.editMovie.shortDescription" /></label>
                                <input
                                    type="text"
                                    name="shortDescription"
                                    className="edit_movie_input"
                                    placeholder={t('admin.editMovie.shortDescription')}
                                    value={formData.shortDescription}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="edit_movie_input_group">
                                <label className="edit_movie_input_label"><Trans i18nKey="admin.editMovie.director" /></label>
                                <div className="edit_movie_genre_dropdown_wrapper" ref={directorDropdownRef}>
                                    <div
                                        className={`edit_movie_genre_dropdown ${isDirectorDropdownOpen ? 'open' : ''} ${selectedDirectors.length > 0 || directorInputValue ? 'has-value' : ''}`}
                                        onClick={() => {
                                            if (directorInputRef.current) directorInputRef.current.focus();
                                            closeAllDropdownsExcept(setIsDirectorDropdownOpen);
                                            setIsDirectorDropdownOpen(!isDirectorDropdownOpen);
                                        }}
                                    >
                                        <div className="edit_movie_search_icon"></div>
                                        <div className="edit_movie_genre_dropdown_content">
                                            {selectedDirectors.map((director, index) => (
                                                <span
                                                    key={index}
                                                    className="edit_movie_genre_tag"
                                                    onClick={(e) => { e.stopPropagation(); handleDirectorToggle(director); }}
                                                >
                                                    {director.name}
                                                    <span className="edit_movie_genre_tag_close"></span>
                                                </span>
                                            ))}
                                            <input
                                                ref={directorInputRef}
                                                type="text"
                                                className="edit_movie_genre_input"
                                                value={directorInputValue}
                                                onChange={(e) => {
                                                    setDirectorInputValue(e.target.value);
                                                    searchPersons(e.target.value);
                                                    if (!isDirectorDropdownOpen) setIsDirectorDropdownOpen(true);
                                                }}
                                                onFocus={() => {
                                                    closeAllDropdownsExcept(setIsDirectorDropdownOpen);
                                                    setIsDirectorDropdownOpen(true);
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                                placeholder={selectedDirectors.length === 0 ? t('admin.editMovie.directors') : ''}
                                            />
                                            {(directorInputValue || selectedDirectors.length > 1) && (
                                                <span
                                                    className="edit_movie_genre_clear"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (directorInputValue) setDirectorInputValue('');
                                                        else handleClearAllDirectors();
                                                    }}
                                                ></span>
                                            )}
                                        </div>
                                    </div>
                                    {isDirectorDropdownOpen && foundPersons.length > 0 && createPortal(
                                        (() => {
                                            const rect = directorDropdownRef.current.getBoundingClientRect();
                                            const spaceBelow = window.innerHeight - rect.bottom;
                                            const estimatedMenuHeight = 200;
                                            const opensUpward = spaceBelow < estimatedMenuHeight + 10;
                                            return (
                                                <div
                                                    className={`edit_movie_genre_dropdown_menu ${opensUpward ? 'opens-upward' : ''}`}
                                                    style={{
                                                        position: 'fixed',
                                                        ...(opensUpward ? { bottom: `${window.innerHeight - rect.top + 5}px` } : { top: `${rect.bottom + 5}px` }),
                                                        left: `${rect.left}px`,
                                                        width: `${rect.width}px`,
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                {foundPersons.map((person, index) => (
                                                        <div
                                                            key={index}
                                                            className="edit_movie_genre_option"
                                                            onClick={(e) => {
                                                                e.preventDefault(); e.stopPropagation();
                                                                handleDirectorToggle(person);
                                                            }}
                                                        >
                                                            <span className={`edit_movie_genre_checkbox ${selectedDirectors.find(d => d.id === person.id) ? 'checked' : ''}`}></span>
                                                            {person.name}
                                                        </div>
                                                    ))}
                                                <button
                                                    className="edit_movie_genre_add_button"
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                                >
                                                    <span className="edit_movie_genre_add_icon"></span>
                                                    <Trans i18nKey="admin.editMovie.addNewDirector" />
                                                </button>
                                            </div>
                                            );
                                        })(),
                                        document.body
                                    )}
                                </div>
                            </div>

                            <div className="edit_movie_input_group">
                                <label className="edit_movie_input_label"><Trans i18nKey="admin.editMovie.actors" /></label>
                                <div className="edit_movie_genre_dropdown_wrapper" ref={actorDropdownRef}>
                                    <div
                                        className={`edit_movie_genre_dropdown ${isActorDropdownOpen ? 'open' : ''} ${selectedActors.length > 0 || actorInputValue ? 'has-value' : ''}`}
                                        onClick={() => {
                                            if (actorInputRef.current) actorInputRef.current.focus();
                                            closeAllDropdownsExcept(setIsActorDropdownOpen);
                                            setIsActorDropdownOpen(!isActorDropdownOpen);
                                        }}
                                    >
                                        <div className="edit_movie_search_icon"></div>
                                        <div className="edit_movie_genre_dropdown_content">
                                            {selectedActors.map((actor, index) => (
                                                <span
                                                    key={index}
                                                    className="edit_movie_genre_tag"
                                                    onClick={(e) => { e.stopPropagation(); handleActorToggle(actor); }}
                                                >
                                                    {actor.name}
                                                    <span className="edit_movie_genre_tag_close"></span>
                                                </span>
                                            ))}
                                            <input
                                                ref={actorInputRef}
                                                type="text"
                                                className="edit_movie_genre_input"
                                                value={actorInputValue}
                                                onChange={(e) => {
                                                    setActorInputValue(e.target.value);
                                                    searchPersons(e.target.value);
                                                    if (!isActorDropdownOpen) setIsActorDropdownOpen(true);
                                                }}
                                                onFocus={() => {
                                                    closeAllDropdownsExcept(setIsActorDropdownOpen);
                                                    setIsActorDropdownOpen(true);
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                                placeholder={selectedActors.length === 0 ? t('admin.editMovie.movieActors') : ''}
                                            />
                                            {(actorInputValue || selectedActors.length > 0) && (
                                                <span
                                                    className="edit_movie_genre_clear"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (actorInputValue) setActorInputValue('');
                                                        else handleClearAllActors();
                                                    }}
                                                ></span>
                                            )}
                                        </div>
                                    </div>
                                    {isActorDropdownOpen && foundPersons.length > 0 && createPortal(
                                        (() => {
                                            const rect = actorDropdownRef.current.getBoundingClientRect();
                                            const spaceBelow = window.innerHeight - rect.bottom;
                                            const estimatedMenuHeight = 200;
                                            const opensUpward = spaceBelow < estimatedMenuHeight + 10;
                                            return (
                                                <div
                                                    className={`edit_movie_genre_dropdown_menu ${opensUpward ? 'opens-upward' : ''}`}
                                                    style={{
                                                        position: 'fixed',
                                                        ...(opensUpward ? { bottom: `${window.innerHeight - rect.top + 5}px` } : { top: `${rect.bottom + 5}px` }),
                                                        left: `${rect.left}px`,
                                                        width: `${rect.width}px`,
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                {foundPersons.map((person, index) => (
                                                        <div
                                                            key={index}
                                                            className="edit_movie_genre_option"
                                                            onClick={(e) => {
                                                                e.preventDefault(); e.stopPropagation();
                                                                handleActorToggle(person);
                                                            }}
                                                        >
                                                            <span className={`edit_movie_genre_checkbox ${selectedActors.find(a => a.id === person.id) ? 'checked' : ''}`}></span>
                                                            {person.name}
                                                        </div>
                                                    ))}
                                                <button
                                                    className="edit_movie_genre_add_button"
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                                >
                                                    <span className="edit_movie_genre_add_icon"></span>
                                                    Новий актор
                                                </button>
                                            </div>
                                            );
                                        })(),
                                        document.body
                                    )}
                                </div>
                            </div>

                            <div className="edit_movie_details_row">
                                <div className="edit_movie_detail_item">
                                    <div className="edit_movie_detail_label">Оцінка</div>
                                    {renderDropdown('', formData.rating, ratings, isRatingOpen, setIsRatingOpen, (v) => setFormData(p => ({ ...p, rating: v })), 'rating', ratingDropdownRef)}
                                </div>

                                <div className="edit_movie_detail_item">
                                    <div className="edit_movie_detail_label"><Trans i18nKey="admin.editMovie.year" /></div>
                                    <div className="edit_movie_year_inputs">
                                        {renderDropdown('', formData.yearStart, years, isYearStartOpen, setIsYearStartOpen, (v) => setFormData(p => ({ ...p, yearStart: v })), 'yearStart', yearStartDropdownRef)}
                                        <span className="edit_movie_dash">-</span>
                                        {renderDropdown('', formData.yearEnd, years, isYearEndOpen, setIsYearEndOpen, (v) => setFormData(p => ({ ...p, yearEnd: v })), 'yearEnd', yearEndDropdownRef)}
                                    </div>
                                </div>

                                <div className="edit_movie_detail_item">
                                    <div className="edit_movie_detail_label"><Trans i18nKey="admin.editMovie.duration" /></div>
                                    <div className="edit_movie_duration_inputs">
                                        {renderDropdown('', formData.durationHours, hours, isDurationHoursOpen, setIsDurationHoursOpen, (v) => setFormData(p => ({ ...p, durationHours: v })), 'durationHours', durationHoursDropdownRef)}
                                        <span className="edit_movie_duration_unit">h</span>
                                        {renderDropdown('', formData.durationMinutes, minutes, isDurationMinutesOpen, setIsDurationMinutesOpen, (v) => setFormData(p => ({ ...p, durationMinutes: v })), 'durationMinutes', durationMinutesDropdownRef)}
                                        <span className="edit_movie_duration_unit">min</span>
                                    </div>
                                </div>

                                <div className="edit_movie_detail_item">
                                    <div className="edit_movie_detail_label">Жанр</div>
                                    <div className="edit_movie_genre_dropdown_wrapper" ref={genreDropdownRef}>
                                        <div
                                            className={`edit_movie_genre_dropdown ${isGenreDropdownOpen ? 'open' : ''} ${selectedGenres.length > 0 || genreInputValue ? 'has-value' : ''}`}
                                            onClick={() => {
                                                if (genreInputRef.current) genreInputRef.current.focus();
                                                closeAllDropdownsExcept(setIsGenreDropdownOpen);
                                                setIsGenreDropdownOpen(!isGenreDropdownOpen);
                                            }}
                                        >
                                            <div className="edit_movie_search_icon"></div>
                                            <div className="edit_movie_genre_dropdown_content">
                                                {selectedGenres.map((genre, index) => (
                                                    <span
                                                        key={index}
                                                        className="edit_movie_genre_tag"
                                                        onClick={(e) => { e.stopPropagation(); handleGenreToggle(genre); }}
                                                    >
                                                        {genre.name}
                                                        <span className="edit_movie_genre_tag_close"></span>
                                                    </span>
                                                ))}
                                                <input
                                                    ref={genreInputRef}
                                                    type="text"
                                                    className="edit_movie_genre_input"
                                                    value={genreInputValue}
                                                    onChange={(e) => {
                                                        setGenreInputValue(e.target.value);
                                                        if (!isGenreDropdownOpen) setIsGenreDropdownOpen(true);
                                                    }}
                                                    onFocus={() => {
                                                        closeAllDropdownsExcept(setIsGenreDropdownOpen);
                                                        setIsGenreDropdownOpen(true);
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                    placeholder={selectedGenres.length === 0 ? 'Опис фільму, цікаві факти, короткий зміст' : ''}
                                                />
                                                {(genreInputValue || selectedGenres.length > 0) && (
                                                    <span
                                                        className="edit_movie_genre_clear"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (genreInputValue) setGenreInputValue('');
                                                            if (selectedGenres.length > 0) handleClearAllGenres();
                                                        }}
                                                    ></span>
                                                )}
                                            </div>
                                        </div>
                                        {isGenreDropdownOpen && genreDropdownRef.current && (() => {
                                            const rect = genreDropdownRef.current.getBoundingClientRect();
                                            const spaceBelow = window.innerHeight - rect.bottom;
                                            const opensUpward = spaceBelow < 300 + 10;
                                            return (
                                                <div
                                                    className={`edit_movie_genre_dropdown_menu ${opensUpward ? 'opens-upward' : ''}`}
                                                    style={{
                                                        position: 'absolute',
                                                        ...(opensUpward ? { bottom: `${rect.height + 5}px` } : { top: `${rect.bottom - rect.top + 5}px` }),
                                                        left: '0px',
                                                        width: `${rect.width}px`,
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                {allGenres
                                                    .filter(genre => genre.name.toLowerCase().includes(genreInputValue.toLowerCase()))
                                                    .map((genre, index) => (
                                                        <div
                                                            key={index}
                                                            className="edit_movie_genre_option"
                                                            onClick={(e) => {
                                                                e.preventDefault(); e.stopPropagation();
                                                                handleGenreToggle(genre);
                                                            }}
                                                        >
                                                            <span className={`edit_movie_genre_checkbox ${selectedGenres.find(sg => sg.id === genre.id) ? 'checked' : ''}`}></span>
                                                            {genre.name}
                                                        </div>
                                                    ))}
                                                <button
                                                    className="edit_movie_genre_add_button"
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddNewGenre(); }}
                                                >
                                                    <span className="edit_movie_genre_add_icon"></span>
                                                    Нова категорія/жанр
                                                </button>
                                            </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="edit_movie_section">
                            <div className="edit_movie_section_title">Каталог</div>
                            <div className="edit_movie_catalog">
                                <div className="edit_movie_catalog_row">
                                    {['films', 'series', 'cartoons', 'animatedSeries', 'interview'].map(key => (
                                        <label key={key} className="edit_movie_checkbox_label">
                                            <input type="checkbox" checked={catalog[key]} onChange={() => handleCatalogChange(key)} />
                                            <span className="edit_movie_checkbox_custom"></span> {key}
                                        </label>
                                    ))}
                                </div>
                                <div className="edit_movie_catalog_row">
                                    {['anime', 'concerts', 'realityShow', 'cooking', 'programs'].map(key => (
                                        <label key={key} className="edit_movie_checkbox_label">
                                            <input type="checkbox" checked={catalog[key]} onChange={() => handleCatalogChange(key)} />
                                            <span className="edit_movie_checkbox_custom"></span> {key}
                                        </label>
                                    ))}
                                </div>
                                <div className="edit_movie_catalog_row">
                                    {['opera', 'nature', 'art', 'fitness', 'lectures'].map(key => (
                                        <label key={key} className="edit_movie_checkbox_label">
                                            <input type="checkbox" checked={catalog[key]} onChange={() => handleCatalogChange(key)} />
                                            <span className="edit_movie_checkbox_custom"></span> {key}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="edit_movie_section">
                            <div className="edit_movie_section_title">Опис</div>
                            <textarea
                                name="description"
                                className="edit_movie_textarea"
                                placeholder="Опис фільму, цікаві факти, короткий зміст"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="edit_movie_section">
                            <div className="edit_movie_section_title">Актори та режирежисери</div>
                            <div className="edit_movie_actors_list">
                                <div className="edit_movie_actor_item edit_movie_actor_placeholder">
                                    <div className="edit_movie_actor_avatar"></div>
                                    <button className="edit_movie_add_actor_button" onClick={() => { setIsActorDropdownOpen(true); if (actorInputRef.current) actorInputRef.current.focus(); }}>
                                        <span className="edit_movie_add_icon"></span>
                                        Додати
                                    </button>
                                </div>
                                {actorsAndDirectors.map(actor => (
                                    <div key={actor.id} className="edit_movie_actor_item">
                                        <div className="edit_movie_actor_avatar">
                                            <img src={actor.photoUrl || 'https://via.placeholder.com/150'} alt={actor.name} />
                                        </div>
                                        <button
                                            className="edit_movie_actor_delete"
                                            onClick={() => handleRemovePersonFromList(actor.id)}
                                        >
                                            <span className="edit_movie_actor_delete_icon"></span>
                                        </button>
                                        <div className="edit_movie_actor_name">{actor.name}</div>
                                        <div className="edit_movie_actor_role">{actor.role}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="edit_movie_section">
                            <div className="edit_movie_content_tabs">
                                <button
                                    className={`edit_movie_tab ${contentType === 'film' ? 'active' : ''}`}
                                    onClick={() => setContentType('film')}
                                >
                                    Фільм
                                </button>
                                <button
                                    className={`edit_movie_tab ${contentType === 'series' ? 'active' : ''}`}
                                    onClick={() => setContentType('series')}
                                >
                                    Серіал
                                </button>
                            </div>

                            {contentType === 'film' && (
                                <div className="edit_movie_film_upload_area">
                                    <input
                                        ref={contentInputRef}
                                        type="file"
                                        accept="video/*"
                                        style={{ display: 'none' }}
                                        onChange={handleContentUpload}
                                    />
                                    {contentFile ? (
                                        <div className="edit_movie_content_file_info">
                                            <div className="edit_movie_content_file_name">{contentFile.name}</div>
                                            <button
                                                className="edit_movie_content_delete_button"
                                                onClick={() => {
                                                    setContentFile(null);
                                                    if (contentInputRef.current) contentInputRef.current.value = '';
                                                }}
                                            >
                                                <span className="edit_movie_content_delete_icon"></span>
                                                Видалити
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className="edit_movie_upload_content_button"
                                            onClick={() => {
                                                if (contentInputRef.current) contentInputRef.current.click();
                                            }}
                                        >
                                            <span className="edit_movie_upload_content_icon"></span>
                                            Завантажити контент
                                        </button>
                                    )}
                                </div>
                            )}

                            {contentType === 'series' && (
                                <div className="edit_movie_episodes">
                                    {episodes.map(episode => (
                                        <div key={episode.id} className="edit_movie_episode_block">
                                            <div className="edit_movie_episode_cover">
                                                <div className="edit_movie_episode_cover_label"><Trans i18nKey="admin.editMovie.episodeCover" /></div>
                                                <input
                                                    ref={el => episodeCoverInputRefs.current[episode.id] = el}
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setEpisodes(prev => prev.map(ep =>
                                                                    ep.id === episode.id ? { ...ep, cover: reader.result, coverFile: file } : ep
                                                                ));
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                        e.target.value = '';
                                                    }}
                                                />
                                                {episode.cover ? (
                                                    <>
                                                        <div className="edit_movie_episode_cover_placeholder has-image">
                                                            <img src={episode.cover} alt="Episode cover" className="edit_movie_image_preview" />
                                                        </div>
                                                        <div className="edit_movie_image_buttons">
                                                            <button
                                                                className="edit_movie_reload_button"
                                                                onClick={() => episodeCoverInputRefs.current[episode.id].click()}
                                                            >
                                                                Перезавантажити
                                                                <span className="edit_movie_reload_icon"></span>
                                                            </button>
                                                            <button
                                                                className="edit_movie_delete_button"
                                                                onClick={() => {
                                                                    setEpisodes(prev => prev.map(ep =>
                                                                        ep.id === episode.id ? { ...ep, cover: null, coverFile: null } : ep
                                                                    ));
                                                                }}
                                                            >
                                                                <span className="edit_movie_delete_icon"></span>
                                                                Видалити
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="edit_movie_episode_cover_placeholder">
                                                        <button
                                                            className="edit_movie_upload_button"
                                                            onClick={() => episodeCoverInputRefs.current[episode.id].click()}
                                                        >
                                                            Завантажити
                                                            <span className="edit_movie_upload_icon"></span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="edit_movie_episode_content">
                                                <div className="edit_movie_episode_controls">
                                                    <div className="edit_movie_season_list_wrapper">
                                                        <div
                                                            className={`edit_movie_season_dropdown ${openDropdowns[`season-${episode.id}`] ? 'open' : ''}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenDropdowns(prev => ({
                                                                    ...prev,
                                                                    [`season-${episode.id}`]: !prev[`season-${episode.id}`],
                                                                    [`episode-${episode.id}`]: false
                                                                }));
                                                            }}
                                                        >
                                                            <span className="edit_movie_season_dropdown_value">{episode.season} Сезон</span>
                                                            <span className={`edit_movie_season_dropdown_arrow ${openDropdowns[`season-${episode.id}`] ? 'open' : ''}`}></span>
                                                        </div>
                                                        {openDropdowns[`season-${episode.id}`] && (
                                                            <div className="edit_movie_season_dropdown_menu">
                                                                <div className="edit_movie_season_list">
                                                                    {availableSeasons.map(seasonNum => (
                                                                        <div
                                                                            key={seasonNum}
                                                                            className={`edit_movie_season_list_item ${episode.season === seasonNum ? 'selected' : ''}`}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setEpisodes(prev => prev.map(ep =>
                                                                                    ep.id === episode.id ? { ...ep, season: seasonNum } : ep
                                                                                ));
                                                                                setOpenDropdowns(prev => ({ ...prev, [`season-${episode.id}`]: false }));
                                                                            }}
                                                                        >
                                                                            <span className="edit_movie_season_list_item_text">{seasonNum} Сезон</span>
                                                                            <span
                                                                                className="edit_movie_season_list_item_delete"
                                                                                onClick={(e) => handleDeleteSeason(seasonNum, e)}
                                                                            ></span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <button
                                                                    className="edit_movie_season_list_add_button"
                                                                    onMouseDown={(e) => e.stopPropagation()}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation(); e.preventDefault();
                                                                        handleAddSeason(episode.id);
                                                                    }}
                                                                >
                                                                    <span className="edit_movie_season_list_add_icon"></span>
                                                                    Додати
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="edit_movie_episode_list_wrapper">
                                                        <div
                                                            className={`edit_movie_episode_dropdown ${openDropdowns[`episode-${episode.id}`] ? 'open' : ''}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenDropdowns(prev => ({
                                                                    ...prev,
                                                                    [`episode-${episode.id}`]: !prev[`episode-${episode.id}`],
                                                                    [`season-${episode.id}`]: false
                                                                }));
                                                            }}
                                                        >
                                                            <span className="edit_movie_episode_dropdown_value">{episode.episode} Серія</span>
                                                            <span className={`edit_movie_episode_dropdown_arrow ${openDropdowns[`episode-${episode.id}`] ? 'open' : ''}`}></span>
                                                        </div>
                                                        {openDropdowns[`episode-${episode.id}`] && (
                                                            <div className="edit_movie_episode_dropdown_menu">
                                                                <div className="edit_movie_episode_list">
                                                                    {availableEpisodes.map(episodeNum => (
                                                                        <div
                                                                            key={episodeNum}
                                                                            className={`edit_movie_episode_list_item ${episode.episode === episodeNum ? 'selected' : ''}`}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setEpisodes(prev => prev.map(ep =>
                                                                                    ep.id === episode.id ? { ...ep, episode: episodeNum } : ep
                                                                                ));
                                                                                setOpenDropdowns(prev => ({ ...prev, [`episode-${episode.id}`]: false }));
                                                                            }}
                                                                        >
                                                                            <span className="edit_movie_episode_list_item_text">{episodeNum} Серія</span>
                                                                            <span
                                                                                className="edit_movie_episode_list_item_delete"
                                                                                onClick={(e) => handleDeleteEpisodeFromList(episodeNum, e)}
                                                                            ></span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <button
                                                                    className="edit_movie_episode_list_add_button"
                                                                    onMouseDown={(e) => e.stopPropagation()}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation(); e.preventDefault();
                                                                        handleAddEpisodeToList(episode.id);
                                                                    }}
                                                                >
                                                                    <span className="edit_movie_episode_list_add_icon"></span>
                                                                    Додати
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button
                                                        className="edit_movie_episode_delete_button"
                                                        onClick={() => handleDeleteEpisode(episode.id)}
                                                    >
                                                        <span className="edit_movie_delete_icon"></span>
                                                        Видалити
                                                    </button>
                                                </div>
                                                <div className="edit_movie_input_group">
                                                    <label className="edit_movie_input_label"><Trans i18nKey="admin.editMovie.episodeTitle" /></label>
                                                    <input
                                                        type="text"
                                                        className="edit_movie_input"
                                                        placeholder={t('admin.editMovie.episodeTitle')}
                                                        value={episode.title}
                                                        onChange={(e) => {
                                                            setEpisodes(prev => prev.map(ep =>
                                                                ep.id === episode.id ? { ...ep, title: e.target.value } : ep
                                                            ));
                                                        }}
                                                    />
                                                </div>
                                                <div className="edit_movie_input_group">
                                                    <label className="edit_movie_input_label">Опис</label>
                                                    <textarea
                                                        className="edit_movie_textarea"
                                                        placeholder="Короткий опис серии"
                                                        value={episode.description}
                                                        onChange={(e) => {
                                                            setEpisodes(prev => prev.map(ep =>
                                                                ep.id === episode.id ? { ...ep, description: e.target.value } : ep
                                                            ));
                                                        }}
                                                    />
                                                </div>
                                                <input
                                                    ref={el => episodeContentInputRefs.current[episode.id] = el}
                                                    type="file"
                                                    accept="video/*"
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            setEpisodes(prev => prev.map(ep =>
                                                                ep.id === episode.id ? { ...ep, content: file } : ep
                                                            ));
                                                        }
                                                        e.target.value = '';
                                                    }}
                                                />
                                                {episode.content ? (
                                                    <div className="edit_movie_episode_content_file_info">
                                                        <div className="edit_movie_episode_content_file_name">{episode.content.name}</div>
                                                        <button
                                                            className="edit_movie_episode_content_delete_button"
                                                            onClick={() => {
                                                                setEpisodes(prev => prev.map(ep =>
                                                                    ep.id === episode.id ? { ...ep, content: null } : ep
                                                                ));
                                                                if (episodeContentInputRefs.current[episode.id]) {
                                                                    episodeContentInputRefs.current[episode.id].value = '';
                                                                }
                                                            }}
                                                        >
                                                            <span className="edit_movie_episode_content_delete_icon"></span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="edit_movie_upload_content_button"
                                                        onClick={() => {
                                                            if (episodeContentInputRefs.current[episode.id]) {
                                                                episodeContentInputRefs.current[episode.id].click();
                                                            }
                                                        }}
                                                    >
                                                        <span className="edit_movie_upload_content_icon"></span>
                                                        Завантажити контент
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <button className="edit_movie_add_episode_button" onClick={handleAddEpisode}>
                                        <span className="edit_movie_add_icon"></span>
                                        Додати Епізод
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="edit_movie_section">
                            <div className="edit_movie_section_title"><Trans i18nKey="admin.editMovie.reviews" /> <span className="edit_movie_reviews_count">{reviews.length}/20</span></div>
                            <div className="edit_movie_reviews_list">
                                {reviews.map(review => (
                                    <div key={review.id} className="edit_movie_review_item">
                                        <div className="edit_movie_review_card">
                                            <div className="edit_movie_review_top">
                                                <div className="edit_movie_review_left">
                                                    <div className="edit_movie_review_avatar"></div>
                                                    <div className="edit_movie_review_info">
                                                        <div className="edit_movie_review_author">{review.author}</div>
                                                        <div className="edit_movie_review_date">{review.date}</div>
                                                    </div>
                                                </div>
                                                <div className="edit_movie_review_rating">{review.rating}</div>
                                            </div>
                                            <div className="edit_movie_review_title">{review.title}</div>
                                            <div className="edit_movie_review_text">{review.text}</div>
                                            {review.fullText && review.fullText !== review.text && (
                                                <button
                                                    className="edit_movie_review_read_more"
                                                    onClick={() => handleToggleReview(review)}
                                                >
                                                    Читати повністю
                                                </button>
                                            )}
                                        </div>
                                        <button
                                            className="edit_movie_review_delete"
                                            onClick={() => handleDeleteReview(review.id)}
                                        >
                                            <span className="edit_movie_review_delete_icon"></span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button className="edit_movie_load_more_button">Завантажити ще</button>
                        </div>
                    </div>
                </div>

                <div className="edit_movie_footer">
                    <button className="edit_movie_delete_button" onClick={handleDelete}>
                        <span className="edit_movie_delete_icon"></span>
                        <Trans i18nKey="admin.editMovie.deleteMovie" />
                    </button>
                    <button className="edit_movie_save_button" onClick={handleSave}>
                        <span className="edit_movie_save_icon"></span>
                        <Trans i18nKey="admin.editMovie.save" />
                    </button>
                </div>
            </div>

            {selectedReview && (
                <div className="edit_movie_review_modal_overlay" onClick={handleCloseReviewModal}>
                    <div className="edit_movie_review_modal" onClick={(e) => e.stopPropagation()}>
                        <button className="edit_movie_review_modal_close" onClick={handleCloseReviewModal}>
                            <span className="edit_movie_review_modal_close_icon"></span>
                        </button>
                        <div className="edit_movie_review_modal_header">
                            <div className="edit_movie_review_modal_left">
                                <div className="edit_movie_review_modal_avatar"></div>
                                <div className="edit_movie_review_modal_info">
                                    <div className="edit_movie_review_modal_author">{selectedReview.author}</div>
                                    <div className="edit_movie_review_modal_date">{selectedReview.date}</div>
                                </div>
                            </div>
                            <div className="edit_movie_review_modal_rating">{selectedReview.rating}</div>
                        </div>
                        <div className="edit_movie_review_modal_title">{selectedReview.title}</div>
                        <div className="edit_movie_review_modal_text">{selectedReview.fullText || selectedReview.text}</div>
                    </div>
                </div>
            )}
        </div>
    );
};