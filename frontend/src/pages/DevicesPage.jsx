import "./DevicesPage.css";

export const DevicesPage = () => {
    const devices = [
        {
            title: "Смартфони",
            desc: "Платформа підтримує сучасні смартфони на iOS та Android."
        },
        {
            title: "Комп'ютери та ноутбуки",
            desc: "Працює у будь-якому сучасному браузері: Windows, macOS, Linux."
        },
        {
            title: "Smart TV",
            desc: "Підтримуються телевізори з браузером або Android TV."
        }
    ];

    return (
        <div className="devices_page">

            <h1 className="devices_title">Список пристроїв</h1>
            <div className="devices_top_line"></div>

            <div className="devices_list">
                {devices.map((d, i) => (
                    <div className="device_row" key={i}>
                        <div className="device_side_line"></div>

                        <div className="device_text">
                            <h3 className="device_name">{d.title}</h3>
                            <p className="device_desc">{d.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};
