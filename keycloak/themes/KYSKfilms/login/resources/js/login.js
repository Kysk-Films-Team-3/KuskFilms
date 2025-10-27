    document.addEventListener('DOMContentLoaded', () => {
    const usernameEl = document.getElementById('username');
    const passwordEl = document.getElementById('password');
    const submitBtn = document.querySelector('.login_button');
    const eyeBtn = document.querySelector('.login_toggle_password');
    const eyeIcon = document.getElementById('eyeIcon');
    const rememberCheckbox = document.getElementById('rememberCheckbox');
    const rememberInput = document.getElementById('rememberMeInput');
    const form = document.querySelector('.login_form');

    const usernameError = document.getElementById('username-client-error');
    const usernameErrorText = document.getElementById('username-client-text');
    const passwordError = document.getElementById('password-client-error');
    const passwordErrorText = document.getElementById('password-client-text');

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const savedEmail = localStorage.getItem('lastUsername');
    const savedRemember = localStorage.getItem('rememberMe');

    if (savedEmail) usernameEl.value = savedEmail;
    if (savedRemember === 'true') {
    rememberCheckbox.classList.add('login_checked');
    rememberInput.value = 'true';
}

    eyeBtn.addEventListener('click', () => {
    const visible = passwordEl.type === 'text';
    passwordEl.type = visible ? 'password' : 'text';
    eyeIcon.className = visible ? 'login_eye_icon login_eye_open' : 'login_eye_icon login_eye_closed';
});

    rememberCheckbox.addEventListener('click', () => {
    rememberCheckbox.classList.toggle('login_checked');
    rememberInput.value = rememberCheckbox.classList.contains('login_checked') ? 'true' : 'false';
});

    function checkFormValidity() {
    const emailValid = emailRe.value.length >= 4;
    const passwordValid = passwordEl.value.length >= 4;
    const valid = emailValid && passwordValid;

    submitBtn.classList.toggle('valid', valid);
    submitBtn.classList.toggle('disabled', !valid);

    return {emailValid, passwordValid};
}

    function showErrors() {
    const {emailValid, passwordValid} = checkFormValidity();

    if (!emailValid) {
    usernameEl.classList.add('error');
    usernameError.style.display = 'flex';
    usernameErrorText.textContent = 'Будь ласка, введіть дійсну електронну адресу.';
} else {
    usernameEl.classList.remove('error');
    usernameError.style.display = 'none';
    usernameErrorText.textContent = '';
}

    if (!passwordValid) {
    passwordEl.classList.add('error');
    passwordError.style.display = 'flex';
    passwordErrorText.textContent = 'Ваш пароль має містити від 4 до 60 символів.';
} else {
    passwordEl.classList.remove('error');
    passwordError.style.display = 'none';
    passwordErrorText.textContent = '';
}
}

    usernameEl.addEventListener('input', () => {
    checkFormValidity();
    showErrors();
});

    passwordEl.addEventListener('input', () => {
    checkFormValidity();
    showErrors();
});

    form.addEventListener('submit', (e) => {
    const {emailValid, passwordValid} = checkFormValidity();
    if (!emailValid || !passwordValid) {
    e.preventDefault();
    showErrors();
} else {
    const remember = rememberCheckbox.classList.contains('login_checked');
    if (remember) {
    localStorage.setItem('lastUsername', usernameEl.value.trim());
} else {
    localStorage.removeItem('lastUsername');
}
    localStorage.setItem('rememberMe', remember);
}
});

    checkFormValidity();
});


