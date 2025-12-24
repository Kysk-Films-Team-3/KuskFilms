document.addEventListener("DOMContentLoaded", () => {
    const switcher = document.getElementById("language-switcher");
    
    const languages = {
        "uk": "UA",
        "en": "EN"
    };
    
    function getCurrentLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        let locale = urlParams.get("kc_locale");
        
        if (!locale) {
            locale = urlParams.get("locale");
        }
        
        if (locale && languages[locale]) {
            return locale;
        }
        
        const htmlLang = document.documentElement.lang;
        if (htmlLang) {
            const langCode = htmlLang.split("-")[0].toLowerCase();
            if (languages[langCode]) {
                return langCode;
            }
        }
        
        return "uk";
    }
    
    function switchToNextLanguage() {
        const currentLang = getCurrentLanguage();
        const langCodes = Object.keys(languages);
        const currentIndex = langCodes.indexOf(currentLang);
        const nextIndex = (currentIndex + 1) % langCodes.length;
        const nextLang = langCodes[nextIndex];
        
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const baseUrl = url.origin + url.pathname;
        
        const params = new URLSearchParams(url.search);
        
        params.delete("kc_locale");
        params.delete("locale");
        
        params.set("kc_locale", nextLang);
        
        const queryString = params.toString();
        const newUrl = baseUrl + (queryString ? "?" + queryString : "");
        
        try {
            localStorage.setItem("kc_locale", nextLang);
        } catch (e) {
        }
        
        window.location.href = newUrl;
    }
    
    function updateSwitcherIcon() {
        const currentLangCode = getCurrentLanguage();
        const langCodes = Object.keys(languages);
        const currentIndex = langCodes.indexOf(currentLangCode);
        const nextIndex = (currentIndex + 1) % langCodes.length;
        const nextLang = langCodes[nextIndex];
        const nextLangCode = languages[nextLang];
        
        if (switcher && nextLangCode) {
            const icon = switcher.querySelector(".language-switcher-icon");
            if (icon) {
                icon.textContent = nextLangCode;
            }
        }
    }
    
    if (switcher) {
        updateSwitcherIcon();
        
        switcher.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            switchToNextLanguage();
        });
    }
});

