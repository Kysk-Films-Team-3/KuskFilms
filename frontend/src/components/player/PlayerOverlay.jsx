import { useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./overlay.css";
import CustomPlayer from "./CustomPlayer";

export default function PlayerOverlay({ open, onClose, titleId: propTitleId, episodeId: propEpisodeId = null }) {
    const playerRef = useRef(null);
    const params = useParams();
    const location = useLocation();
    
    const titleId = propTitleId || (params.id ? parseInt(params.id) : null);
    const episodeId = propEpisodeId || (location.search ? new URLSearchParams(location.search).get('episodeId') : null);

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
                    <CustomPlayer titleId={titleId} episodeId={episodeId} onClose={onClose} />
                </div>

            </div>
        </div>
    );
}
