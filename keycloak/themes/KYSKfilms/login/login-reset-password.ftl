<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>Скидання пароля — KYSKFilms</title>
    <link rel="stylesheet" href="${url.resourcesPath}/css/login.css">
    <script src="${url.resourcesPath}/js/login.js" defer></script>
</head>
<body class="login-page">
<div class="login_page">
    <div class="login_layout">
        <div class="login_title">Скинути пароль</div>
        <div class="login_subtitle">Введіть свою адресу електронної пошти або номер телефону, який ви використовуєте для свого облікового запису, щоб продовжити. Ми надішлемо вам код підтвердження для скидання пароля.</div>

        <#if message?has_content>
            <div class="login_error_global">
                <span>${message.summary}</span>
            </div>
        </#if>

        <form id="kc-reset-password-form" class="login_form" action="${url.loginAction}" method="post">
            <div class="login_input_block">
                <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder=" "
                        class="login_input"
                        autofocus
                        autocomplete="username"
                />
                <label for="username">Електронна пошта або ім’я користувача</label>
            </div>

            <div class="login_block">
                <button type="submit" class="login_button valid">Надіслати лист</button>
            </div>
        </form>

        <div class="login_back_block">
            <a href="${url.loginUrl}" class="login_register_link">Повернутися до входу</a>
        </div>
    </div>
</div>
</body>
</html>
