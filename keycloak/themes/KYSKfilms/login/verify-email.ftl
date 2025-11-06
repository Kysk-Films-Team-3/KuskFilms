<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>Підтвердження коду</title>
    <link rel="stylesheet" href="${url.resourcesPath}/css/verify-email.css">
<script src="${url.resourcesPath}/js/verify-email.js" defer></script>
</head>
<body class="confirm_code_page">
<div class="confirm_code_page">
    <div class="confirm_code_layout">
        <div class="confirm_code_title">Перевірте свою поштову скриньку
            або повідомлення</div>
        <div class="confirm_code_subtitle">
            Щоб продовжити, виконайте цей крок підтвердження. Ми надіслали
            одноразовий пароль на електронну адресу <span class="confirm_code_email"></span>. Будь
            ласка, введіть його нижче.
        </div>

        <form class="confirm_code_form" id="codeForm">
            <div class="confirm_code_input_group">
                <input type="text" maxlength="1" class="confirm_code_input" />
                <input type="text" maxlength="1" class="confirm_code_input" />
                <input type="text" maxlength="1" class="confirm_code_input" />
                <input type="text" maxlength="1" class="confirm_code_input" />
                <input type="text" maxlength="1" class="confirm_code_input" />
            </div>

            <div class="send_error_text" id="errorText" style="display:none;">
                <div class="send_error_icon"></div>
                <span id="errorTextContent"></span>
            </div>

            <div class="confirm_code_send_block">
            <button type="submit" class="confirm_code_send_button" id="submitBtn" href="/create_password.html">Продовжити</button>
            </div>
        </form>

        <button class="confirm_code_resend" id="resendBtn">
            <span class="confirm_code_refresh_icon"></span> Надіслати ще раз
        </button>
    </div>
    </div>
</body>
</html>
