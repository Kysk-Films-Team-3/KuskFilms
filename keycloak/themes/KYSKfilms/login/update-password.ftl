<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>Новий пароль — KYSKFilms</title>
    <link rel="stylesheet" href="${url.resourcesPath}/css/login.css">
    <script src="${url.resourcesPath}/js/login.js" defer></script>
</head>
<body class="login-page">
<div class="login_page">
    <div class="login_layout">
        <div class="login_title">Встановити новий пароль</div>

        <#if message?has_content>
            <div class="login_error_global">
                <span>${message.summary}</span>
            </div>
        </#if>

        <form id="kc-passwd-update-form" class="login_form" action="${url.loginAction}" method="post">

            <div class="login_input_block">
                <input
                        type="password"
                        id="password-new"
                        name="password-new"
                        placeholder=" "
                        class="login_input"
                        autocomplete="new-password"
                />
                <label for="password-new">Новий пароль</label>
            </div>

            <div class="login_input_block">
                <input
                        type="password"
                        id="password-confirm"
                        name="password-confirm"
                        placeholder=" "
                        class="login_input"
                        autocomplete="new-password"
                />
                <label for="password-confirm">Підтвердіть пароль</label>
            </div>

            <div class="login_block">
                <button type="submit" class="login_button valid">Зберегти</button>
            </div>
        </form>

        <div class="login_back_block">
            <a href="${url.loginUrl}" class="login_register_link">Повернутися до входу</a>
        </div>
    </div>
</div>
</body>
</html>
