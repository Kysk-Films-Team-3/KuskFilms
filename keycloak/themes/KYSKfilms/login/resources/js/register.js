document.addEventListener('DOMContentLoaded', () => {
    const usernameEl = document.getElementById('username');
    const submitBtn = document.getElementById('registerBtn');
    const rememberCheckbox = document.getElementById('rememberCheckbox');
    const rememberInput = document.getElementById('rememberMeInput');
    const usernameError = document.getElementById('username-client-error');
    const usernameErrorText = document.getElementById('username-client-text');
    const form = document.getElementById('registrationForm');

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const savedEmail = localStorage.getItem('lastUsername');
    const savedRemember = localStorage.getItem('rememberMe');

    if (savedEmail) usernameEl.value = savedEmail;
    if (savedRemember === 'true') {
        rememberCheckbox.classList.add('registration_checked');
        rememberInput.value = 'true';
    }

    rememberCheckbox.addEventListener('click', () => {
        rememberCheckbox.classList.toggle('registration_checked');
        rememberInput.value = rememberCheckbox.classList.contains('registration_checked') ? 'true' : 'false';
    });

    function isEmailValid() {
        return emailRe.test(usernameEl.value.trim());
    }

    function checkFormValidity() {
        const emailValid = isEmailValid();
        submitBtn.classList.toggle('valid', emailValid);
        submitBtn.classList.toggle('disabled', !emailValid);
        submitBtn.disabled = !emailValid;
        return emailValid;
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

    usernameEl.addEventListener('input', () => {
        hideError();
        checkFormValidity();
    });

    checkFormValidity();

    submitBtn.addEventListener('click', (e) => {
        if (!checkFormValidity()) {
            showError('Будь ласка, введіть дійсну електронну адресу.');
            e.preventDefault();
            e.stopImmediatePropagation();
            return;
        }

        hideError();
        localStorage.setItem('lastUsername', usernameEl.value.trim());
        localStorage.setItem('recoveryEmail', usernameEl.value.trim());

        const remember = rememberCheckbox.classList.contains('registration_checked');
        if (remember) {
            localStorage.setItem('lastUsername', usernameEl.value.trim());
        } else {
            localStorage.removeItem('lastUsername');
        }
        localStorage.setItem('rememberMe', remember ? 'true' : 'false');

    });

});
