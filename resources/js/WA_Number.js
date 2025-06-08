document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("validate-whatsapp").addEventListener("click", function () {
        let whatsappInput = document.getElementById("whatsapp_number");
        let whatsappNumber = whatsappInput.value || whatsappInput.getAttribute("value");

        const validationResult = document.getElementById("validation-result");
        const whatsappError = document.getElementById("whatsapp_error");

        // Clear previous messages
        validationResult.textContent = "";
        whatsappError.textContent = "";

        if (!whatsappNumber) {
            whatsappError.textContent = "WhatsApp number is required.";
            return;
        }

        if (whatsappNumber.startsWith("+")) {
            whatsappNumber = whatsappNumber.substring(1);
        }

        fetch("/validate-whatsapp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ whatsapp_number: whatsappNumber })
        })
            .then(response => response.json())
            .then(data => {
                console.log("API response:", data);

                if (!data || typeof data.status === "undefined") {
                    validationResult.textContent = "⚠ API did not respond properly.";
                    validationResult.style.color = "orange";
                    return;
                }
                if (data.status === "valid") {
                    validationResult.textContent = "✅ WhatsApp number is valid.";
                    validationResult.style.color = "green";
                } else {
                    validationResult.innerHTML = "❌ WhatsApp number is invalid.<br>The country and area code should be provided along with the number (e.g., 20XXXXXXXXXX for Egyptian Numbers)";
                    validationResult.style.color = "red";
                }
            })
            .catch(error => {
                console.error("Error validating WhatsApp number:", error);
                validationResult.textContent = "Error validating number. Please try again.";
                validationResult.style.color = "red";
            });
    });
});