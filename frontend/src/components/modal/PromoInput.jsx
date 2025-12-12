import "./PromoInput.css";
import { useState, useEffect, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";

export const PromoInput = ({ isOpen, onClose }) => {
    const [code, setCode] = useState("");
    const promoRef = useRef(null);
    const { t } = useTranslation();

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

    if (!isOpen) return null;

    return (
        <div className="promo_overlay">
            <div className="promo_modal_block" ref={promoRef}>
                <div onClick={onClose} className="promo_modal_close"></div>

                <h2 className="promo_title"><Trans i18nKey="promoInput.title" /></h2>

                <div className="promo_input_row">
                    <input
                        className="promo_input"
                        placeholder={t("promoInput.placeholder")}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />

                    <button className="promo_btn">
                        <Trans i18nKey="promoInput.button" />
                    </button>
                </div>

                <p className="promo_hint">
                    <Trans i18nKey="promoInput.hint" />
                </p>

            </div>
        </div>
    );
};
