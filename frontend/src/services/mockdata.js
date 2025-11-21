const mockSlides = [
    { id: 1, className: "home_slide1", link: "/superman", filmname: "slide.filmname1", new: "slide.new1", genre: "slide.genre1", time: "slide.time1" },
    { id: 2, className: "home_slide2", link: "/fantastic-four", filmname: "slide.filmname2", new: "slide.new2", genre: "slide.genre2", time: "slide.time2" },
    { id: 3, className: "home_slide3", link: "/calmar-game", filmname: "slide.filmname3", new: "slide.new3", genre: "slide.genre3", time: "slide.time3" },
    { id: 4, className: "home_slide4", link: "/wensday", filmname: "slide.filmname4", new: "slide.new4", genre: "slide.genre4", time: "slide.time4" },
];

const mockCategories = [
    { name: 'Фільми', icon: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756347758/Film.png', activeIcon: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756347755/Film_active.png' },
    { name: 'Серіали', icon: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756347719/Serial.png', activeIcon: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756347716/Serial_active.png' },
    { name: 'Спорт', icon: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756347763/Sport.png', activeIcon: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756347761/Sport_active.png' },
    { name: 'Мультфільми', icon: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756347730/Cartoon.png', activeIcon: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756347727/Cartoon_active.png'},
    { name: 'Документальне', icon: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756347785/Documentary.png', activeIcon: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756347780/Documentary_active.png' },
    { name: 'Інтерв\'ю', icon: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756347724/Interview.png', activeIcon:'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756347721/Interview_active.png'},
    { name: 'Відеокурси', icon: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756347792/Videocourses.png', activeIcon: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756347788/Videocourses_active.png'},
    { name: 'Лекції', icon: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756347746/Lectures.png', activeIcon: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756347744/Lectures_active.png' },
    { name: 'Фантастика', icon: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756347741/Fantasy.png', activeIcon: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756347738/Fantasy_active.png' },
    { name: 'Ужаси', icon: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756347777/Horror.png', activeIcon: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756347766/Horror_active.png'},
    { name: 'Подкасти', icon: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756347735/Podcast.png', activeIcon: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756347733/Podcast_active.png' },
    { name: 'Мюзикли', icon: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756347752/Musical.png', activeIcon: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756347749/Musical_active.png' },
    { name: 'Природа', icon: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756347795/Nature.png', activeIcon: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756347713/Nature_active.png' },
];

const mockContent = [
    { category: 'Серіали', subcategories: [
            {id: 'new-series', name: 'Новинки серіалів', section: 'hero', films: [
                    { id: 1, rating: "8.0", linedate: "2021-2025 ", line1: "• Південна", line2: "Корея • Виживання", season: "3 сезони", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757533039/Rectangle_1_rifcfv.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 2, rating: "9.2", linedate: "2025 ", line1: "• США •", line2: "Драма", season: "1 сезон", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757533002/Rectangle_1_1_v5oshk.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 3, rating: "8.0", linedate: "2022-2025 ", line1: "• США • Жахи", season: "2 сезони ", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757533005/Rectangle_1_2_hgya7j.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 4, rating: "6.8", linedate: "2025 ", line1: "• США • Жахи", season: "1 сезон", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757533009/Rectangle_1_3_f9m67b.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 5, rating: "6.2", linedate: "2025 ", line1: "• США • Історичний", season: "1 сезон", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757533026/Rectangle_1_4_eolwby.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 6, rating: "7.3", linedate: "2025 ", line1: "• США • Трилер", season: "1 сезон", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757533013/Rectangle_1_5_jq3bne.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 7, rating: "7.3", linedate: "2021-2025 ", line1: "• США • Кримінал", season: "1 сезон", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757533018/Rectangle_1_6_ny8iqd.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 8, rating: "7.6", linedate: "2021-2025 ", line1: "• Південна Корея • ", line2: "Драма", season: "1 сезон", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757533030/Rectangle_1_7_r5svrm.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 9, rating: "8.0", linedate: "2021-2025 ", line1: "• Велика Британія •", line2: "Військовий", season: "1 сезон", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757533022/Rectangle_1_8_oco4a8.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 10, rating: "6.9", linedate: "2021-2025 ", line1: "• США • Драма", season: "1 сезон", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757533034/Rectangle_1_9_sxtgvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                ],
            },
            { id: 'crime', name: 'Кримінальні детективи', section: 'normal', films: [
                    { id: 11, rating: "6.5", linedate: "2017 ", line1: "• США • Детектив", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757537616/Rectangle_1_t29kln.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png"},
                    { id: 12, rating: "7.8", linedate: "2022 ", line1: "• США • Бойовики", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757537616/Rectangle_1_1_kafcas.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 13, rating: "5.7", linedate: "2025 ", line1: "• США • Драми", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757537615/Rectangle_1_2_ho2hzj.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 14, rating: "8.6", linedate: "1991 ", line1: "• США • Кримінал", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757537615/Rectangle_1_3_hftket.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 15, rating: "5.6", linedate: "2025 ", line1: "• США • Кримінал", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757537616/Rectangle_1_4_vhbx7f.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 16, rating: "6.6", linedate: "2023 ", line1: "• США • Жахи", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757537616/Rectangle_1_5_y0cymj.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 17, rating: "6.5", linedate: "2023 ", line1: "• США • Трилер", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757537616/Rectangle_1_6_fjzk9w.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 18, rating: "6.5", linedate: "2023 ", line1: "• США • Драми", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757537615/Rectangle_1_7_t2ircc.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 19, rating: "6.8", linedate: "2022 ", line1: "•Велика Британія •", line2: "Екшн", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757537616/Rectangle_1_8_twfkxu.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 20, rating: "6.6", linedate: "2022 ", line1: "• США • ", line2: "Документальний", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757537616/Rectangle_1_9_wtonhj.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                ],
            },
        ],
    },
    { category: 'Мультфільми', subcategories: [
            { id: 'cartoons-liked', name: 'Мультфільми, які тобі сподобаються', section: 'normal', films: [
                    { id: 21, rating: "8.9", linedate: "2012 ", line1: "• США • Комедія", season: "2 сезони", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757531296/Rectangle_1_v5bny4.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png"   },
                    { id: 22, rating: "9.0", linedate: "2013-2025 ", line1: "• США •", line2: "Комедія", season: "8 сезонів", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757531300/Rectangle_1_1_lzpuqm.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 23, rating: "7.7", linedate: "2025 ", line1: "• США • Фентезі", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757531264/Rectangle_1_2_bfkvxe.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 24, rating: "9.0", linedate: "2021-2024 ", line1: "• США •", line2: "Фентезі", season: "2 сезони", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757531267/Rectangle_1_3_vbq7pl.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 25, rating: "7.1", linedate: "2012 ", line1: "• США • Фентезі", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757531271/Rectangle_1_4_q74uft.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 26, rating: "7.9", linedate: "2024 ", line1: "• Латвія • Пригоди", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757531275/Rectangle_1_5_wzjkum.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 27, rating: "7.6", linedate: "2016 ", line1: "• США • Фентезі", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757531284/Rectangle_1_6_xut673.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 28, rating: "8.0", linedate: "2004 ", line1: "• США •", line2: "Бойовики", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757531279/Rectangle_1_7_b5cdws.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 29, rating: "7.3", linedate: "2021-2024 ", line1: "• США •", line2: "Фентезі", season: "3 сезони", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757531288/Rectangle_1_8_f8zhdn.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 30, rating: "7.6", linedate: "2008 ", line1: "• США •", line2: "Бойовики", season: "1 сезон", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757531292/Rectangle_1_9_ji6b9q.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                ],
            },
        ],
    },
    { category: 'Фільми', subcategories: [
            { id: 'drama', name: 'Драми', section: 'normal', films: [
                    { id: 31, rating: "8.8", linedate: "1999 ", line1: "• США •", line2: "Драми", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757535722/Rectangle_1_vsnbq5.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png"   },
                    { id: 32, rating: "9.3", linedate: "1994 ", line1: "• США • ", line2: "Драми", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757535726/Rectangle_1_1_aud2sr.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 33, rating: "7.9", linedate: "2025 ", line1: "• США •", line2: "Фентезі", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757535730/Rectangle_1_2_t8cnvv.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 34, rating: "7.7", linedate: "2022-2025 ", line1: "• США •", line2: "Фентезі", season: "2 сезони", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757535735/Rectangle_1_3_wo06cd.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 35, rating: "5.3", linedate: "2021 ", line1: "• Франція •", line2: "Жахи", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757535739/Rectangle_1_4_opjufj.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 36, rating: "7.3", linedate: "2025 ", line1: "• США • Бойовики", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757535744/Rectangle_1_5_lmqpti.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 37, rating: "8.2", linedate: "2013 ", line1: "• США • Драми", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757535748/Rectangle_1_6_ucnyk0.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 38, rating: "7.6", linedate: "2019 ", line1: "• США • Драми", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757535753/Rectangle_1_7_irxgsc.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 39, rating: "8.5", linedate: "2011 ", line1: "• Франція • Драми", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757535757/Rectangle_1_8_elcyht.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 40, rating: "8.2", linedate: "2018 ", line1: "• США • Драми", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757535762/Rectangle_1_9_auzrxu.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                ],
            },
            { id: 'true-story', name: 'Засновано на реальних подіях', section: 'normal', films: [
                    { id: 41, rating: "8.3", linedate: "2023 ", line1: "• США •", line2: "Біографічний", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757538280/Rectangle_1_dwm2oz.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 42, rating: "7.9", linedate: "1997 ", line1: "• США • Мелодрама", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757538281/Rectangle_1_1_zhabrs.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 43, rating: "6.1", linedate: "2022 ", line1: "• США • Драми", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757538282/Rectangle_1_2_rd4w0v.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 44, rating: "7.7", linedate: "2008 ", line1: "• Велика Британія •", line2: "Військовий", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757538279/Rectangle_1_3_v8bliy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 45, rating: "7.0", linedate: "2015 ", line1: "• Франція • Трилер", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757538278/Rectangle_1_4_n3u4ay.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 46, rating: "9.0", linedate: "1993 ", line1: "• США • Історичний", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757538278/Rectangle_1_5_auw613.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 47, rating: "7.3", linedate: "2004 ", line1: "• США • Драми", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757538279/Rectangle_1_6_ersw7n.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 48, rating: "6.3", linedate: "2023 ", line1: "• США • Бойовики", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757538279/Rectangle_1_7_w53frv.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 49, rating: "7.8", linedate: "2015 ", line1: "• США • Комедія", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757538279/Rectangle_1_8_kzd3dw.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                    { id: 50, rating: "7.8", linedate: "2017 ", line1: "• Велика Британія, •", line2: "Трилер", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757538280/Rectangle_1_9_uvr7zv.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                ],
            },
        ],
    },
    { category: 'Спорт', subcategories: [ {id: 'sports-docs', name: 'Спортивні фільми', section: 'normal', films: [
                { id: 51, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 52, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 53, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 54, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 55, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 56, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 57, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 58, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 59, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 60, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
            ],
        },
        ],
    },
    { category: 'Документальне', subcategories: [ { id: 'doc-history', name: 'Історичні', section: 'normal', films: [
                { id: 61, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 62, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 63, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 64, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 65, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 66, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 67, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 68, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 69, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 70, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
            ],
        },
        ],
    },
    { category: "Інтерв'ю", subcategories: [ { id: 'talks', name: 'Відомі інтерв\'ю', section: 'normal', films: [
                { id: 71, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 72, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 73, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 74, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 75, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 76, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 77, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 78, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 79, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 80, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
            ],
        },
        ],
    },
    { category: 'Відеокурси', subcategories: [ { id: 'courses-it', name: 'IT-курси', section: 'normal', films: [
                { id: 81, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 82, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 83, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 84, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 85, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 86, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 87, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 88, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 89, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 90, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
            ],
        },
        ],
    },
    { category: 'Лекції', subcategories: [ { id: 'lectures-science', name: 'Наукові лекції', section: 'normal', films: [
                { id: 91, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 92, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 93, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 94, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 95, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 96, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 97, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 98, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 99, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 100, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
            ],
        },
        ],
    },
    { category: 'Фантастика', subcategories: [ {id: 'sci-fi', name: 'Фантастичні пригоди', section: 'normal', films: [
                { id: 101, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 102, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 103, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 104, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 105, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 106, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 107, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 108, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 109, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 110, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
            ],
        },
        ],
    },
    { category: 'Ужаси', subcategories: [ { id: 'horror-classics', name: 'Класичні жахи', section: 'normal', films: [
                { id: 111, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 112, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 113, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 114, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 115, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 116, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 117, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 118, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 119, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 120, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
            ],
        },
        ],
    },
    { category: 'Подкасти', subcategories: [ { id: 'popular-podcasts', name: 'Популярні подкасти', section: 'normal', films: [
                { id: 121, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 122, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 123, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 124, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 125, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 126, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 127, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 128, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 129, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 130, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
            ],
        },
        ],
    },
    { category: 'Мюзикли', subcategories: [ { id: 'broadway', name: 'Бродвейські', section: 'normal', films: [
                { id: 131, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 132, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 133, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 134, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 135, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 136, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 137, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 138, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 139, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 140, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
            ],
        },
        ],
    },
    { category: 'Природа', subcategories: [ { id: 'nature-docs', name: 'Фільми про природу', section: 'normal', films: [
                { id: 141, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 142, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 143, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 144, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 145, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 146, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 147, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 148, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 149, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
                { id: 150, rating: "", line1: "", line2: "", season: "", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png" },
            ],
        },
        ],
    },
];

const mockFilms = [
    { id: 1, title: 'The Brothers Sun', image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756265240/Thebrotherssun.png' },
    { id: 2, title: 'Spider-Man', image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756265250/Spiderman.png' },
    { id: 3, title: 'Scooby-Doo', image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756265233/Scoobydoo.png' },
    { id: 4, title: 'Suits', image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756265246/Suit.png' },
    { id: 5, title: 'Monk', image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756265236/Monk.png' },
    { id: 6, title: 'Dragon 2', image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756265243/Dragon2.png' },
];

const mockActors = [
    { id: 123, name: 'Джейсон Стетхем', role: 'Актор', image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756265326/Statham.png' },
    { id: 124, name: 'Леонардо Ді Капріо', role: 'Актор', image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756265327/DiCaprio.png' },
    { id: 125, name: 'Марго Роббі', role: 'Актриса', image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756265327/Robbie.png' },
    { id: 126, name: 'Роберт Паттінсон', role: 'Актор', image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756265327/Pattinson.png' },
];

const menuItems = [
    { id: 'funny', emoji: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756794853/Funny.png' },
    { id: 'relax', emoji: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756794853/Pleased.png' },
    { id: 'sad', emoji: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756794853/Sad.png' },
    { id: 'romance', emoji: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756794853/Cute.png' },
    { id: 'thrill', emoji: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756794853/Horrors.png' },
    { id: 'excite', emoji: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756794854/Stars.png' },
    { id: 'surprise', emoji: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756794853/Magic.png' },
    { id: 'scare', emoji: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756794853/Horrors.png' },
];

const watchModeItems = [
    { id: 'alone', emoji: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756794853/Secret.png' },
    { id: 'together', emoji: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756794855/Love.png' },
    { id: 'group', emoji: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756794853/Popcorn.png' },
    { id: 'family', emoji: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756794855/Sofa.png' },
];

const starsActors = [
    { id: 'statham', nameKey: 'stars.actors.statham', className: 'home_stars_actor_statham', quoteKey: 'recommendations.quotes.statham'},
    { id: 'garfield', nameKey: 'stars.actors.garfield', className: 'home_stars_actor_garfield', quoteKey: 'recommendations.quotes.garfield'},
    { id: 'cage', nameKey: 'stars.actors.cage', className: 'home_stars_actor_cage', quoteKey: 'recommendations.quotes.cage'},
    { id: 'downey', nameKey: 'stars.actors.downey', className: 'home_stars_actor_downey', quoteKey: 'recommendations.quotes.downey'},
];

export const fakeSlides = async () => {
    await new Promise(r => setTimeout(r, 200));
    return [...mockSlides];
};

export const fakeCategories = async () => {
    await new Promise(r => setTimeout(r, 200));
    return [...mockCategories];
};

export const fakeContent = async (categoryNames) => {
    await new Promise(r => setTimeout(r, 200));
    if (!categoryNames || categoryNames.length === 0) return [...mockContent];
    return mockContent.filter(item => categoryNames.includes(item.category));
};

export const getPopularFilms = async () => {
    await new Promise(r => setTimeout(r, 200));
    return [...mockFilms];
};

export const getPopularActors = async () => {
    await new Promise(r => setTimeout(r, 200));
    return [...mockActors];
};

export const getMenuItems = async () => {
    await new Promise(r => setTimeout(r, 50));
    return [...menuItems];
};

export const getWatchModeItems = async () => {
    await new Promise(r => setTimeout(r, 50));
    return [...watchModeItems];
};

export const getStarsActors = async () => {
    await new Promise(r => setTimeout(r, 50));
    return [...starsActors];
};

