document.addEventListener("DOMContentLoaded", () => {
    const inputs = document.querySelectorAll(".verify_code_input");
    const submitBtn = document.getElementById("submitBtn");
    const errorText = document.getElementById("errorText");
    const resendBtn = document.getElementById("resendBtn");
    const storedEmail = localStorage.getItem("recoveryEmail");
    const subtitle = document.querySelector(".verify_code_subtitle");

    if (storedEmail && subtitle) {
        subtitle.innerHTML = `
            Щоб продовжити, виконайте цей крок підтвердження.Ми надіслали одноразовий пароль на електронну адресу 
            <span class="verify_code_email">${storedEmail}</span>. Будь ласка, введіть його <br> нижче.
        `;
    }

    const correctCode = "12345";

    function getCode() {
        return Array.from(inputs).map(i => i.value).join("");
    }

    function isCodeComplete() {
        const code = getCode();
        return code.length === inputs.length;
    }

    function isCodeValid() {
        return getCode() === correctCode;
    }

    function showError(message) {
        errorText.style.display = "flex";
        const span = errorText.querySelector("span");
        if (span) span.textContent = message;
        inputs.forEach(i => i.classList.add("error"));
    }

    function hideError() {
        errorText.style.display = "none";
        const span = errorText.querySelector("span");
        if (span) span.textContent = "";
        inputs.forEach(i => i.classList.remove("error"));
    }

    function updateButtonState() {
        const allFilled = Array.from(inputs).every(i => i.value.trim() !== "");
        submitBtn.classList.toggle("disabled", !allFilled);
        submitBtn.classList.toggle("valid", allFilled);
        if (errorText.style.display === "flex") hideError();
    }

    inputs.forEach((input, i) => {
        input.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
            if (e.target.value && i < inputs.length - 1) inputs[i + 1].focus();
            updateButtonState();
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && !input.value && i > 0) {
                inputs[i - 1].focus();
            }
        });
    });

    document.getElementById("verify_codeForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const code = getCode();

        if (code.length < 5) {
            showError("Код має містити 5 цифр");
            return;
        }

        if (!isCodeValid()) {
            showError("Введений код недійсний, будь ласка, спробуйте ще раз");
            return;
        }

        hideError();
        window.location.href = "forgot_password.html";
    });

    resendBtn.addEventListener("click", () => {
        inputs.forEach(i => i.value = "");
        inputs[0].focus();
        hideError();
        updateButtonState();
    });

    updateButtonState();
});
