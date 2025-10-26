import React, { useEffect, useRef } from "react";
import { useSettings } from "../../context/SettingsContext";
import { Trans } from "react-i18next";
import "./Device.css";

export const Device = ({ onClose }) => {
    const { state, dispatch } = useSettings();
    const { devices } = state;
    const deviceRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (deviceRef.current && !deviceRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div className="device_overlay" role="dialog" aria-modal="true">
            <div className="device_modal" ref={deviceRef}>
                <div className="device_header">
                    <button className="device_back_button" onClick={onClose}>
                        <div className="device_back_arrow"></div>
                        <div className="device_back_title"><Trans i18nKey="device.backToSettings" /></div>
                    </button>
                    <div className="device_title"><Trans i18nKey="device.title" /></div>
                    <div className="device_counter">{devices.length}/5</div>
                </div>

                <div className="device_block">
                    <div className="device_add_block">
                        <div className="device_description">
                            <Trans i18nKey="device.description" />
                        </div>
                        <button
                            className="device_block_button"
                            type="button"
                            onClick={() =>
                                dispatch({ type: "ADD_DEVICE", payload: `Device ${devices.length + 1}` })
                            }
                            disabled={devices.length >= 5}
                        >
                            <div className="device_plus_icon"></div>
                            <div><Trans i18nKey="device.addDevice" /></div>
                        </button>
                    </div>

                    {devices.length > 0 && (
                        <ul className="device_list">
                            {devices.map((d, i) => (
                                <li key={i} className="device_item">{d}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};
