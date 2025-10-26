<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>KYSKFilms</title>
    <link rel="stylesheet" href="${url.resourcesPath}/css/register.css">
    <script src="${url.resourcesPath}/js/register.js" defer></script>
</head>
<body class="registration-page">
<div class="registration_page">
    <div class="registration_layout">
        <div class="registration_title">Реєстрація</div>
        <div class="registration_subtitle">
            Готові дивитися? Введіть свою електронну адресу або
            мобільний телефон, щоб створити акаунт.
        </div>

        <form class="registration_form" id="registrationForm" onsubmit="return false;">
            <div class="registration_input_block">
                <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder=" "
                        class="registration_input"
                        value="${(username)!}"
                        autocomplete="username"
                />
                <label for="username">Адреса електронної пошти або мобільний телефон</label>
                <div class="registration_error_text" id="username-client-error" style="display:none;">
                    <div class="registration_error_icon"></div>
                    <span id="username-client-text"></span>
                </div>
            </div>
            <div class="registration_block">
                <button type="button" id="registerBtn" class="registration_button"   onclick="window.location.href='${url.resourcesPath}/confirm_code.html'">
                    Почати
                </button>
            </div>
        </form>

        <div class="registration_remember_block">
            <label class="registration_remember_wrapper">
                <div id="rememberCheckbox" class="registration_custom_checkbox">
                    <div class="registration_checkbox_icon"></div>
                </div>
                <span>Запам'ятати мене</span>
            </label>
            <input type="hidden" name="rememberMe" id="rememberMeInput" value="false">
        </div>

        <div class="registration_terms_block">
            Продовжуючи, ви погоджуєтеся з KYSK
            <a href="/terms" target="_blank" rel="noopener noreferrer">Умовами використання</a><br />
            Будь ласка, перегляньте наші
            <a href="/privacy" target="_blank" rel="noopener noreferrer">Повідомленням про конфіденційність,</a>
            <a href="/cookies" target="_blank" rel="noopener noreferrer">повідомлення про файли cookie та повідомлення про рекламу на
                основі інтересів.</a>
        </div>
    </div>
</div>
</body>
</html>
