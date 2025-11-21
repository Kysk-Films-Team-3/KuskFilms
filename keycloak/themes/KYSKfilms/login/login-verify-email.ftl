<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>Підтвердження пошти — KYSKFilms</title>
    <link rel="stylesheet" href="${url.resourcesPath}/css/login.css">
</head>

<body class="login-page">
<div class="login_page">
    <div class="login_layout">

        <div class="login_title">Перевірте вашу пошту</div>

        <p class="login_description" style="margin-top: 16px;">
            На адресу <strong>${user.email!}</strong> надіслано лист із посиланням для підтвердження.
        </p>

        <p class="login_description">
            Якщо лист не прийшов — натисніть кнопку нижче, щоб відправити повторно.
        </p>

        <form method="post" action="${url.loginAction}">
            <input type="hidden" name="resend" value="true">
            <div class="login_block">
                <button type="submit" class="login_button">Надіслати повторно</button>
            </div>
        </form>

        <div class="login_register_block" style="margin-top: 20px;">
            <button type="button" class="login_register_link"
                    onclick="window.location.href='${properties.kcFrontendUrl!'/' }'">
                На головну
            </button>
        </div>

    </div>
</div>
</body>
</html>
