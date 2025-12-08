import "./DevicesPage.css";
import { Trans } from "react-i18next";

export const DevicesPage = () => {
    const devices = [
        {
            titleKey: "devicesPage.smartphones",
            descKey: "devicesPage.smartphonesDesc"
        },
        {
            titleKey: "devicesPage.computers",
            descKey: "devicesPage.computersDesc"
        },
        {
            titleKey: "devicesPage.smartTV",
            descKey: "devicesPage.smartTVDesc"
        }
    ];

    return (
        <div className="devices_page">

            <h1 className="devices_title"><Trans i18nKey="devicesPage.title" /></h1>
            <div className="devices_top_line"></div>

            <div className="devices_list">
                {devices.map((d, i) => (
                    <div className="device_row" key={i}>
                        <div className="device_side_line"></div>

                        <div className="device_text">
                            <h3 className="device_name"><Trans i18nKey={d.titleKey} /></h3>
                            <p className="device_desc"><Trans i18nKey={d.descKey} /></p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};
