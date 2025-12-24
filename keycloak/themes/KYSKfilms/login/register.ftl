<!DOCTYPE html>
<html lang="${locale.currentLanguageTag}">
<head>
    <meta charset="UTF-8">
    <title>KYSKFilms</title>
    <link rel="stylesheet" href="${url.resourcesPath}/css/register.css">
    <link rel="stylesheet" href="${url.resourcesPath}/css/language-switcher.css">
    <script src="${url.resourcesPath}/js/register.js" defer></script>
    <script src="${url.resourcesPath}/js/language-switcher.js" defer></script>
</head>
<body class="registration-page">
<div class="registration_page">
    <div class="registration_layout">
        <div class="registration_title">${msg("registration.title")}</div>
        <div class="registration_subtitle">
            ${msg("registration.subtitle")}
        </div>
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
                <label for="firstName">${msg("registration.firstName")}</label>
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
                <label for="lastName">${msg("registration.lastName")}</label>
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
                <label for="email">${msg("registration.email")}</label>
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
                <label for="username">${msg("registration.username")}</label>
            </div>

            <div class="registration_input_block">
                <input
                        type="text"
                        id="password"
                        name="password"
                        placeholder=" "
                        class="registration_input"
                        autocomplete="new-password"
                />
                <label for="password">${msg("registration.password")}</label>
            </div>

            <div class="registration_input_block">
                <input
                        type="text"
                        id="password-confirm"
                        name="password-confirm"
                        placeholder=" "
                        class="registration_input"
                        autocomplete="new-password"
                />
                <label for="password-confirm">${msg("registration.passwordConfirm")}</label>
            </div>

            <#if message?has_content>
                <div class="registration_error_text" id="server-error" style="display: flex;">
                    <div class="registration_error_icon"></div>
                    <span id="server-error-text">${message.summary}</span>
                </div>
            <#else>
                <div class="registration_error_text" id="server-error" style="display:none;">
                    <div class="registration_error_icon"></div>
                    <span id="server-error-text"></span>
                </div>
            </#if>
            <div class="registration_error_text" id="client-error" style="display:none;">
                <div class="registration_error_icon"></div>
                <span id="client-error-text"></span>
            </div>

            <div class="registration_block">
                <button type="submit" id="registerBtn" class="registration_button">
                    ${msg("registration.button")}
                </button>
            </div>
        </form>

        <div class="registration_remember_block">
            <label class="registration_remember_wrapper">
                <div id="rememberCheckbox" class="registration_custom_checkbox">
                    <div class="registration_checkbox_icon"></div>
                </div>
                <span>${msg("registration.rememberMe")}</span>
            </label>
            <input type="hidden" name="rememberMe" id="rememberMeInput" value="false">
        </div>

        <div class="registration_terms_block">
            ${msg("registration.terms")}
            <a href="/terms" target="_blank" rel="noopener noreferrer">${msg("registration.termsLink")}</a><br />
            ${msg("registration.privacyNotice")}
            <a href="/privacy" target="_blank" rel="noopener noreferrer">${msg("registration.privacyLink")}</a>
            <a href="/cookies" target="_blank" rel="noopener noreferrer">${msg("registration.cookiesLink")}</a>
        </div>
    </div>
</div>

<!-- Language Switcher -->
<div id="language-switcher" class="language-switcher">
    <span class="language-switcher-icon">EN</span>
</div>

</body>
</html>