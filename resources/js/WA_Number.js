// document.addEventListener("DOMContentLoaded", function () {
//     document.getElementById("validate-whatsapp").addEventListener("click", function () {
//         let whatsappInput = document.getElementById("whatsapp_number");
//         let whatsappNumber = whatsappInput.value || whatsappInput.getAttribute("value");

//         const validationResult = document.getElementById("validation-result");
//         const whatsappError = document.getElementById("whatsapp_error");

//         // Clear previous messages
//         validationResult.textContent = "";
//         whatsappError.textContent = "";

//         if (!whatsappNumber) {
//             whatsappError.textContent = "WhatsApp number is required.";
//             return;
//         }

//         if (whatsappNumber.startsWith("+")) {
//             whatsappNumber = whatsappNumber.substring(1);
//         }
//         console.log("Validating WhatsApp number:", whatsappNumber);
//         fetch("/api/validate-whatsapp", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content
//             },
//             body: JSON.stringify({ whatsapp_number: whatsappNumber })
//         })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 if (!data) {
//                     throw new Error("Empty response from server");
//                 }
//                 console.log("API response:", data);

//                 if (!data || typeof data.status === "undefined") {
//                     validationResult.textContent = "⚠️ API did not respond properly.";
//                     validationResult.style.color = "orange";
//                     return;
//                 }
//                 if (data.status === "valid") {
//                     validationResult.textContent = "✅ WhatsApp number is valid.";
//                     validationResult.style.color = "green";
//                 } else {
//                     validationResult.innerHTML = "❌ WhatsApp number is invalid.<br>The country and area code should be provided along with the number (e.g., 20XXXXXXXXXX for Egyptian Numbers)";
//                     validationResult.style.color = "red";
//                 }
//             })
//             .catch(error => {
//                 console.error("Error validating WhatsApp number:", error);
//                 validationResult.textContent = "Error validating number. Please try again.";
//                 validationResult.style.color = "red";
//             });
//     });
// });

document.getElementById("validate-whatsapp").addEventListener("click", async function() {
    const validateBtn = this;
    const whatsappInput = document.getElementById("whatsapp_number");
    const validationResult = document.getElementById("validation-result");
    const whatsappError = document.getElementById("whatsapp_error");
    
    // Clear previous messages and set loading state
    validationResult.textContent = "";
    whatsappError.textContent = "";
    validateBtn.disabled = true;
    validateBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Validating';

    try {
        let whatsappNumber = whatsappInput.value || whatsappInput.getAttribute("value"); //34an el input type=tel msh text f I have to getattribute to remove the '+' if existing        
        if (!whatsappNumber) {
            throw new Error("WhatsApp number is required");
        }

        if (!/^[0-9]{10,15}$/.test(whatsappNumber)) {
            throw new Error("Please enter 10-15 digits only");
        }

        const response = await fetch("/api/validate-whatsapp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
                "Accept": "application/json"
            },
            body: JSON.stringify({ whatsapp_number: whatsappNumber })
        }).then(response => response.json())
        .then(data => {
            if (!data || typeof data.status === "undefined") {
                validationResult.textContent = "⚠️ API did not respond properly.";
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

        // const data = await response.json();
        // console.log("API response:", data);
        // console.log("Response status:", response.status);
//         // if (!response.ok) {
//         //     throw new Error(data.message || "Validation failed");
//         // }

        // if (data.valid) {
        //     validationResult.innerHTML = "✅ Valid WhatsApp number";
        //     validationResult.style.color = "green";
        // } else {
        //     throw new Error(data.api_response?.message || "Invalid WhatsApp number");
        // }

//         if (!data || typeof data.status === "undefined") {
//             validationResult.textContent = "⚠️ API did not respond properly.";
//             validationResult.style.color = "orange";
//             return;
//         }
//         if (data.status === "valid") {
//             validationResult.textContent = "✅ WhatsApp number is valid.";
//             validationResult.style.color = "green";
//         } else {
//             validationResult.innerHTML = "❌ WhatsApp number is invalid"
// .then(response => response.json())
//     .then(data => {
//         if (!data || typeof data.status === "undefined") {
//             validationResult.textContent = "⚠️ API did not respond properly.";
//             validationResult.style.color = "orange";
//             return;
//         }
//         if (data.status === "valid") {
//             validationResult.textContent = "✅ WhatsApp number is valid.";
//             validationResult.style.color = "green";
//         }else {
//                 throw new Error(data.api_response?.message || "Invalid WhatsApp number");
//             }})
//     }
 } catch (error) {
        console.error("Validation error:", error);
        validationResult.innerHTML = `❌ ${error.message}`;
        validationResult.style.color = "red";
        
        // Special handling for API key errors
        if (error.message.includes('API key')) {
            validationResult.innerHTML += '<br>Please contact site administrator';
        }
    } finally {
        validateBtn.disabled = false;
        validateBtn.textContent = "Validate";
    }
});