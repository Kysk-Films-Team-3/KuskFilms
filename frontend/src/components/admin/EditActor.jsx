import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation, Trans } from 'react-i18next';
import { api } from '../../services/api';
import './EditActor.css';

const activityTypes = ['Актор', 'Акторка', 'Режисер', 'Режисерка'];
const genders = ['Чоловік', 'Жінка', 'Не вказувати'];
const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const months = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
const years = Array.from({ length: 125 }, (_, i) => (2025 - i).toString());
const countries = ['Польща', 'Австралія', 'Велика Британія', 'Україна', 'США', 'Франція', 'Німеччина', 'Італія', 'Іспанія', 'Канада'];
const cities = ['Паріж', 'Лондон', 'Київ', 'Вашингтон', 'Гринхит', 'Осло', 'Варшава', 'Берлін', 'Рим', 'Мадрид'];

const DRAFT_KEY = 'edit_actor_draft';

export const EditActor = ({ isOpen, onClose, actor = null, onSave, onOpenSearchMovie, selectedMovies, onMoviesAdded, onOpenSearchActor, selectedActors, onActorsAdded }) => {
    const { t } = useTranslation();
    const modalRef = useRef(null);
    const fileInputRef = useRef(null);
    const dropdownMenuClickRef = useRef(false);

    const [currentLanguage, setCurrentLanguage] = useState('ua');
    const [name, setName] = useState('');
    const [nameEn, setNameEn] = useState('');
    const [surname, setSurname] = useState('');
    const [surnameEn, setSurnameEn] = useState('');
    const [activityType, setActivityType] = useState('Актор');
    const [gender, setGender] = useState('');

    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');

    const [avatarUrl, setAvatarUrl] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);

    const [filmography, setFilmography] = useState([]);
    const [relatives, setRelatives] = useState([]);

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

    const resolvePath = (path) => {
        if (!path) return null;
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        const clean = path.replace(/^kyskfilms\//, '').replace(/^images\//, '');
        return `/kyskfilms/images/${clean}`;
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

    useEffect(() => {
        if (!isOpen) return;

        if (actor) {
            const names = (actor.name || '').split(' ');
            setName(names[0] || '');
            setNameEn(actor.nameEn || '');
            setSurname(names.slice(1).join(' ') || '');
            setSurnameEn(actor.surnameEn || '');
            setActivityType(actor.role || 'Актор');
            setGender(actor.gender || '');
            setAvatarUrl(resolvePath(actor.image));

            if (actor.birthDate) {
                const date = new Date(actor.birthDate);
                if (!isNaN(date)) {
                    setYear(date.getFullYear().toString());
                    setMonth(months[date.getMonth()]);
                    setDay(date.getDate().toString().padStart(2, '0'));
                }
            }

            if (actor.birthPlace) {
                const parts = actor.birthPlace.split(',').map(s => s.trim());
                if (parts.length > 0) setCity(parts[0]);
                if (parts.length > 1) setCountry(parts[parts.length - 1]);
            }

            if (actor.filmography) setFilmography(actor.filmography);
            if (actor.relatives) setRelatives(actor.relatives);

            sessionStorage.removeItem(DRAFT_KEY);

        } else {
            const draft = sessionStorage.getItem(DRAFT_KEY);
            if (draft) {
                const data = JSON.parse(draft);
                setName(data.name || '');
                setNameEn(data.nameEn || '');
                setSurname(data.surname || '');
                setSurnameEn(data.surnameEn || '');
                setActivityType(data.activityType || 'Актор');
                setGender(data.gender || '');
                setDay(data.day || '');
                setMonth(data.month || '');
                setYear(data.year || '');
                setCountry(data.country || '');
                setCity(data.city || '');
                if (data.filmography) setFilmography(data.filmography);
                if (data.relatives) setRelatives(data.relatives);
            } else {
                setName('');
                setNameEn('');
                setSurname('');
                setSurnameEn('');
                setActivityType('Актор');
                setGender('');
                setDay('');
                setMonth('');
                setYear('');
                setCountry('');
                setCity('');
                setAvatarUrl(null);
                setAvatarFile(null);
                setFilmography([]);
                setRelatives([]);
            }
        }
    }, [isOpen, actor]);

    useEffect(() => {
        if (!actor && isOpen) {
            const draftData = {
                name, nameEn, surname, surnameEn, activityType, gender,
                day, month, year, country, city,
                filmography, relatives
            };
            sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
        }
    }, [name, nameEn, surname, surnameEn, activityType, gender, day, month, year, country, city, filmography, relatives, actor, isOpen]);


    useEffect(() => {
        if (selectedMovies && selectedMovies.length > 0) {
            setFilmography(prev => {
                const existingIds = prev.map(f => f.id);
                const newMovies = selectedMovies.filter(movie => !existingIds.includes(movie.id));
                return [...prev, ...newMovies];
            });
            if (onMoviesAdded) onMoviesAdded();
        }
    }, [selectedMovies, onMoviesAdded]);

    useEffect(() => {
        if (selectedActors && selectedActors.length > 0) {
            setRelatives(prev => {
                const existingIds = prev.map(r => r.id);
                const newActors = selectedActors.filter(actor => !existingIds.includes(actor.id));
                return [...prev, ...newActors];
            });
            if (onActorsAdded) onActorsAdded();
        }
    }, [selectedActors, onActorsAdded]);


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setAvatarFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setAvatarUrl(reader.result);
        reader.readAsDataURL(file);
    };

    const uploadImageToServer = async (file) => {
        if (!file) return null;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await api.post('/admin/titles/upload-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            let url = response.data.url;
            return url ? url.replace(/^images\//, '') : null;
        } catch (error) {
            console.error("Upload failed", error);
            return null;
        }
    };

    const handleSave = async () => {
        try {
            let uploadedPhotoUrl = null;

            if (avatarFile) {
                uploadedPhotoUrl = await uploadImageToServer(avatarFile);
            } else if (avatarUrl && !avatarUrl.startsWith('data:')) {
                uploadedPhotoUrl = avatarUrl.replace('/kyskfilms/images/', '').replace(/^images\//, '');
            }

            const monthIndex = months.indexOf(month);
            const birthDateStr = (year && monthIndex !== -1 && day)
                ? `${year}-${(monthIndex + 1).toString().padStart(2, '0')}-${day.padStart(2, '0')}`
                : null;

            const actorData = {
                id: actor?.id,
                name: `${name} ${surname}`.trim(),
                nameEn: `${nameEn} ${surnameEn}`.trim(),
                activityType,
                gender,
                photoUrl: uploadedPhotoUrl,
                birthPlace: (country || city) ? `${city}${city && country ? ', ' : ''}${country}` : null,
                birthDate: birthDateStr
            };

            const payload = {
                name: actorData.name,
                nameEn: actorData.nameEn,
                photoUrl: actorData.photoUrl
            };

            await api.post('/persons', payload);

            sessionStorage.removeItem(DRAFT_KEY);
            if (onSave) onSave(actorData);
            onClose();
            window.location.reload();

        } catch (error) {
            console.error(error);
            alert("Помилка збереження актора.");
        }
    };

    const handleDelete = async () => {
        if (actor && window.confirm('Ви впевнені, що хочете видалити цього актора?')) {
            try {
                await api.delete(`/admin/persons/${actor.id}`);
                onClose();
                window.location.reload();
            } catch (error) {
                alert("Помилка видалення.");
            }
        }
    };

    const handleAddFilm = () => { if (onOpenSearchMovie) onOpenSearchMovie(); };
    const handleAddRelative = () => { if (onOpenSearchActor) onOpenSearchActor(); };
    const handleRemoveFilm = (fid) => setFilmography(p => p.filter(f => f.id !== fid));
    const handleRemoveRelative = (rid) => setRelatives(p => p.filter(r => r.id !== rid));

    const handleClose = () => {
        sessionStorage.removeItem(DRAFT_KEY);
        onClose();
    };

    useEffect(() => {
        if (!isOpen) return;
        const h = (e) => {
            if (dropdownMenuClickRef.current) { dropdownMenuClickRef.current = false; return; }
            if (e.target.closest('.edit_actor_dropdown_menu') || e.target.closest('.search_movie_overlay, .search_actor_overlay')) return;
            if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
            if (!e.target.closest('.edit_actor_dropdown_wrapper')) closeAllDropdownsExcept(null);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [isOpen, onClose]);

    const renderDropdown = (label, value, options, isOpen, setIsOpen, onChange, id, ref) => {
        const getPos = () => {
            if(!ref.current) return {};
            const rect = ref.current.getBoundingClientRect();
            const up = (window.innerHeight - rect.bottom) < 210;
            return { top: up?undefined:rect.bottom+5, bottom: up?window.innerHeight-rect.top+5:undefined, left: rect.left, width: rect.width, up };
        };
        const pos = isOpen ? getPos() : {};
        return (
            <div className="edit_actor_input_block">
                <div className="edit_actor_dropdown_wrapper" ref={ref}>
                    <div className={`edit_actor_dropdown ${isOpen?'open':''} ${value?'has-value':''}`} onClick={()=>{if(!isOpen)closeAllDropdownsExcept(setIsOpen);setIsOpen(!isOpen)}}>
                        <span className="edit_actor_dropdown_value">{value||''}</span>
                    </div>
                    {isOpen && createPortal(
                        <div className={`edit_actor_dropdown_menu ${pos.up?'opens-upward':''}`} style={{position:'fixed', top:pos.top, bottom:pos.bottom, left:pos.left, width:pos.width, zIndex:10002}} onMouseDown={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()}>
                            {options.map((o,i)=><div key={i} className={`edit_actor_dropdown_option ${value===o?'selected':''}`} onClick={e=>{e.preventDefault();e.stopPropagation();dropdownMenuClickRef.current=true;onChange(o);setTimeout(()=>{setIsOpen(false);dropdownMenuClickRef.current=false},100)}}>{o}</div>)}
                        </div>, document.body
                    )}
                </div>
                <label className={value?'edit_actor_dropdown_label_active':''}>{label}</label>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="edit_actor_overlay" role="dialog" aria-modal="true">
            <div className="edit_actor_modal" ref={modalRef}>
                <div className="edit_actor_close" onClick={handleClose}></div>
                <div className="edit_actor_header"><div className="edit_actor_title">{actor ? <Trans i18nKey="admin.editActor.editTitle" defaults="Редагування актора" /> : <Trans i18nKey="admin.editActor.title" />}</div></div>
                <div className="edit_actor_content">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{display:'none'}} accept="image/png, image/jpeg" />
                    <div className="edit_actor_main_content">
                        <div className="edit_actor_form">
                            <div className="edit_actor_avatar_wrapper">
                                <div className="edit_actor_avatar" onClick={()=>fileInputRef.current?.click()}>
                                    {avatarUrl && <img src={avatarUrl} alt="Avatar" style={{width:'100%',height:'100%',borderRadius:'50%',objectFit:'cover'}} />}
                                </div>
                                <div className="edit_actor_avatar_info">
                                    <div className="edit_actor_avatar_name">
                                        {currentLanguage === 'ua' 
                                            ? (name||surname ? `${name} ${surname}`.trim() : '')
                                            : (nameEn||surnameEn ? `${nameEn} ${surnameEn}`.trim() : '')
                                        }
                                    </div>
                                    <div className="edit_actor_avatar_role">{activityType||''}</div>
                                </div>
                            </div>
                            <div className="edit_actor_section"><div className="edit_actor_section_title"><Trans i18nKey="admin.editActor.mainInfo" /></div>
                                <div className="edit_actor_language_tabs">
                                    <button
                                        className={`edit_actor_tab ${currentLanguage === 'ua' ? 'active' : ''}`}
                                        onClick={() => setCurrentLanguage('ua')}
                                    >
                                        UA
                                    </button>
                                    <button
                                        className={`edit_actor_tab ${currentLanguage === 'en' ? 'active' : ''}`}
                                        onClick={() => setCurrentLanguage('en')}
                                    >
                                        EN
                                    </button>
                                </div>
                                <div className="edit_actor_inputs_row">
                                    <div className="edit_actor_input_block">
                                        <input 
                                            type="text" 
                                            id="an" 
                                            className="edit_actor_input" 
                                            value={currentLanguage === 'ua' ? name : nameEn} 
                                            onChange={e => currentLanguage === 'ua' ? setName(e.target.value) : setNameEn(e.target.value)} 
                                            placeholder=" "
                                        />
                                        <label htmlFor="an"><Trans i18nKey="admin.editActor.name" /></label>
                                    </div>
                                    <div className="edit_actor_input_block">
                                        <input 
                                            type="text" 
                                            id="as" 
                                            className="edit_actor_input" 
                                            value={currentLanguage === 'ua' ? surname : surnameEn} 
                                            onChange={e => currentLanguage === 'ua' ? setSurname(e.target.value) : setSurnameEn(e.target.value)} 
                                            placeholder=" "
                                        />
                                        <label htmlFor="as"><Trans i18nKey="admin.editActor.surname" /></label>
                                    </div>
                                </div>
                                <div className="edit_actor_inputs_row">
                                    {renderDropdown(t('admin.editActor.activityType'), activityType, activityTypes, isActivityOpen, setIsActivityOpen, setActivityType, 'act', activityDropdownRef)}
                                    {renderDropdown(t('admin.editActor.gender'), gender, genders, isGenderOpen, setIsGenderOpen, setGender, 'gen', genderDropdownRef)}
                                </div>
                            </div>
                            <div className="edit_actor_section"><div className="edit_actor_section_title"><Trans i18nKey="admin.editActor.birthDate" /></div>
                                <div className="edit_actor_inputs_row">
                                    {renderDropdown(t('admin.editActor.day'), day, days, isDayOpen, setIsDayOpen, setDay, 'dd', dayDropdownRef)}
                                    {renderDropdown(t('admin.editActor.month'), month, months, isMonthOpen, setIsMonthOpen, setMonth, 'mm', monthDropdownRef)}
                                    {renderDropdown(t('admin.editActor.year'), year, years, isYearOpen, setIsYearOpen, setYear, 'yy', yearDropdownRef)}
                                </div>
                            </div>
                            <div className="edit_actor_section"><div className="edit_actor_section_title"><Trans i18nKey="admin.editActor.birthPlace" /></div>
                                <div className="edit_actor_inputs_row">
                                    {renderDropdown(t('admin.editActor.country'), country, countries, isCountryOpen, setIsCountryOpen, setCountry, 'cnt', countryDropdownRef)}
                                    {renderDropdown(t('admin.editActor.city'), city, cities, isCityOpen, setIsCityOpen, setCity, 'ct', cityDropdownRef)}
                                </div>
                            </div>
                        </div>
                        <div className="edit_actor_right_column">
                            <div className="edit_actor_section"><div className="edit_actor_section_title"><Trans i18nKey="admin.editActor.filmography" /></div>
                                <div className="edit_actor_filmography">
                                    <div className="edit_actor_film_placeholder" onClick={handleAddFilm}><button className="edit_actor_add_film_button"><span className="edit_actor_add_film_icon"></span><Trans i18nKey="admin.editActor.addMovie" /></button></div>
                                    {filmography.map(f=><div key={f.id} className="edit_actor_film_poster"><img src={f.image} alt={f.name}/><div className="edit_actor_film_remove" onClick={()=>handleRemoveFilm(f.id)}></div></div>)}
                                </div>
                            </div>
                            <div className="edit_actor_section"><div className="edit_actor_section_title"><Trans i18nKey="admin.editActor.relatives" /></div>
                                <div className="edit_actor_relatives">
                                    <div className="edit_actor_relative_placeholder" onClick={handleAddRelative}><div className="edit_actor_relative_avatar"></div><button className="edit_actor_add_relative_button" onClick={e=>{e.stopPropagation();handleAddRelative()}}><span className="edit_actor_add_relative_icon"></span><Trans i18nKey="admin.editActor.add" /></button></div>
                                    {relatives.map(r=><div key={r.id} className="edit_actor_relative_item"><div className="edit_actor_relative_avatar_wrapper"><div className="edit_actor_relative_avatar">{r.image&&<img src={r.image} alt={r.name}/>}</div><div className="edit_actor_relative_remove" onClick={()=>handleRemoveRelative(r.id)}></div></div><div className="edit_actor_relative_info"><div className="edit_actor_relative_name">{r.name}</div>{r.role&&<div className="edit_actor_relative_role">{r.role}</div>}</div></div>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="edit_actor_footer">
                    {actor && <button className="edit_actor_delete_button" onClick={handleDelete}><span className="edit_actor_delete_icon"></span><Trans i18nKey="admin.editActor.delete" /></button>}
                    <button className="edit_actor_save_button" onClick={handleSave}><span className="edit_actor_save_icon"></span><Trans i18nKey="admin.editActor.save" /></button>
                </div>
            </div>
        </div>
    );
};