document.addEventListener('DOMContentLoaded', () => {
    // Находим основные элементы формы
    const form = document.getElementById('registrationForm');
    const usernameEl = document.getElementById('username');
    const passwordEl = document.getElementById('password');
    const passwordConfirmEl = document.getElementById('password-confirm');
    const submitBtn = document.getElementById('registerBtn');

    // Регулярное выражение для проверки email
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Функция для проверки, что все поля валидны и можно активировать кнопку
    function checkFormValidity() {
        const isEmailValid = emailRe.test(usernameEl.value.trim());
        const isPasswordValid = passwordEl.value.length > 0;
        const doPasswordsMatch = passwordEl.value === passwordConfirmEl.value;

        const isFormValid = isEmailValid && isPasswordValid && doPasswordsMatch;

        // Включаем или выключаем кнопку в зависимости от валидности формы
        submitBtn.disabled = !isFormValid;
        if (isFormValid) {
            submitBtn.classList.add('valid');
            submitBtn.classList.remove('disabled');
        } else {
            submitBtn.classList.add('disabled');
            submitBtn.classList.remove('valid');
        }
    }

    // Добавляем слушатели на ввод в каждое поле, чтобы проверять валидность "на лету"
    usernameEl.addEventListener('input', checkFormValidity);
    passwordEl.addEventListener('input', checkFormValidity);
    passwordConfirmEl.addEventListener('input', checkFormValidity);

    // Главный обработчик отправки формы
    form.addEventListener('submit', (e) => {
        // Создаем и добавляем скрытые поля ПЕРЕД отправкой
        // Это гарантирует, что Keycloak их получит.

        // Поле для Имени
        const firstNameInput = document.createElement('input');
        firstNameInput.type = 'hidden';
        firstNameInput.name = 'firstName';
        firstNameInput.value = 'User'; // Задаем значение по умолчанию
        form.appendChild(firstNameInput);

        // Поле для Фамилии
        const lastNameInput = document.createElement('input');
        lastNameInput.type = 'hidden';
        lastNameInput.name = 'lastName';
        lastNameInput.value = 'User'; // Задаем значение по умолчанию
        form.appendChild(lastNameInput);

        // После добавления полей, позволяем форме отправиться стандартным образом.
        // Мы НЕ используем e.preventDefault(), так как нам нужна обычная отправка.
    });

    // Вызываем проверку один раз при загрузке страницы
    checkFormValidity();
});