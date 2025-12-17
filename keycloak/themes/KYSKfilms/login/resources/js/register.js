document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');

    const firstNameEl = document.getElementById('firstName');
    const lastNameEl = document.getElementById('lastName');
    const emailEl = document.getElementById('email');
    const usernameEl = document.getElementById('username');
    const passwordEl = document.getElementById('password');
    const passwordConfirmEl = document.getElementById('password-confirm');

    const submitBtn = document.getElementById('registerBtn');
    const rememberCheckbox = document.getElementById('rememberCheckbox');
    const rememberInput = document.getElementById('rememberMeInput');

    const clientError = document.getElementById('client-error');
    const clientErrorText = document.getElementById('client-error-text');
    const serverError = document.getElementById('server-error');
    const serverErrorText = document.getElementById('server-error-text');

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const savedRemember = localStorage.getItem('rememberMe');
    if (savedRemember === 'true') {
        rememberCheckbox.classList.add('registration_checked');
        if (rememberInput) rememberInput.value = 'true';
    } else {
        if (rememberInput) rememberInput.value = 'false';
    }

    rememberCheckbox.addEventListener('click', () => {
        rememberCheckbox.classList.toggle('registration_checked');
        const isChecked = rememberCheckbox.classList.contains('registration_checked');
        if (rememberInput) rememberInput.value = isChecked ? 'true' : 'false';
    });

    function checkFormValidity() {
        const firstNameValid = firstNameEl && firstNameEl.value.trim().length > 0;
        const lastNameValid = lastNameEl && lastNameEl.value.trim().length > 0;
        const emailValid = emailEl && emailRe.test(emailEl.value.trim());
        const usernameValid = usernameEl && usernameEl.value.trim().length > 0;
        const passwordValid = passwordEl && passwordEl.value.length > 0;
        const passwordConfirmValid = passwordConfirmEl && passwordConfirmEl.value.length > 0;
        const passwordsMatch = passwordEl && passwordConfirmEl && passwordEl.value === passwordConfirmEl.value;

        const allValid = firstNameValid && lastNameValid && emailValid && usernameValid && passwordValid && passwordConfirmValid && passwordsMatch;

        submitBtn.classList.toggle('valid', allValid);
        submitBtn.classList.toggle('disabled', !allValid);

        return allValid;
    }

    function showErrors() {
        const firstNameValid = firstNameEl && firstNameEl.value.trim().length > 0;
        const lastNameValid = lastNameEl && lastNameEl.value.trim().length > 0;
        const emailValid = emailEl && emailRe.test(emailEl.value.trim());
        const usernameValid = usernameEl && usernameEl.value.trim().length > 0;
        const passwordValid = passwordEl && passwordEl.value.length > 0;
        const passwordConfirmValid = passwordConfirmEl && passwordConfirmEl.value.length > 0;
        const passwordsMatch = passwordEl && passwordConfirmEl && passwordEl.value === passwordConfirmEl.value;

        const allValid = firstNameValid && lastNameValid && emailValid && usernameValid && passwordValid && passwordConfirmValid && passwordsMatch;

        if (!allValid) {
            if (serverError) {
                serverError.style.display = 'none';
            }
            if (clientError && clientErrorText) {
                clientErrorText.textContent = 'Будь ласка заповніть всі поля.';
                clientError.style.display = 'flex';
            }
            [firstNameEl, lastNameEl, emailEl, usernameEl, passwordEl, passwordConfirmEl].forEach(el => {
                if (el) el.classList.add('error');
            });
        } else {
            if (clientError) {
                clientError.style.display = 'none';
            }
            [firstNameEl, lastNameEl, emailEl, usernameEl, passwordEl, passwordConfirmEl].forEach(el => {
                if (el) el.classList.remove('error');
            });
        }
    }

    function translateServerError() {
        if (serverError && serverErrorText) {
            const isErrorVisible = serverError.style.display === 'flex' || window.getComputedStyle(serverError).display !== 'none';
            const errorText = (serverErrorText.textContent || serverErrorText.innerHTML || '').toLowerCase();
            const hasErrorText = errorText.trim().length > 0;
            
            if (isErrorVisible || hasErrorText) {
                [firstNameEl, lastNameEl, emailEl, usernameEl, passwordEl, passwordConfirmEl].forEach(el => {
                    if (el) el.classList.add('error');
                });
                
                if (clientError) {
                    clientError.style.display = 'none';
                }
                
                if (hasErrorText && !errorText.includes('заповніть') && !errorText.includes('вкажіть')) {
                    serverErrorText.textContent = 'Користувач вже існує.';
                } else if (hasErrorText) {
                    serverErrorText.textContent = 'Будь ласка заповніть всі поля.';
                }
                
                if (serverError) {
                    serverError.style.display = 'flex';
                }
            }
        }
    }

    translateServerError();
    setTimeout(() => {
        translateServerError();
    }, 100);

    [firstNameEl, lastNameEl, emailEl, usernameEl, passwordEl, passwordConfirmEl].forEach(el => {
        if (el) {
            el.addEventListener('input', () => {
                if (clientError && clientError.style.display !== 'none') {
                    clientError.style.display = 'none';
                }
                if (serverError && serverError.style.display !== 'none') {
                    serverError.style.display = 'none';
                }
                if (el) el.classList.remove('error');
                checkFormValidity();
            });
        }
    });

    checkFormValidity();

    form.addEventListener('submit', (e) => {
        const allValid = checkFormValidity();
        
        if (!allValid) {
            e.preventDefault();
            showErrors();
        } else {
            [firstNameEl, lastNameEl, emailEl, usernameEl, passwordEl, passwordConfirmEl].forEach(el => {
                if (el) el.classList.remove('error');
            });
            if (clientError) {
                clientError.style.display = 'none';
            }
            if (serverError) {
                serverError.style.display = 'none';
            }

            const username = usernameEl.value.trim();
            const remember = rememberCheckbox.classList.contains('registration_checked');
            if (remember) {
                localStorage.setItem('lastUsername', username);
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('lastUsername');
                localStorage.setItem('rememberMe', 'false');
            }
            if (rememberInput) {
                rememberInput.value = remember ? 'true' : 'false';
            }
        }
    });

    if (serverError) {
        const observer = new MutationObserver(() => {
            translateServerError();
        });
        observer.observe(serverError, { childList: true, subtree: true, characterData: true });
        observer.observe(serverError, { attributes: true, attributeFilter: ['style'] });
    }
});
