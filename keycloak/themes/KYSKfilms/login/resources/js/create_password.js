 document.addEventListener("DOMContentLoaded", () => {
    const passwordEl = document.getElementById('password');
    const saveBtn = document.getElementById('saveBtn');
    const passwordError = document.getElementById('passwordError');
    const passwordErrorText = document.getElementById('passwordErrorText');
    const rememberCheckbox = document.getElementById('rememberCheckbox');
    const rememberInput = document.getElementById('rememberMeInput');

    rememberCheckbox.addEventListener('click', () => {
    rememberCheckbox.classList.toggle('create_checked');
    rememberInput.value = rememberCheckbox.classList.contains('create_checked') ? "true" : "false";
});

    function validate() {
    const valid = passwordEl.value.trim().length >= 6;
    saveBtn.classList.toggle('disabled', !valid);
    saveBtn.classList.toggle('valid', valid);
    return valid;
}

    passwordEl.addEventListener('input', () => {
    validate();

    if (passwordEl.classList.contains('error') && passwordEl.value.trim().length >= 6) {
    passwordEl.classList.remove('error');
    passwordError.style.display = 'none';
    passwordErrorText.textContent = '';
}
});

    saveBtn.addEventListener('click', () => {
    const isValid = validate();

    if (!isValid) {
    passwordEl.classList.add('error');
    passwordError.style.display = 'flex';
    passwordErrorText.textContent = "Пароль має бути мінімум 6 символів";
    return;
}

    window.location.href = 'http://localhost:3000/?accountCreated=true';
});
    validate();
});
