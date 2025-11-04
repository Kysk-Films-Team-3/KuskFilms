document.addEventListener("DOMContentLoaded", () => {
    const inputs = document.querySelectorAll(".confirm_code_input");
    const submitBtn = document.getElementById("submitBtn");
    const errorText = document.getElementById("errorText");
    const errorTextContent = document.getElementById("errorTextContent");
    const resendBtn = document.getElementById("resendBtn");
    const emailSpan = document.querySelector(".confirm_code_email");

    const storedEmail = localStorage.getItem("recoveryEmail");
    if (storedEmail && emailSpan) {
        emailSpan.textContent = storedEmail;
    }

    const correctCode = "12345";

    function getCode() {
        return Array.from(inputs).map(i => i.value).join("");
    }

    function isCodeComplete() {
        return getCode().length === inputs.length;
    }

    function isCodeValid() {
        return isCodeComplete() && getCode() === correctCode;
    }

    function showError(message) {
        errorText.style.display = "flex";
        errorTextContent.textContent = message;
        inputs.forEach(i => i.classList.add("error"));
    }

    function hideError() {
        errorText.style.display = "none";
        errorTextContent.textContent = "";
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

    document.getElementById("codeForm").addEventListener("submit", (e) => {
        e.preventDefault();

        if (!isCodeComplete()) {
            showError("Код має містити 5 цифр");
            return;
        }

        if (!isCodeValid()) {
            showError("Введений код недійсний, будь ласка, спробуйте ще раз");
            return;
        }

        hideError();
        window.location.href = "create_password.html";
    });

    resendBtn.addEventListener("click", () => {
        inputs.forEach(i => i.value = "");
        inputs[0].focus();
        hideError();
        updateButtonState();
    });

    updateButtonState();
});
