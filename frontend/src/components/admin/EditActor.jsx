import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation, Trans } from 'react-i18next';
import './EditActor.css';

const activityTypes = ['Актор', 'Акторка', 'Режисер', 'Режисерка'];
const genders = ['Чоловік', 'Жінка', 'Не вказувати'];
const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const months = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
const years = Array.from({ length: 125 }, (_, i) => (2025 - i).toString());
const countries = ['Польща', 'Австралія', 'Велика Британія', 'Україна', 'США', 'Франція', 'Німеччина', 'Італія', 'Іспанія', 'Канада'];
const cities = ['Паріж', 'Лондон', 'Київ', 'Вашингтон', 'Гринхит', 'Осло', 'Варшава', 'Берлін', 'Рим', 'Мадрид'];

export const EditActor = ({ isOpen, onClose, actor = null, onSave, onOpenSearchMovie, selectedMovies, onMoviesAdded, onOpenSearchActor, selectedActors, onActorsAdded }) => {
    const { t } = useTranslation();
    const modalRef = useRef(null);
    const fileInputRef = useRef(null);
    const dropdownMenuClickRef = useRef(false);
    
    const [name, setName] = useState('Джейсон');
    const [surname, setSurname] = useState('Стетхем');
    const [activityType, setActivityType] = useState('Актор');
    const [gender, setGender] = useState('');
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [filmography, setFilmography] = useState([
        { id: 1, name: 'ДЕДПУЛ РОСОМАХА', image: 'https://via.placeholder.com/200x300?text=Deadpool+Wolverine' },
        { id: 2, name: 'Барбі', image: 'https://via.placeholder.com/200x300?text=Barbie' },
        { id: 3, name: 'ВОВК З ВОЛЛ СТРІТ', image: 'https://via.placeholder.com/200x300?text=Wolf+of+Wall+Street' },
        { id: 4, name: 'WICKED ЧАРОДІЙКА', image: 'https://via.placeholder.com/200x300?text=Wicked' },
        { id: 5, name: 'СМЕРТЬ ЕДИНОРОГА', image: 'https://via.placeholder.com/200x300?text=Death+of+Unicorn' }
    ]);
    const [relatives, setRelatives] = useState([
        { id: 1, name: 'Джейсон Стетхем', role: 'Актор', image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756265326/Statham.png' },
        { id: 2, name: 'Тімоті Шаламе', role: 'Акторка', image: 'https://via.placeholder.com/150?text=Timothée+Chalamet' },
        { id: 3, name: 'Аня Тейлор-Джой', role: 'Режисер', image: 'https://via.placeholder.com/150?text=Anya+Taylor-Joy' }
    ]);
    
    const [isActivityOpen, setIsActivityOpen] = useState(false);
    const [isGenderOpen, setIsGenderOpen] = useState(false);
    const [isDayOpen, setIsDayOpen] = useState(false);
    const [isMonthOpen, setIsMonthOpen] = useState(false);
    const [isYearOpen, setIsYearOpen] = useState(false);
    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const [isCityOpen, setIsCityOpen] = useState(false);
    
    const activityDropdownRef = useRef(null);
    const genderDropdownRef = useRef(null);
    const dayDropdownRef = useRef(null);
    const monthDropdownRef = useRef(null);
    const yearDropdownRef = useRef(null);
    const countryDropdownRef = useRef(null);
    const cityDropdownRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        let isSelectingOption = false;

        const handleClickOutside = (e) => {
            if (dropdownMenuClickRef.current) {
                dropdownMenuClickRef.current = false;
                return;
            }

            const clickedMenu = e.target.closest('.edit_actor_dropdown_menu');
            const clickedOption = e.target.closest('.edit_actor_dropdown_option');
            const clickedWrapper = e.target.closest('.edit_actor_dropdown_wrapper');
            
            if (clickedMenu || clickedOption) {
                return;
            }
            
            const clickedSearchModal = e.target.closest('.search_movie_overlay, .search_actor_overlay');
            
            if (clickedSearchModal) {
                return;
            }
            
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
            
            if (!clickedWrapper) {
                setIsActivityOpen(false);
                setIsGenderOpen(false);
                setIsDayOpen(false);
                setIsMonthOpen(false);
                setIsYearOpen(false);
                setIsCountryOpen(false);
                setIsCityOpen(false);
            }
        };

        const handleScroll = () => {
            setIsActivityOpen(false);
            setIsGenderOpen(false);
            setIsDayOpen(false);
            setIsMonthOpen(false);
            setIsYearOpen(false);
            setIsCountryOpen(false);
            setIsCityOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll, true);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (actor) {
            setName(actor.name || '');
            setSurname(actor.surname || '');
            setActivityType(actor.role || '');
            setGender(actor.gender || '');
            setAvatarUrl(actor.image || null);
            if (actor.filmography) {
                setFilmography(actor.filmography);
            }
            if (actor.relatives) {
                setRelatives(actor.relatives);
            }
        } else {
            setName('');
            setSurname('');
            setActivityType('');
            setGender('');
            setDay('');
            setMonth('');
            setYear('');
            setCountry('');
            setCity('');
            setAvatarUrl(null);
        }
    }, [actor, isOpen]);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        const actorData = {
            name,
            surname,
            activityType,
            gender,
            birthDate: { day, month, year },
            birthPlace: { country, city },
            avatarUrl,
            filmography,
            relatives
        };

        if (onSave) {
            onSave(actorData);
        }
        onClose();
    };

    const handleDelete = () => {
        if (actor && window.confirm('Ви впевнені, що хочете видалити цього актора?')) {
            onClose();
        }
    };

    const handleAddFilm = () => {
        if (onOpenSearchMovie) {
            onOpenSearchMovie();
        }
    };

    useEffect(() => {
        if (selectedMovies && selectedMovies.length > 0) {
            setFilmography(prev => {
                const existingIds = prev.map(f => f.id);
                const newMovies = selectedMovies.filter(movie => !existingIds.includes(movie.id));
                return [...prev, ...newMovies];
            });
            if (onMoviesAdded) {
                onMoviesAdded();
            }
        }
    }, [selectedMovies, onMoviesAdded]);

    useEffect(() => {
        if (selectedActors && selectedActors.length > 0) {
            setRelatives(prev => {
                const existingIds = prev.map(r => r.id);
                const newActors = selectedActors.filter(actor => !existingIds.includes(actor.id));
                return [...prev, ...newActors];
            });
            if (onActorsAdded) {
                onActorsAdded();
            }
        }
    }, [selectedActors, onActorsAdded]);

    const handleRemoveFilm = (filmId) => {
        setFilmography(prev => prev.filter(film => film.id !== filmId));
    };

    const handleRemoveRelative = (relativeId) => {
        setRelatives(prev => prev.filter(relative => relative.id !== relativeId));
    };

    const handleAddRelative = () => {
        if (onOpenSearchActor) {
            onOpenSearchActor();
        }
    };

    const closeAllDropdownsExcept = (exceptStateSetter) => {
        if (exceptStateSetter !== setIsActivityOpen) setIsActivityOpen(false);
        if (exceptStateSetter !== setIsGenderOpen) setIsGenderOpen(false);
        if (exceptStateSetter !== setIsDayOpen) setIsDayOpen(false);
        if (exceptStateSetter !== setIsMonthOpen) setIsMonthOpen(false);
        if (exceptStateSetter !== setIsYearOpen) setIsYearOpen(false);
        if (exceptStateSetter !== setIsCountryOpen) setIsCountryOpen(false);
        if (exceptStateSetter !== setIsCityOpen) setIsCityOpen(false);
    };

    const renderDropdown = (label, value, options, isOpen, setIsOpen, onChange, id, dropdownRef) => {
        const getMenuPosition = () => {
            if (!dropdownRef.current) return { top: 0, left: 0, width: 0, opensUpward: false };
            const rect = dropdownRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const estimatedMenuHeight = 200;
            const opensUpward = spaceBelow < estimatedMenuHeight + 10;
            
            return {
                top: opensUpward ? undefined : rect.bottom + 5,
                bottom: opensUpward ? window.innerHeight - rect.top + 5 : undefined,
                left: rect.left,
                width: rect.width,
                opensUpward
            };
        };

        const handleToggle = () => {
            if (!isOpen) {
                closeAllDropdownsExcept(setIsOpen);
            }
            setIsOpen(!isOpen);
        };

        const menuPosition = isOpen ? getMenuPosition() : null;

        return (
            <div className="edit_actor_input_block">
                <div className="edit_actor_dropdown_wrapper" ref={dropdownRef}>
                    <div 
                        className={`edit_actor_dropdown ${isOpen ? 'open' : ''} ${value ? 'has-value' : ''}`}
                        onClick={handleToggle}
                    >
                        <span className="edit_actor_dropdown_value">{value || ''}</span>
                    </div>
                    {isOpen && menuPosition && createPortal(
                        <div 
                            className={`edit_actor_dropdown_menu ${menuPosition.opensUpward ? 'opens-upward' : ''}`}
                            style={{
                                position: 'fixed',
                                ...(menuPosition.opensUpward 
                                    ? { bottom: `${menuPosition.bottom}px` }
                                    : { top: `${menuPosition.top}px` }
                                ),
                                left: `${menuPosition.left}px`,
                                width: `${menuPosition.width}px`,
                                zIndex: 10002
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {options.map((option, index) => (
                                <div
                                    key={index}
                                    className={`edit_actor_dropdown_option ${value === option ? 'selected' : ''}`}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
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
                        </div>,
                        document.body
                    )}
                </div>
                <label htmlFor={id} className={value ? 'edit_actor_dropdown_label_active' : ''}>{label}</label>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="edit_actor_overlay" role="dialog" aria-modal="true">
            <div className="edit_actor_modal" ref={modalRef}>
                <div className="edit_actor_close" onClick={onClose}></div>

                <div className="edit_actor_header">
                    <div className="edit_actor_title">
                        <Trans i18nKey="admin.editActor.title" />
                    </div>
                </div>

                <div className="edit_actor_content">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        accept="image/png, image/jpeg"
                    />
                    
                    <div className="edit_actor_main_content">
                        <div className="edit_actor_form">
                            <div className="edit_actor_avatar_wrapper">
                                <div
                                    className="edit_actor_avatar"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {avatarUrl && (
                                        <img
                                            src={avatarUrl}
                                            alt="Avatar"
                                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                    )}
                                </div>
                                <div className="edit_actor_avatar_info">
                                    <div className="edit_actor_avatar_name">
                                        {name || surname ? `${name} ${surname}`.trim() : ''}
                                    </div>
                                    <div className="edit_actor_avatar_role">
                                        {activityType || ''}
                                    </div>
                                </div>
                            </div>
                            <div className="edit_actor_section">
                                <div className="edit_actor_section_title"><Trans i18nKey="admin.editActor.mainInfo" /></div>
                            <div className="edit_actor_inputs_row">
                                <div className="edit_actor_input_block">
                                    <input
                                        type="text"
                                        id="editActorName"
                                        placeholder=" "
                                        className="edit_actor_input"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                    />
                                    <label htmlFor="editActorName"><Trans i18nKey="admin.editActor.name" /></label>
                                </div>
                                <div className="edit_actor_input_block">
                                    <input
                                        type="text"
                                        id="editActorSurname"
                                        placeholder=" "
                                        className="edit_actor_input"
                                        value={surname}
                                        onChange={e => setSurname(e.target.value)}
                                    />
                                    <label htmlFor="editActorSurname"><Trans i18nKey="admin.editActor.surname" /></label>
                                </div>
                            </div>
                            <div className="edit_actor_inputs_row">
                                {renderDropdown(t('admin.editActor.activityType'), activityType, activityTypes, isActivityOpen, setIsActivityOpen, setActivityType, 'editActorActivity', activityDropdownRef)}
                                {renderDropdown(t('admin.editActor.gender'), gender, genders, isGenderOpen, setIsGenderOpen, setGender, 'editActorGender', genderDropdownRef)}
                            </div>
                        </div>

                        <div className="edit_actor_section">
                            <div className="edit_actor_section_title"><Trans i18nKey="admin.editActor.birthDate" /></div>
                            <div className="edit_actor_inputs_row">
                                {renderDropdown(t('admin.editActor.day'), day, days, isDayOpen, setIsDayOpen, setDay, 'editActorDay', dayDropdownRef)}
                                {renderDropdown(t('admin.editActor.month'), month, months, isMonthOpen, setIsMonthOpen, setMonth, 'editActorMonth', monthDropdownRef)}
                                {renderDropdown(t('admin.editActor.year'), year, years, isYearOpen, setIsYearOpen, setYear, 'editActorYear', yearDropdownRef)}
                            </div>
                        </div>

                        <div className="edit_actor_section">
                            <div className="edit_actor_section_title"><Trans i18nKey="admin.editActor.birthPlace" /></div>
                            <div className="edit_actor_inputs_row">
                                {renderDropdown(t('admin.editActor.country'), country, countries, isCountryOpen, setIsCountryOpen, setCountry, 'editActorCountry', countryDropdownRef)}
                                {renderDropdown(t('admin.editActor.city'), city, cities, isCityOpen, setIsCityOpen, setCity, 'editActorCity', cityDropdownRef)}
                            </div>
                        </div>
                        </div>

                        <div className="edit_actor_right_column">
                            <div className="edit_actor_section">
                                <div className="edit_actor_section_title"><Trans i18nKey="admin.editActor.filmography" /></div>
                                <div className="edit_actor_filmography">
                                    <div className="edit_actor_film_placeholder" onClick={handleAddFilm}>
                                        <button className="edit_actor_add_film_button">
                                            <span className="edit_actor_add_film_icon"></span>
                                            <Trans i18nKey="admin.editActor.addMovie" />
                                        </button>
                                    </div>
                                    {filmography.map((film) => (
                                        <div key={film.id} className="edit_actor_film_poster">
                                            <img src={film.image} alt={film.name} />
                                            <div className="edit_actor_film_remove" onClick={() => handleRemoveFilm(film.id)}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="edit_actor_section">
                                <div className="edit_actor_section_title"><Trans i18nKey="admin.editActor.relatives" /></div>
                                <div className="edit_actor_relatives">
                                    <div className="edit_actor_relative_placeholder" onClick={handleAddRelative}>
                                        <div className="edit_actor_relative_avatar"></div>
                                        <button 
                                            className="edit_actor_add_relative_button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddRelative();
                                            }}
                                        >
                                            <span className="edit_actor_add_relative_icon"></span>
                                            <Trans i18nKey="admin.editActor.add" />
                                        </button>
                                    </div>
                                    {relatives.map((relative) => (
                                        <div key={relative.id} className="edit_actor_relative_item">
                                            <div className="edit_actor_relative_avatar_wrapper">
                                                <div className="edit_actor_relative_avatar">
                                                    {relative.image && <img src={relative.image} alt={relative.name} />}
                                                </div>
                                                <div className="edit_actor_relative_remove" onClick={() => handleRemoveRelative(relative.id)}></div>
                                            </div>
                                            <div className="edit_actor_relative_info">
                                                <div className="edit_actor_relative_name">{relative.name}</div>
                                                {relative.role && (
                                                    <div className="edit_actor_relative_role">{relative.role}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="edit_actor_footer">
                    <button className="edit_actor_delete_button" onClick={handleDelete}>
                        <span className="edit_actor_delete_icon"></span>
                        <Trans i18nKey="admin.editActor.delete" />
                    </button>
                    <button className="edit_actor_save_button" onClick={handleSave}>
                        <span className="edit_actor_save_icon"></span>
                        <Trans i18nKey="admin.editActor.save" />
                    </button>
                </div>
            </div>
        </div>
    );
};

