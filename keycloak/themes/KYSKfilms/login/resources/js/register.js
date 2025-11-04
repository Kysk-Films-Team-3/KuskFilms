document.addEventListener('DOMContentLoaded', () => {
    // Находим все необходимые элементы на странице
    const form = document.getElementById('registrationForm');
    const usernameEl = document.getElementById('username');
    const passwordEl = document.getElementById('password');
    const passwordConfirmEl = document.getElementById('password-confirm');
    const submitBtn = document.getElementById('registerBtn');
    const rememberCheckbox = document.getElementById('rememberCheckbox');
    const rememberInput = document.getElementById('rememberMeInput');
    const passwordConfirmError = document.getElementById('password-confirm-client-error');
    const passwordConfirmErrorText = document.getElementById('password-confirm-client-text');

    // Регулярное выражение для простой проверки email
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Восстанавливаем состояние "Запомнить меня" из localStorage
    const savedUsername = localStorage.getItem('lastUsername');
    const savedRemember = localStorage.getItem('rememberMe');
    if (savedUsername) usernameEl.value = savedUsername;
    if (savedRemember === 'true') {
        rememberCheckbox.classList.add('registration_checked');
        if (rememberInput) rememberInput.value = 'true';
    }

    // Обработчик для чекбокса "Запомнить меня"
    rememberCheckbox.addEventListener('click', () => {
        rememberCheckbox.classList.toggle('registration_checked');
        const isChecked = rememberCheckbox.classList.contains('registration_checked');
        if (rememberInput) rememberInput.value = isChecked ? 'true' : 'false';
    });

    // Функция для отображения и скрытия ошибки совпадения паролей
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

    // Главная функция валидации формы
    function checkFormValidity() {
        const isEmailValid = emailRe.test(usernameEl.value.trim());
        const isPasswordEntered = passwordEl.value.length > 0;
        const doPasswordsMatch = passwordEl.value === passwordConfirmEl.value;

        // Показываем ошибку, только если оба пароля введены и не совпадают
        if (isPasswordEntered && passwordConfirmEl.value.length > 0 && !doPasswordsMatch) {
            showPasswordError('Паролі не співпадають.');
        } else {
            hidePasswordError();
        }

        const isFormValid = isEmailValid && isPasswordEntered && doPasswordsMatch;

        // Включаем или выключаем кнопку "Почати"
        submitBtn.disabled = !isFormValid;
        submitBtn.classList.toggle('valid', isFormValid);
        submitBtn.classList.toggle('disabled', !isFormValid);
    }

    // Добавляем слушатели на ввод данных в поля
    usernameEl.addEventListener('input', checkFormValidity);
    passwordEl.addEventListener('input', checkFormValidity);
    passwordConfirmEl.addEventListener('input', checkFormValidity);

    // Обработчик отправки формы
    form.addEventListener('submit', (e) => {
        // Если кнопка по какой-то причине выключена, на всякий случай блокируем отправку
        if (submitBtn.disabled) {
            e.preventDefault();
            return;
        }

        // Сохраняем состояние "Запомнить меня"
        const username = usernameEl.value.trim();
        const remember = rememberCheckbox.classList.contains('registration_checked');
        if (remember) {
            localStorage.setItem('lastUsername', username);
        } else {
            localStorage.removeItem('lastUsername');
        }
        localStorage.setItem('rememberMe', remember ? 'true' : 'false');

        // Больше ничего не делаем, просто позволяем форме отправиться
    });

    // Запускаем валидацию при первой загрузке страницы
    checkFormValidity();
});