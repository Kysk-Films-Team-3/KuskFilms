document.addEventListener("DOMContentLoaded", () => {
    const passwordEl = document.getElementById("password");
    const confirmEl = document.getElementById("confirmPassword");
    const saveBtn = document.getElementById("saveBtn");

    const upperError = document.getElementById("passwordError");
    const errorBlock = document.getElementById("confirmError");
    const errorText = document.getElementById("confirmErrorText");

    let hasUserInteracted = false;

    function hideErrors() {
        upperError.style.display = "none";
        errorBlock.style.display = "none";
        errorText.textContent = "";
        passwordEl.classList.remove("error");
        confirmEl.classList.remove("error");
    }

    function showError(message) {
        errorBlock.style.display = "flex";
        errorText.textContent = message;
        passwordEl.classList.add("error");
        confirmEl.classList.add("error");
    }

    function validate(showErrors = false) {
        const password = passwordEl.value.trim();
        const confirm = confirmEl.value.trim();
        let isValid = true;

        hideErrors();

        if (password.length > 0 || confirm.length > 0) {
            hasUserInteracted = true;
        }

        if (showErrors || hasUserInteracted) {
            if (password.length < 6) {
                isValid = false;
                showError("Пароль має бути мінімум 6 символів");
            } else if (password !== confirm) {
                isValid = false;
                showError("Паролі не співпадають");
            }
        }

        saveBtn.classList.toggle("disabled", !isValid);
        saveBtn.classList.toggle("valid", isValid);

        return isValid;
    }

    [passwordEl, confirmEl].forEach(input => {
        input.addEventListener("input", () => validate(false));
    });

    saveBtn.addEventListener("click", () => {
        if (!validate(true)) return;
        window.location.href = 'http://localhost:3000/?passwordReset=true';
    });

    hideErrors();
});
