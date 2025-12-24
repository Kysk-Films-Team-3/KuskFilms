<!DOCTYPE html>
<html lang="${locale.currentLanguageTag}">
<head>
    <meta charset="UTF-8">
    <title>KYSKFilms</title>
    <link rel="stylesheet" href="${url.resourcesPath}/css/login.css">
    <link rel="stylesheet" href="${url.resourcesPath}/css/language-switcher.css">
    <script src="${url.resourcesPath}/js/login.js" defer></script>
    <script src="${url.resourcesPath}/js/language-switcher.js" defer></script>
</head>
<body class="login-page">
<div class="login_page">
    <div class="login_layout">

        <div class="login_title">${msg("login.title")}</div>
        <form class="login_form" method="post" action="${url.loginAction}">

            <div class="login_input_block">
                <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder=" "
                        class="login_input"
                        value="${(username)!}"
                        autocomplete="username"
                />

                <label for="username">${msg("login.emailOrPhone")}</label>
                <div class="login_error_text" id="username-client-error" style="display:none;">
                    <div class="login_error_icon"></div>
                    <span id="username-client-text"></span>
                </div>
            </div>

            <div class="login_input_block login_password_container">
                <div class="login_password_wrapper">
                    <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder=" "
                            class="login_input password_input"
                            autocomplete="current-password"
                    />
                    <label for="password">${msg("login.password")}</label>
                    <button type="button" class="login_toggle_password">
                        <span id="eyeIcon" class="login_eye_icon login_eye_open"></span>
                    </button>
                </div>
                <#if message?has_content>
                    <div class="login_error_text" id="login-global-error" style="display: flex;">
                        <div class="login_error_icon"></div>
                        <span id="login-error-text">${message.summary}</span>
                    </div>
                    <div class="login_error_text" id="password-client-error" style="display:none;">
                        <div class="login_error_icon"></div>
                        <span id="password-client-text"></span>
                    </div>
                <#else>
                    <div class="login_error_text" id="login-global-error" style="display:none;">
                        <div class="login_error_icon"></div>
                        <span id="login-error-text"></span>
                    </div>
                    <div class="login_error_text" id="password-client-error" style="display:none;">
                        <div class="login_error_icon"></div>
                        <span id="password-client-text"></span>
                    </div>
                </#if>
            </div>

            <div class="login_block">
                <button type="submit" class="login_button disabled">${msg("login.button")}</button>
            </div>

        </form>

        <div class="login_forgot_block">
            <a href="${url.loginResetCredentialsUrl}" class="login_forgot_link">${msg("login.forgotPassword")}</a>
        </div>

        <div class="login_remember_block">
            <label class="login_remember_wrapper">
                <div id="rememberCheckbox" class="login_custom_checkbox">
                    <div class="login_checkbox_icon"></div>
                </div>
                <span>${msg("login.rememberMe")}</span>
            </label>
            <input type="hidden" name="rememberMe" id="rememberMeInput" value="false">
        </div>


        <div class="login_register_block">${msg("login.firstTime")}
            <button type="button" class="login_register_link"
                    onclick="window.location.href='${url.registrationUrl}'">
                ${msg("login.register")}
            </button>

        </div>


        <div class="login_terms_block">
            ${msg("login.terms")}
            <a href="/terms" target="_blank" rel="noopener noreferrer">${msg("login.termsLink")}</a><br />
            ${msg("login.privacyNotice")}
            <a href="/privacy" target="_blank" rel="noopener noreferrer">${msg("login.privacyLink")}</a>
            <a href="/cookies" target="_blank" rel="noopener noreferrer">${msg("login.cookiesLink")}</a>
        </div>

    </div>
</div>

<!-- Language Switcher -->
<div id="language-switcher" class="language-switcher">
    <span class="language-switcher-icon">EN</span>
</div>

</body>
</html>
