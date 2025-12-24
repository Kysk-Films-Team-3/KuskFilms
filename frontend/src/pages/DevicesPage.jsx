import { useEffect, useState } from "react";
import "./DevicesPage.css";
import { fetchPageData } from "../services/api";

export const DevicesPage = () => {
    const [pageData, setPageData] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchPageData('devices');
                setPageData(data);
            } catch (error) {
                setPageData(null);
            }
        })();
    }, []);

    return (
        <div className="devices_page">
            <h1 className="devices_title">{pageData?.title || ""}</h1>
            <div className="devices_top_line"></div>

            <div className="devices_list">
                {pageData?.items?.map((item, i) => (
                    <div className="device_row" key={i}>
                        <div className="device_side_line"></div>
                        <div className="device_text">
                            <h3 className="device_name">{item.name || ""}</h3>
                            <p className="device_desc">{item.description || ""}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
