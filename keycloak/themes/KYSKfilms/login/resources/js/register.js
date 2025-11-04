document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');

    const firstNameEl = document.getElementById('firstName');
    const lastNameEl = document.getElementById('lastName');

    const usernameEl = document.getElementById('username');
    const passwordEl = document.getElementById('password');
    const passwordConfirmEl = document.getElementById('password-confirm');

    const submitBtn = document.getElementById('registerBtn');
    const rememberCheckbox = document.getElementById('rememberCheckbox');
    const rememberInput = document.getElementById('rememberMeInput');

    const firstNameError = document.getElementById('firstName-client-error');
    const firstNameErrorText = document.getElementById('firstName-client-text');
    const lastNameError = document.getElementById('lastName-client-error');
    const lastNameErrorText = document.getElementById('lastName-client-text');

    const usernameError = document.getElementById('username-client-error');
    const usernameErrorText = document.getElementById('username-client-text');
    const passwordConfirmError = document.getElementById('password-confirm-client-error');
    const passwordConfirmErrorText = document.getElementById('password-confirm-client-text');

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const savedUsername = localStorage.getItem('lastUsername');
    const savedRemember = localStorage.getItem('rememberMe');

    if (savedUsername) usernameEl.value = savedUsername;
    if (savedRemember === 'true') {
        rememberCheckbox.classList.add('registration_checked');
        if (rememberInput) rememberInput.value = 'true';
    }

    rememberCheckbox.addEventListener('click', () => {
        rememberCheckbox.classList.toggle('registration_checked');
        const isChecked = rememberCheckbox.classList.contains('registration_checked');
        if (rememberInput) rememberInput.value = isChecked ? 'true' : 'false';
    });

    function isFieldValid(el) {
        return el.value.trim().length > 0;
    }

    function isEmailValid() {
        return emailRe.test(usernameEl.value.trim());
    }

    function arePasswordsValid() {
        const password = passwordEl.value;
        const passwordConfirm = passwordConfirmEl.value;

        if (password.length === 0 && passwordConfirm.length === 0) {
            hidePasswordError();
            return false;
        }

        if (password === passwordConfirm) {
            hidePasswordError();
            return true;
        } else {
            if (password.length > 0 && passwordConfirm.length > 0) {
                showPasswordError('Паролі не співпадають.');
            }
            return false;
        }
    }

    function checkFormValidity() {
        const firstNameValid = isFieldValid(firstNameEl);
        const lastNameValid = isFieldValid(lastNameEl);
        const emailValid = isEmailValid();
        const passwordsValid = (passwordEl.value.length > 0 && passwordConfirmEl.value.length > 0 && passwordEl.value === passwordConfirmEl.value);

        const allValid = firstNameValid && lastNameValid && emailValid && passwordsValid;

        submitBtn.classList.toggle('valid', allValid);
        submitBtn.classList.toggle('disabled', !allValid);
        submitBtn.disabled = !allValid;
        return allValid;
    }

    function showError(el, errorEl, errorTextEl, msg) {
        if (el) el.classList.add('error');
        if (errorEl) errorEl.style.display = 'flex';
        if (errorTextEl) errorTextEl.textContent = msg;
    }
    function hideError(el, errorEl) {
        if (el) el.classList.remove('error');
        if (errorEl) errorEl.style.display = 'none';
    }

    function showPasswordError(msg) {
        if (passwordConfirmEl) passwordConfirmEl.classList.add('error');
        if (passwordConfirmError) {
            passwordConfirmError.style.display = 'flex';
            if (passwordConfirmErrorText) passwordConfirmErrorText.textContent = msg;
        }
    }
    function hidePasswordError() {
        if (passwordConfirmEl) passwordConfirmEl.classList.remove('error');
        if (passwordConfirmError) {
            passwordConfirmError.style.display = 'none';
        }
    }

    if (firstNameEl) {
        firstNameEl.addEventListener('input', () => {
            hideError(firstNameEl, firstNameError);
            checkFormValidity();
        });
    }
    if (lastNameEl) {
        lastNameEl.addEventListener('input', () => {
            hideError(lastNameEl, lastNameError);
            checkFormValidity();
        });
    }
    if (usernameEl) {
        usernameEl.addEventListener('input', () => {
            hideError(usernameEl, usernameError);
            checkFormValidity();
        });
    }
    if (passwordEl) {
        passwordEl.addEventListener('input', () => {
            arePasswordsValid();
            checkFormValidity();
        });
    }
    if (passwordConfirmEl) {
        passwordConfirmEl.addEventListener('input', () => {
            arePasswordsValid();
            checkFormValidity();
        });
    }

    checkFormValidity();

    form.addEventListener('submit', (e) => {

        let valid = true;

        if (!isFieldValid(firstNameEl)) {
            e.preventDefault();
            showError(firstNameEl, firstNameError, firstNameErrorText, "Будь ласка, введіть ваше ім'я.");
            valid = false;
        }
        if (!isFieldValid(lastNameEl)) {
            e.preventDefault();
            showError(lastNameEl, lastNameError, lastNameErrorText, "Будь ласка, введіть ваше прізвище.");
            valid = false;
        }
        if (!isEmailValid()) {
            e.preventDefault();
            showError(usernameEl, usernameError, usernameErrorText, 'Будь ласка, введіть дійсну електронну адресу.');
            valid = false;
        }
        if (!arePasswordsValid() || passwordEl.value.length === 0) {
            e.preventDefault();
            showPasswordError('Будь ласка, введіть та підтвердьте ваш пароль.');
            valid = false;
        }

        if (!valid) {
            return;
        }

        const username = usernameEl.value.trim();
        const remember = rememberCheckbox.classList.contains('registration_checked');

        if (remember) {
            localStorage.setItem('lastUsername', username);
        } else {
            localStorage.removeItem('lastUsername');
        }
        localStorage.setItem('rememberMe', remember ? 'true' : 'false');
    });
});