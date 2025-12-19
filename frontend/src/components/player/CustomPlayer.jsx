import React, { useRef, useState, useEffect } from "react";
import { VideoPlayer } from "./VideoPlayer";
import { getPlayerConfig } from "../../services/api";
import "./CustomPlayer.css";

export default function CustomPlayer({ titleId, episodeId = null, onClose }) {
    const videoRef = useRef(null);

    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [menu, setMenu] = useState("root");
    const [playbackRate, setPlaybackRate] = useState(1);
    const [subtitleLang, setSubtitleLang] = useState("off");
    const [quality, setQuality] = useState("Auto");
    const menuRef = useRef(null);
    const [playerConfig, setPlayerConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [selectedEpisode, setSelectedEpisode] = useState(null);
    const [showSeasonSelector, setShowSeasonSelector] = useState(false);
    const [showEpisodeSelector, setShowEpisodeSelector] = useState(false);

    useEffect(() => {
        const loadConfig = async () => {
            try {
                setLoading(true);
                setError(null);
                
                if (!titleId) {
                    setError(new Error("Title ID is required"));
                    return;
                }
                
                const config = await getPlayerConfig(titleId, episodeId);
                setPlayerConfig(config);
                
                if (config.type === 'SERIES') {
                    setSelectedSeason(config.currentSeason || (config.seasons && config.seasons.length > 0 ? config.seasons[0].seasonNumber : null));
                    setSelectedEpisode(config.currentEpisode || (config.seasons && config.seasons.length > 0 && config.seasons[0].episodes && config.seasons[0].episodes.length > 0 ? config.seasons[0].episodes[0].episodeNumber : null));
                }
                
                if (config.playbackSpeeds && config.playbackSpeeds.length > 0) {
                    const defaultSpeed = config.playbackSpeeds.find(s => s === "1x") || config.playbackSpeeds[Math.floor(config.playbackSpeeds.length / 2)];
                    setPlaybackRate(parseFloat(defaultSpeed.replace('x', '')));
                }
                if (config.qualities && config.qualities.length > 0) {
                    setQuality(config.qualities[0]);
                }
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        if (titleId) {
            loadConfig();
        }
    }, [titleId, episodeId]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (
                showSettings &&
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setShowSettings(false);
                setMenu("root");
            }
            
            if (showSeasonSelector || showEpisodeSelector) {
                const seasonSelector = document.querySelector('.player-season-selector');
                if (seasonSelector && !seasonSelector.contains(e.target)) {
                    setShowSeasonSelector(false);
                    setShowEpisodeSelector(false);
                }
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showSettings, showSeasonSelector, showEpisodeSelector]);

    const handleEpisodeChange = async (episodeId) => {
        try {
            setLoading(true);
            setError(null);
            const config = await getPlayerConfig(titleId, episodeId);
            setPlayerConfig(config);
            setSelectedSeason(config.currentSeason || null);
            setSelectedEpisode(config.currentEpisode || null);
            setShowEpisodeSelector(false);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const togglePlay = () => {
        const v = videoRef.current;
        v.paused ? v.play() : v.pause();
    };

    const onVideoClick = () => togglePlay();

    const changeProgress = (e) => {
        const v = videoRef.current;
        const percent = e.target.value;
        v.currentTime = (percent / 100) * v.duration;
        setProgress(percent);
    };

    const toggleMute = () => {
        const v = videoRef.current;
        if (!v) return;

        v.muted = !v.muted;
        setMuted(v.muted);

        if (v.muted) setVolume(0);
    };

    const changeVolume = (e) => {
        const v = videoRef.current;
        const vol = Number(e.target.value);

        v.volume = vol;
        setVolume(vol);

        if (vol === 0) {
            v.muted = true;
            setMuted(true);
        } else {
            v.muted = false;
            setMuted(false);
        }
    };

    useEffect(() => {
        const v = videoRef.current;
        if (!v || !playerConfig?.streamUrl) return;

        const onPlay = () => setIsPaused(false);
        const onPause = () => setIsPaused(true);

        const onTime = () => {
            setCurrentTime(v.currentTime);
            setProgress((v.currentTime / v.duration) * 100 || 0);

            const progressKey = playerConfig.type === 'SERIES' 
                ? `video-progress-${titleId}-${episodeId || selectedEpisode}` 
                : `video-progress-${titleId}`;
            localStorage.setItem(progressKey, v.currentTime);
        };

        const onMeta = () => {
            setDuration(v.duration);

            const progressKey = playerConfig.type === 'SERIES' 
                ? `video-progress-${titleId}-${episodeId || selectedEpisode}` 
                : `video-progress-${titleId}`;
            const saved = localStorage.getItem(progressKey);
            if (saved) {
                const sec = Number(saved);
                if (!isNaN(sec) && sec < v.duration) {
                    v.currentTime = sec;
                }
            }
        };

        const onEnded = () => {
            if (playerConfig.type === 'SERIES' && playerConfig.nextEpisodeId) {
                handleEpisodeChange(playerConfig.nextEpisodeId);
            }
        };

        v.addEventListener("play", onPlay);
        v.addEventListener("pause", onPause);
        v.addEventListener("timeupdate", onTime);
        v.addEventListener("loadedmetadata", onMeta);
        v.addEventListener("ended", onEnded);

        return () => {
            v.removeEventListener("play", onPlay);
            v.removeEventListener("pause", onPause);
            v.removeEventListener("timeupdate", onTime);
            v.removeEventListener("loadedmetadata", onMeta);
            v.removeEventListener("ended", onEnded);
        };
    }, [playerConfig?.streamUrl, titleId, episodeId, selectedEpisode, playerConfig?.type, handleEpisodeChange]);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;

        const handleKey = (e) => {

            const tag = document.activeElement.tagName.toLowerCase();
            if (tag === "input" || tag === "textarea") return;

            if (e.code === "Space" || e.key.toLowerCase() === "k") {
                e.preventDefault();
                v.paused ? v.play() : v.pause();
            }

            if (e.key === "ArrowRight") v.currentTime += 5;
            if (e.key === "ArrowLeft") v.currentTime -= 5;

            if (e.key.toLowerCase() === "l") v.currentTime += 10;
            if (e.key.toLowerCase() === "j") v.currentTime -= 10;

            if (e.key === "ArrowUp") {
                v.volume = Math.min(1, v.volume + 0.05);
                setVolume(v.volume);
            }
            if (e.key === "ArrowDown") {
                v.volume = Math.max(0, v.volume - 0.05);
                setVolume(v.volume);
            }

            if (e.key.toLowerCase() === "m") {
                v.muted = !v.muted;
            }

            if (e.key.toLowerCase() === "f") {
                const container = document.querySelector(".player-ui");
                if (!document.fullscreenElement) container.requestFullscreen();
                else document.exitFullscreen();
            }

            if (e.key.toLowerCase() === "c") {
            }

            if (e.key.toLowerCase() === "s") {
                setShowSettings(prev => !prev);
            }

            if (e.shiftKey && e.key === ">") {
                v.playbackRate = Math.min(2, v.playbackRate + 0.25);
            }
            if (e.shiftKey && e.key === "<") {
                v.playbackRate = Math.max(0.25, v.playbackRate - 0.25);
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [setShowSettings, setVolume]);


    const toggleFullscreen = () => {
        const container = document.querySelector(".player-ui");

        if (!document.fullscreenElement) container.requestFullscreen();
        else document.exitFullscreen();
    };

    if (loading) {
        return (
            <div className="player-ui" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            </div>
        );
    }

    if (error || !playerConfig) {
        return (
            <div className="player-ui" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            </div>
        );
    }

    const currentSeasonData = playerConfig.seasons?.find(s => s.seasonNumber === selectedSeason);
    const currentEpisodeData = currentSeasonData?.episodes?.find(e => e.episodeNumber === selectedEpisode);

    return (
        <div className="player-ui">
            {playerConfig.type === 'SERIES' && playerConfig.seasons && playerConfig.seasons.length > 0 && (
                <div className="player-season-selector">
                    <div className="player-selector-wrapper">
                        <div 
                            className="player-season-dropdown"
                            onClick={() => {
                                setShowSeasonSelector(!showSeasonSelector);
                                setShowEpisodeSelector(false);
                            }}
                        >
                            <span>{playerConfig.ui?.seasonLabel || 'Сезон'} {selectedSeason || playerConfig.currentSeason || 1}</span>
                            <span className="dropdown-arrow"></span>
                        </div>
                        {showSeasonSelector && (
                            <div className="player-dropdown-menu">
                                {playerConfig.seasons.map(season => (
                                    <div
                                        key={season.seasonNumber}
                                        className={`player-dropdown-item ${selectedSeason === season.seasonNumber ? 'active' : ''}`}
                                        onClick={() => {
                                            setSelectedSeason(season.seasonNumber);
                                            setShowSeasonSelector(false);
                                            if (season.episodes && season.episodes.length > 0) {
                                                setSelectedEpisode(season.episodes[0].episodeNumber);
                                                handleEpisodeChange(season.episodes[0].id);
                                            }
                                        }}
                                    >
                                        {playerConfig.ui?.seasonLabel || 'Сезон'} {season.seasonNumber}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="player-selector-wrapper">
                        <div 
                            className="player-episode-dropdown"
                            onClick={() => {
                                setShowEpisodeSelector(!showEpisodeSelector);
                                setShowSeasonSelector(false);
                            }}
                        >
                            <span>{playerConfig.ui?.episodeLabel || 'Серія'} {selectedEpisode || playerConfig.currentEpisode || 1}</span>
                            <span className="dropdown-arrow"></span>
                        </div>
                        {showEpisodeSelector && currentSeasonData && (
                            <div className="player-dropdown-menu">
                                {currentSeasonData.episodes.map(episode => {
                                    const isActive = selectedEpisode === episode.episodeNumber && 
                                                   selectedSeason === currentSeasonData.seasonNumber;
                                    return (
                                        <div
                                            key={episode.id}
                                            className={`player-dropdown-item ${isActive ? 'active' : ''}`}
                                            onClick={() => {
                                                handleEpisodeChange(episode.id);
                                            }}
                                        >
                                            {playerConfig.ui?.episodeLabel || 'Серія'} {episode.episodeNumber} {episode.title ? `- ${episode.title}` : ''}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="video-click-area" onClick={onVideoClick}></div>

            {isPaused && (
                <div className="center-play" onClick={togglePlay}></div>
            )}

            {playerConfig.posterUrl && (
                <div className="player-poster" style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    backgroundImage: `url(${playerConfig.posterUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: isPaused ? 0.3 : 0
                }}></div>
            )}
            <VideoPlayer src={playerConfig.streamUrl} ref={videoRef} />

            <div className="progress-wrapper">
                <div className="progress-track"></div>
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>

                <input
                    type="range"
                    className="progress-bar"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={changeProgress}
                />
            </div>

            <div className="player-ui">
            <div className="controls-panel">

                <div className={`control-btn ${isPaused ? "play" : "pause"}`} onClick={togglePlay}/>

                <div className="time">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </div>

                <div className="controls-left">
                    <div className="volume-container">
                        <div className={`volume-icon ${muted || volume === 0 ? "mute" : volume < 0.5 ? "low" : "high"}`} onClick={toggleMute}/>
                        <div className="volume-wrapper">
                            <div className="volume-track"></div>
                            <div className="volume-fill" style={{ width: `${volume * 100}%` }}></div>

                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={changeVolume}
                                className="volume-bar"
                            />
                        </div>
                    </div>


                    <div className="settings-btn" onClick={() => setShowSettings(!showSettings)}></div>

                    {showSettings && (
                        <div className="settings-menu" ref={menuRef}>

                            {menu === "root" && (
                                <div className="settings-list">

                                    <div className="settings-row" onClick={() => setMenu("speed")}>
                                        <span className="settings_title">{playerConfig.ui?.speedLabel || 'Швидкість'}</span>
                                        <div className="blocki">
                                        <span className="value">{playbackRate}</span>
                                        <span className="arrow arrow-right"></span>
                                        </div>
                                    </div>

                                    <div className="settings-row" onClick={() => setMenu("subtitles")}>
                                        <span className="settings_title">{playerConfig.ui?.subtitlesLabel || 'Субтитри'}</span>
                                        <div className="blocki">
                                        <span className="value">
                        {subtitleLang === "off"
                            ? 'Вимкнено'
                            : playerConfig.subtitles?.find(s => {
                                const langKey = s.language.toLowerCase().includes('ukr') || s.language.toLowerCase().includes('укра') ? 'uk' : 'eng';
                                return langKey === subtitleLang;
                            })?.label || subtitleLang}
                    </span>
                                        <span className="arrow arrow-right"></span>
                                        </div>
                                    </div>
                                    <div className="settings-row" onClick={() => setMenu("quality")}>
                                        <span className="settings_title">{playerConfig.ui?.qualityLabel || 'Якість'}</span>
                                        <div className="blocki">
                                        <span className="value">{quality}</span>
                                        <span className="arrow arrow-right"></span>
                                        </div>
                                        </div>
                                    </div>

                            )}

                            {menu === "speed" && (
                                <div className="settings_sub_list">
                                    <div className="back_sub_row" onClick={() => setMenu("root")}>
                                        <span className="arrow arrow_sub_back"></span>
                                        {playerConfig.ui?.speedLabel || 'Швидкість'}
                                    </div>

                                    {(playerConfig.playbackSpeeds || ["0.5x", "0.75x", "1x", "1.25x", "1.5x", "2x"]).map((speed) => {
                                        const rate = parseFloat(speed.replace('x', ''));
                                        return (
                                            <div
                                                key={speed}
                                                className={`settings_sub_option ${
                                                    playbackRate === rate ? "active" : ""
                                                }`}
                                                onClick={() => {
                                                    setPlaybackRate(rate);
                                                    if (videoRef.current) {
                                                        videoRef.current.playbackRate = rate;
                                                    }
                                                }}
                                            >
                                                {speed}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {menu === "subtitles" && (
                                <div className="settings_sub_list">
                                    <div className="back_sub_row" onClick={() => setMenu("root")}>
                                        <span className="arrow arrow_sub_back"></span>
                                        {playerConfig.ui?.subtitlesLabel || 'Субтитри'}
                                    </div>

                                    <div
                                        className={`settings_sub_option ${
                                            subtitleLang === "off" ? "active" : ""
                                        }`}
                                        onClick={() => setSubtitleLang("off")}
                                    >
                                        Вимкнено
                                    </div>

                                    {(playerConfig.subtitles || []).map((subtitle, index) => {
                                        const langKey = subtitle.label.toLowerCase().includes('ukr') || subtitle.label.toLowerCase().includes('укра') ? 'uk' : 'eng';
                                        return (
                                            <div
                                                key={index}
                                                className={`settings_sub_option ${
                                                    subtitleLang === langKey ? "active" : ""
                                                }`}
                                                onClick={() => {
                                                    setSubtitleLang(langKey);
                                                    if (videoRef.current && subtitle.src) {
                                                    }
                                                }}
                                            >
                                                {subtitle.label}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {menu === "quality" && (
                                <div className="settings_sub_list">
                                    <div className="back_sub_row" onClick={() => setMenu("root")}>
                                        <span className="arrow arrow_sub_back"></span>
                                        {playerConfig.ui?.qualityLabel || 'Якість'}
                                    </div>
                                <div className="grap">
                                    {(playerConfig.qualities || ["Auto", "1080p", "720p", "480p"]).map((q) => (
                                        <div
                                            key={q}
                                            className={`settings_sub_option ${quality === q ? "active" : ""}`}
                                            onClick={() => setQuality(q)}
                                        >
                                            {q}
                                        </div>
                                    ))}
                                </div>
                                </div>
                            )}

                        </div>
                    )}


                    <div className="fullscreen-btn" onClick={toggleFullscreen}>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}

function formatTime(time) {
    if (!time || isNaN(time)) return "0:00";

    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = Math.floor(time % 60);

    if (h > 0) {
        return `${h}:${m.toString().padStart(2, "0")}:${s
            .toString()
            .padStart(2, "0")}`;
    }

    return `${m}:${s.toString().padStart(2, "0")}`;
}
