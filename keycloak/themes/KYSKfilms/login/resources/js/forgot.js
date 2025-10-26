document.addEventListener("DOMContentLoaded", () => {
    const usernameEl = document.getElementById('username');
    const forgotBtn = document.getElementById('forgotBtn');
    const usernameError = document.getElementById('username-client-error');
    const usernameErrorText = document.getElementById('username-client-text');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validate() {
        const value = usernameEl.value.trim();
        const valid = emailRe.test(value);
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

    usernameEl.addEventListener('input', () => {
        validate();
        if (usernameEl.classList.contains('error') && emailRe.test(usernameEl.value.trim())) {
            hideError();
        }
    });

    forgotBtn.addEventListener("click", () => {
        const email = usernameEl.value.trim();

        if (!email) {
            showError("Будь ласка, введіть адресу електронної пошти або телефон.");
            return;
        }

        if (!validate()) {
            showError("Невірна адреса електронної пошти.");
            return;
        }

        hideError();
        localStorage.setItem("recoveryEmail", email);
        window.location.href = "verify_code.html";
    });

    validate();
});
