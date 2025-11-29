import "./PromoInput.css";
import { useState } from "react";

export const PromoInput = ({ isOpen, onClose }) => {
    const [code, setCode] = useState("");

    if (!isOpen) return null;

    return (
        <div className="promo_overlay">
            <div className="promo_modal_block">

                <button onClick={onClose} className="promo_modal_close">×</button>

                <h2 className="promo_title">Введіть промокод</h2>

                <div className="promo_input_row">
                    <input
                        className="promo_input"
                        placeholder="Наприклад: KYSK30"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />

                    <button className="promo_btn">
                        Застосувати
                    </button>
                </div>

                <p className="promo_hint">
                    Промокоди дають знижки або бонуси на підписку Kysk.
                </p>
            </div>
        </div>
    );
};
