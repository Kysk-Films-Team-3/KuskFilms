<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>KYSKFilms - Забули пароль?</title>
    <link rel="stylesheet" href="${url.resourcesPath}/css/forgot.css">
    <script src="${url.resourcesPath}/js/forgot.js" defer></script>
</head>
<body class="forgot-page">
<div class="forgot_page">
    <div class="forgot_layout">
        <div class="forgot_title">Скинути пароль</div>
        <div class="forgot_subtitle">
            Введіть свою адресу електронної пошти або номер телефону, який ви використовуєте для свого облікового запису, щоб продовжити. Ми надішлемо вам код підтвердження для скидання пароля.
        </div>

        <form class="forgot_form" id="forgotForm" method="post" action="${url.loginAction}">
            <input type="hidden" id="execution" name="execution" value="${(execution)!}"/>
            <input type="hidden" id="client_id" name="client_id" value="${(client_id)!}"/>
            <input type="hidden" id="tab_id" name="tab_id" value="${(tab_id)!}"/>
            
            <div class="forgot_input_group">
                <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder=" "
                        class="forgot_input"
                        value="${(username)!}"
                        autocomplete="username"
                />
                <label for="username">Адреса електронної пошти або мобільний телефон</label>
                <#if message?has_content>
                    <div class="forgot_error_text" id="server-error" style="display: flex;">
                        <div class="forgot_error_icon"></div>
                        <span id="server-error-text">${message.summary}</span>
                    </div>
                    <div class="forgot_error_text" id="username-client-error" style="display:none;">
                        <div class="forgot_error_icon"></div>
                        <span id="username-client-text"></span>
                    </div>
                <#else>
                    <div class="forgot_error_text" id="server-error" style="display:none;">
                        <div class="forgot_error_icon"></div>
                        <span id="server-error-text"></span>
                    </div>
                    <div class="forgot_error_text" id="username-client-error" style="display:none;">
                        <div class="forgot_error_icon"></div>
                        <span id="username-client-text"></span>
                    </div>
                </#if>
            </div>

            <div class="forgot_block">
                <button type="submit" class="forgot_button disabled" id="forgotBtn">Продовжити</button>
            </div>
        </form>

    </div>
</div>
</body>
</html>
