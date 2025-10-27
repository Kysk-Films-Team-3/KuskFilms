document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const usernameEl = document.getElementById('username');
    const passwordEl = document.getElementById('password');
    const passwordConfirmEl = document.getElementById('password-confirm');

    const submitBtn = document.getElementById('registerBtn');
    const rememberCheckbox = document.getElementById('rememberCheckbox');
    const rememberInput = document.getElementById('rememberMeInput');

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
        const emailValid = isEmailValid();
        const passwordsValid = (passwordEl.value.length > 0 && passwordConfirmEl.value.length > 0 && passwordEl.value === passwordConfirmEl.value);

        const allValid = emailValid && passwordsValid;

        submitBtn.classList.toggle('valid', allValid);
        submitBtn.classList.toggle('disabled', !allValid);
        submitBtn.disabled = !allValid;
        return allValid;
    }

    function showError(msg) {
        usernameEl.classList.add('error');
        usernameError.style.display = 'flex';
        usernameErrorText.textContent = msg;
    }
    function hideError() {
        usernameEl.classList.remove('error');
        usernameError.style.display = 'none';
        usernameErrorText.textContent = '';
    }
    function showPasswordError(msg) {
        passwordConfirmEl.classList.add('error');
        if (passwordConfirmError) {
            passwordConfirmError.style.display = 'flex';
            passwordConfirmErrorText.textContent = msg;
        }
    }
    function hidePasswordError() {
        passwordConfirmEl.classList.remove('error');
        if (passwordConfirmError) {
            passwordConfirmError.style.display = 'none';
            passwordConfirmErrorText.textContent = '';
        }
    }

    usernameEl.addEventListener('input', () => {
        hideError();
        checkFormValidity();
    });
    passwordEl.addEventListener('input', () => {
        arePasswordsValid();
        checkFormValidity();
    });
    passwordConfirmEl.addEventListener('input', () => {
        arePasswordsValid();
        checkFormValidity();
    });

    checkFormValidity();

    form.addEventListener('submit', (e) => {

        if (!isEmailValid()) {
            e.preventDefault();
            showError('Будь ласка, введіть дійсну електронну адресу.');
            return;
        }
        if (!arePasswordsValid() || passwordEl.value.length === 0) {
            e.preventDefault();
            showPasswordError('Будь ласка, введіть та підтвердьте ваш пароль.');
            return;
        }

        hideError();
        hidePasswordError();

        const firstNameInput = document.createElement('input');
        firstNameInput.type = 'hidden';
        firstNameInput.name = 'firstName';
        firstNameInput.value = 'User';

        const lastNameInput = document.createElement('input');
        lastNameInput.type = 'hidden';
        lastNameInput.name = 'lastName';
        lastNameInput.value = 'User';

        form.appendChild(firstNameInput);
        form.appendChild(lastNameInput);

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