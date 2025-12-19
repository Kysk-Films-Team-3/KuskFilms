import "./PromoInput.css";
import { useState, useEffect, useRef } from "react";
import { getPromoUi, activatePromo } from "../../services/api";

export const PromoInput = ({ isOpen, onClose }) => {
    const [code, setCode] = useState("");
    const [promoUi, setPromoUi] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const promoRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        const loadPromoUi = async () => {
            try {
                const data = await getPromoUi();
                setPromoUi(data);
            } catch (err) {
            }
        };

        loadPromoUi();
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        
        const handleClickOutside = (event) => {
            if (promoRef.current && !promoRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    const handleActivate = async () => {
        if (!code.trim()) return;

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await activatePromo(code);
            setSuccess(result.message || 'Промокод успішно активовано!');
            if (result.isPremium) {
            }
            setCode("");
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Помилка активації промокоду');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleActivate();
        }
    };

    if (!isOpen) return null;

    if (!promoUi) {
        return (
            <div className="promo_overlay">
                <div className="promo_modal_block" ref={promoRef}>
                    <div>Завантаження...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="promo_overlay">
            <div className="promo_modal_block" ref={promoRef}>
                <div onClick={onClose} className="promo_modal_close"></div>

                <h2 className="promo_title">{promoUi.title}</h2>

                <div className="promo_input_row">
                    <input
                        className="promo_input"
                        placeholder={promoUi.inputPlaceholder}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                    />

                    <button 
                        className="promo_btn"
                        onClick={handleActivate}
                        disabled={isLoading || !code.trim()}
                    >
                        {isLoading ? 'Завантаження...' : promoUi.buttonText}
                    </button>
                </div>

                {error && (
                    <p className="promo_error" style={{ color: '#ff4444', marginTop: '10px' }}>
                        {error}
                    </p>
                )}

                {success && (
                    <p className="promo_success" style={{ color: '#00C853', marginTop: '10px' }}>
                        {success}
                    </p>
                )}

                <p className="promo_hint">
                    {promoUi.footerText}
                </p>

            </div>
        </div>
    );
};
