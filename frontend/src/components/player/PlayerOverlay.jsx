import { useEffect, useRef } from "react";
import "./overlay.css";
import CustomPlayer from "./CustomPlayer";

export default function PlayerOverlay({ open, onClose, hlsUrl }) {
    const playerRef = useRef(null);

    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (event) => {
            if (playerRef.current && !playerRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="player-overlay">
            <div className="player-window" ref={playerRef}>

                <div className="player-close" onClick={onClose}></div>

                <div className="player-content">
                    <CustomPlayer src={hlsUrl} onClose={onClose} />
                </div>

            </div>
        </div>
    );
}
