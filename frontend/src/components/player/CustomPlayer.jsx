import React, { useRef, useState, useEffect } from "react";
import { Trans } from "react-i18next";
import { VideoPlayer } from "./VideoPlayer";
import "./CustomPlayer.css";

export default function CustomPlayer({ src }) {
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
    const [subtitleLang, setSubtitleLang] = useState("uk");
    const [quality, setQuality] = useState("1080p");
    const menuRef = useRef(null);

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
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showSettings]);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;

        const onPlay = () => setIsPaused(false);
        const onPause = () => setIsPaused(true);
        const onTime = () => {
            setCurrentTime(v.currentTime);
            setProgress((v.currentTime / v.duration) * 100 || 0);
        };
        const onMeta = () => setDuration(v.duration);

        v.addEventListener("play", onPlay);
        v.addEventListener("pause", onPause);
        v.addEventListener("timeupdate", onTime);
        v.addEventListener("loadedmetadata", onMeta);

        return () => {
            v.removeEventListener("play", onPlay);
            v.removeEventListener("pause", onPause);
            v.removeEventListener("timeupdate", onTime);
            v.removeEventListener("loadedmetadata", onMeta);
        };
    }, []);

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
        if (!v) return;

        const onPlay = () => setIsPaused(false);
        const onPause = () => setIsPaused(true);

        const onTime = () => {
            setCurrentTime(v.currentTime);
            setProgress((v.currentTime / v.duration) * 100 || 0);

            localStorage.setItem(`video-progress-${src}`, v.currentTime);
        };

        const onMeta = () => {
            setDuration(v.duration);

            const saved = localStorage.getItem(`video-progress-${src}`);
            if (saved) {
                const sec = Number(saved);
                if (!isNaN(sec) && sec < v.duration) {
                    v.currentTime = sec;
                }
            }
        };

        v.addEventListener("play", onPlay);
        v.addEventListener("pause", onPause);
        v.addEventListener("timeupdate", onTime);
        v.addEventListener("loadedmetadata", onMeta);

        return () => {
            v.removeEventListener("play", onPlay);
            v.removeEventListener("pause", onPause);
            v.removeEventListener("timeupdate", onTime);
            v.removeEventListener("loadedmetadata", onMeta);
        };
    }, [src]);

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
                console.log("toggle subtitles");
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

    return (
        <div className="player-ui">

            <div className="video-click-area" onClick={onVideoClick}></div>

            {isPaused && (
                <div className="center-play" onClick={togglePlay}></div>
            )}

            <VideoPlayer src={src} ref={videoRef} />

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
                                        <span className="settings_title"><Trans i18nKey="player.speed" /></span>
                                        <div className="blocki">
                                        <span className="value">{playbackRate}</span>
                                        <span className="arrow arrow-right"></span>
                                        </div>
                                    </div>

                                    <div className="settings-row" onClick={() => setMenu("subtitles")}>
                                        <span className="settings_title"><Trans i18nKey="player.subtitles" /></span>
                                        <div className="blocki">
                                        <span className="value">
                        {subtitleLang === "off"
                            ? <Trans i18nKey="player.off" />
                            : subtitleLang === "uk"
                                ? <Trans i18nKey="player.uk" />
                                : <Trans i18nKey="player.eng" />}
                    </span>
                                        <span className="arrow arrow-right"></span>
                                        </div>
                                    </div>
                                    <div className="settings-row" onClick={() => setMenu("quality")}>
                                        <span className="settings_title"><Trans i18nKey="player.quality" /></span>
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
                                        <Trans i18nKey="player.speed" />
                                    </div>

                                    {[0.25, 0.5, 0.75, 1, 1.25, 1.75, 2].map((rate) => (
                                        <div
                                            key={rate}
                                            className={`settings_sub_option ${
                                                playbackRate === rate ? "active" : ""
                                            }`}
                                            onClick={() => {
                                                setPlaybackRate(rate);
                                                videoRef.current.playbackRate = rate;
                                            }}
                                        >
                                            {rate}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {menu === "subtitles" && (
                                <div className="settings_sub_list">
                                    <div className="back_sub_row" onClick={() => setMenu("root")}>
                                        <span className="arrow arrow_sub_back"></span>
                                        <Trans i18nKey="player.subtitles" />
                                    </div>

                                    <div
                                        className={`settings_sub_option ${
                                            subtitleLang === "uk" ? "active" : ""
                                        }`}
                                        onClick={() => setSubtitleLang("uk")}
                                    >
                                        <Trans i18nKey="player.ukrainian" />
                                    </div>

                                    <div
                                        className={`settings_sub_option ${
                                            subtitleLang === "eng" ? "active" : ""
                                        }`}
                                        onClick={() => setSubtitleLang("eng")}
                                    >
                                        <Trans i18nKey="player.english" />
                                    </div>

                                    <div
                                        className={`settings_sub_option ${
                                            subtitleLang === "off" ? "active" : ""
                                        }`}
                                        onClick={() => setSubtitleLang("off")}
                                    >
                                        <Trans i18nKey="player.turnOff" />
                                    </div>
                                </div>
                            )}

                            {menu === "quality" && (
                                <div className="settings_sub_list">
                                    <div className="back_sub_row" onClick={() => setMenu("root")}>
                                        <span className="arrow arrow_sub_back"></span>
                                        <Trans i18nKey="player.quality" />
                                    </div>
                                <div className="grap">
                                    {["144p","240p","360p","480p","720p","1080p"].map((q) => (
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
