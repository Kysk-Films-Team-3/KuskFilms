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
        <#if message?has_content>
            <div class="registration_error_text" id="server-error"
                 style="display: flex; margin-bottom: 16px; text-align: left;">
                <div class="registration_error_icon"></div>
                <span>${message.summary}</span>
            </div>
        </#if>
        <form class="registration_form" id="registrationForm"
              action="${url.registrationAction}"
              method="post">

            <div class="registration_input_block">
                <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        placeholder=" "
                        class="registration_input"
                        autocomplete="given-name"
                />
                <label for="firstName">Ім'я</label>
                <div class="registration_error_text" id="firstName-client-error" style="display:none;">
                    <div class="registration_error_icon"></div>
                    <span id="firstName-client-text"></span>
                </div>
            </div>

            <div class="registration_input_block">
                <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder=" "
                        class="registration_input"
                        autocomplete="family-name"
                />
                <label for="lastName">Прізвище</label>
                <div class="registration_error_text" id="lastName-client-error" style="display:none;">
                    <div class="registration_error_icon"></div>
                    <span id="lastName-client-text"></span>
                </div>
            </div>

            <div class="registration_input_block">
                <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder=" "
                        class="registration_input"
                        autocomplete="email"
                />
                <label for="email">Ел. пошта</label>
                <div class="registration_error_text" id="email-client-error" style="display:none;">
                    <div class="registration_error_icon"></div>
                    <span id="email-client-text"></span>
                </div>
            </div>

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
                <label for="username">Ім'я користувача</label>
                <div class="registration_error_text" id="username-client-error" style="display:none;">
                    <div class="registration_error_icon"></div>
                    <span id="username-client-text"></span>
                </div>
            </div>

            <div class="registration_input_block">
                <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder=" "
                        class="registration_input"
                        autocomplete="new-password"
                />
                <label for="password">Пароль</label>
            </div>

            <div class="registration_input_block">
                <input
                        type="password"
                        id="password-confirm"
                        name="password-confirm"
                        placeholder=" "
                        class="registration_input"
                        autocomplete="new-password"
                />
                <label for="password-confirm">Підтвердьте пароль</label>
                <div class="registration_error_text" id="password-confirm-client-error" style="display:none;">
                    <div class="registration_error_icon"></div>
                    <span id="password-confirm-client-text"></span>
                </div>
            </div>

            <div class="registration_block">
                <button type="submit" id="registerBtn" class="registration_button">
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