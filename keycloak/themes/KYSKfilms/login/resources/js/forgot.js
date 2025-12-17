document.addEventListener("DOMContentLoaded", () => {
    const usernameEl = document.getElementById('username');
    const forgotBtn = document.getElementById('forgotBtn');
    const usernameError = document.getElementById('username-client-error');
    const usernameErrorText = document.getElementById('username-client-text');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validate() {
        const value = usernameEl.value.trim();
        const valid = value.length >= 4;
        forgotBtn.classList.toggle('disabled', !valid);
        forgotBtn.classList.toggle('valid', valid);
        return valid;
    }

    function showError(message) {
        usernameEl.classList.add('error');
        usernameError.style.display = 'flex';
        usernameErrorText.textContent = message;
    }

    function hideError() {
        usernameEl.classList.remove('error');
        usernameError.style.display = 'none';
        usernameErrorText.textContent = '';
    }

    const form = document.getElementById('forgotForm');
    const serverError = document.getElementById('server-error');
    const serverErrorText = document.getElementById('server-error-text');

    function translateServerError() {
        if (serverErrorText) {
            const errorText = (serverErrorText.textContent || serverErrorText.innerHTML || '').toLowerCase();
            const errorHTML = serverErrorText.innerHTML || '';
            
            if (!errorText.trim()) return;
            
            if (errorText.includes('user not found') || 
                errorText.includes('invalid username') || 
                errorText.includes('user does not exist') ||
                errorText.includes('користувача не знайдено') ||
                errorText.includes('не знайдено') ||
                errorText.includes('username not found') ||
                errorText.includes('пользователь не найден') ||
                errorText.includes('пользователь не существует')) {
                serverErrorText.textContent = 'Такого користувача не існує.';
                if (serverError) {
                    serverError.style.display = 'flex';
                    usernameEl.classList.add('error');
                }
            } else if (errorText.includes('invalid email') || 
                       errorText.includes('invalid username or email')) {
                serverErrorText.textContent = 'Будь ласка, введіть дійсну адресу електронної пошти або телефон.';
                if (serverError) {
                    serverError.style.display = 'flex';
                    usernameEl.classList.add('error');
                }
            } else if (serverError && serverError.style.display !== 'none') {
                usernameEl.classList.add('error');
            }
        }
    }

    translateServerError();
    
    setTimeout(translateServerError, 50);
    setTimeout(translateServerError, 100);
    setTimeout(translateServerError, 200);
    setTimeout(translateServerError, 300);
    setTimeout(translateServerError, 500);
    setTimeout(translateServerError, 1000);

    usernameEl.addEventListener('input', () => {
        if (serverError && serverError.style.display !== 'none') {
            serverError.style.display = 'none';
            usernameEl.classList.remove('error');
        }
        validate();
        if (usernameEl.classList.contains('error') && usernameEl.value.trim().length >= 4) {
            hideError();
        }
    });
    
    if (serverError && serverError.style.display !== 'none') {
        usernameEl.classList.add('error');
    }

    form.addEventListener('submit', (e) => {
        const email = usernameEl.value.trim();

        if (!email || email.length < 4) {
            e.preventDefault();
            showError("Будь ласка, введіть адресу електронної пошти або телефон.");
            return;
        }

        if (!validate()) {
            e.preventDefault();
            showError("Будь ласка, введіть дійсну електронну адресу.");
            return;
        }

        hideError();
    });
    
    if (serverError) {
        const observer = new MutationObserver(() => {
            translateServerError();
            if (serverErrorText && serverErrorText.innerHTML) {
                const html = serverErrorText.innerHTML.toLowerCase();
                if (html.includes('user not found') || 
                    html.includes('invalid username') ||
                    html.includes('користувача не знайдено') ||
                    html.includes('пользователь не найден')) {
                    serverErrorText.textContent = 'Такого користувача не існує.';
                    serverError.style.display = 'flex';
                    usernameEl.classList.add('error');
                }
            }
        });
        observer.observe(serverError, { childList: true, subtree: true, characterData: true });
        observer.observe(serverError, { attributes: true, attributeFilter: ['style'] });
    }

    validate();
});
