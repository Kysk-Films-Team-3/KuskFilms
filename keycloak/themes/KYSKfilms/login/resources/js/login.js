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
    const globalError = document.getElementById('login-global-error');
    const globalErrorText = document.getElementById('login-error-text');
    
    function translateServerError() {
        if (globalErrorText && globalErrorText.textContent.trim()) {
            const errorText = globalErrorText.textContent.toLowerCase();
            
            if (errorText.includes('invalid username or password') || 
                errorText.includes('invalid username') ||
                errorText.includes('invalid password') ||
                errorText.includes('неверное имя пользователя или пароль') ||
                errorText.includes('неверный пароль') ||
                errorText.includes('неверное имя пользователя') ||
                errorText.includes('user not found') ||
                errorText.includes('пользователь не найден')) {
                globalErrorText.textContent = 'Невірне ім\'я користувача або пароль.';
            } else if (errorText.includes('account is disabled') ||
                       errorText.includes('account disabled') ||
                       errorText.includes('аккаунт отключен') ||
                       errorText.includes('аккаунт заблокирован')) {
                globalErrorText.textContent = 'Обліковий запис відключено.';
            } else if (errorText.includes('account is temporarily disabled') ||
                       errorText.includes('temporarily disabled')) {
                globalErrorText.textContent = 'Обліковий запис тимчасово відключено.';
            }
            
            if (globalError && globalError.style.display !== 'none') {
                usernameEl.classList.add('error');
                passwordEl.classList.add('error');
                passwordError.style.display = 'none';
            }
        }
    }
    
    translateServerError();
    setTimeout(() => {
        translateServerError();
    }, 100);
    
    if (globalError && globalError.style.display !== 'none') {
        usernameEl.classList.add('error');
        passwordEl.classList.add('error');
        passwordError.style.display = 'none';
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const savedEmail = localStorage.getItem('lastUsername');
    const savedRemember = localStorage.getItem('rememberMe');

    if (savedEmail && usernameEl) {
        usernameEl.value = savedEmail;
    }
    if (savedRemember === 'true') {
        rememberCheckbox.classList.add('login_checked');
        if (rememberInput) rememberInput.value = 'true';
    } else {
        if (rememberInput) rememberInput.value = 'false';
    }

    eyeBtn.addEventListener('click', () => {
    const visible = passwordEl.type === 'text';
    passwordEl.type = visible ? 'password' : 'text';
    eyeIcon.className = visible ? 'login_eye_icon login_eye_open' : 'login_eye_icon login_eye_closed';
});

    rememberCheckbox.addEventListener('click', () => {
    rememberCheckbox.classList.toggle('login_checked');
    if (rememberInput) {
        rememberInput.value = rememberCheckbox.classList.contains('login_checked') ? 'true' : 'false';
    }
});

    function checkFormValidity() {
        const emailValid = usernameEl.value.length >= 4;
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
    if (globalError) {
        globalError.style.display = 'none';
    }
    passwordError.style.display = 'flex';
    passwordErrorText.textContent = 'Ваш пароль має містити від 4 до 60 символів.';
} else {
    passwordEl.classList.remove('error');
    passwordError.style.display = 'none';
    passwordErrorText.textContent = '';
}
}


    usernameEl.addEventListener('input', () => {
    if (globalError && globalError.style.display !== 'none') {
        globalError.style.display = 'none';
        usernameEl.classList.remove('error');
        passwordEl.classList.remove('error');
    }
    checkFormValidity();
    showErrors();
});

    passwordEl.addEventListener('input', () => {
    if (globalError && globalError.style.display !== 'none') {
        globalError.style.display = 'none';
        usernameEl.classList.remove('error');
        passwordEl.classList.remove('error');
    }
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

    checkFormValidity();
    
    if (globalError) {
        const observer = new MutationObserver(() => {
            translateServerError();
        });
        observer.observe(globalError, { childList: true, subtree: true, characterData: true });
        observer.observe(globalError, { attributes: true, attributeFilter: ['style'] });
    }
});


