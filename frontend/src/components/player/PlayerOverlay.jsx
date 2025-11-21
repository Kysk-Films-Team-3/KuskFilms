import "./overlay.css";
import CustomPlayer from "./CustomPlayer";

export default function PlayerOverlay({ open, onClose, hlsUrl }) {
    if (!open) return null;

    return (
        <div className="player-overlay">
            <div className="player-window">

                <div className="player-close" onClick={onClose}></div>

                <div className="player-content">
                    <CustomPlayer src={hlsUrl} onClose={onClose} />
                </div>

            </div>
        </div>
    );
}
