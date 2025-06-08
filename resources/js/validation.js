import { AjaxValidator } from './ajax.js';
document.addEventListener("DOMContentLoaded", function () {
    const usernameInput = document.getElementById('user_name');
    const errorElement = document.getElementById('user_name_ajax_error');
    let debounceTimer;

    usernameInput.addEventListener('input', async function() {
        const username = this.value.trim();
        
        clearTimeout(debounceTimer);
        
        // Show loading indicator if needed
        if(username.length <= 2) {
            errorElement.textContent = '';
            errorElement.style.color = '';
            return; // Skip validation if username is empty
        }
        errorElement.textContent = 'Checking...';
        errorElement.style.color = 'blue';
        console.log("Checking username availability...");
        debounceTimer = setTimeout(async () => {
            const result = await AjaxValidator.checkUsernameAvailability(username);
            if (result.error) {
                errorElement.textContent = result.error;
                errorElement.style.color = 'red';
                isValid = false; // Prevent form submission if there's an error
            } else if (!result.available) {
                errorElement.textContent = result.message;
                errorElement.style.color = 'red';
                isValid = false; // Prevent form submission if username is not available
            } else {
                errorElement.textContent = '✓ Available';
                errorElement.style.color = 'green';
            }
        }, 500); // 500ms debounce delay
    });

    // Rest of your validation code...
    const form = document.getElementById("registrationForm");
    const inputs = form.querySelectorAll("input");
    const imageInput = document.getElementById("user_image");
    const preview = document.getElementById("preview");

    inputs.forEach((input) => {
        input.addEventListener("input", function () {
            validateInput(input);
        });

        setupFloatingLabel(input);
    });

    form.addEventListener("submit", function (event) {
        let isValid = true;

        inputs.forEach((input) => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        // Check if username availability error exists
        const userNameError = document.getElementById("user_name_ajax_error").textContent;
        if (!userNameError.includes("Available")) {
            isValid = false;
        }

        if (imageInput.files.length === 0) {
            showError(imageInput, "Profile image is required");
            isValid = false;
        } else {
            clearError(imageInput);
        }

        if (!isValid) {
            event.preventDefault();
            console.log("🚫 Form submission blocked due to validation errors");
        }
    });

    imageInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
            if (!validImageTypes.includes(file.type)) {
                showError(imageInput, "Please upload a valid image (JPEG, PNG, or GIF)");
                preview.style.display = "none";
                return;
            } else {
                clearError(imageInput);
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result;
                preview.style.display = "block";
            };
            reader.readAsDataURL(file);
        } else {
            preview.style.display = "none";
        }
    });

    function validateInput(input) {
        let isValid = true;
        const value = input.value.trim();

        if (!value) {
            requiredAlert(input);
            return false;
        }

        switch (input.id) {
            case "full_name":
            case "F_name":
                const namePattern = /^[a-zA-Z\s]+$/;
                if (!namePattern.test(value)) {
                    showError(input, "Name must contain only letters and spaces");
                    isValid = false;
                } else {
                    clearError(input);
                }
                break;

            case "email":
                const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailPattern.test(value)) {
                    showError(input, "Invalid email format");
                    isValid = false;
                } else {
                    clearError(input);
                }
                break;

            case "password":
                const passwordPattern = /^(?=.*[0-9])(?=.*[\W_]).{8,}$/;
                if (!passwordPattern.test(value)) {
                    showError(input, "Password must be at least 8 characters and include a number and a special character");
                    isValid = false;
                } else {
                    clearError(input);
                }
                break;

            case "confirm_password":
                const password = document.getElementById("password").value;
                if (value !== password) {
                    showError(input, "Passwords do not match");
                    isValid = false;
                } else {
                    clearError(input);
                }
                break;

            case "phone":
            case "whatsapp_number":
                const phonePattern = /^\+?[0-9]{10,20}$/;
                if (!phonePattern.test(value)) {
                    const message = input.id === "phone"
                        ? "Please enter a valid phone number (10-20 digits)"
                        : "Please enter a valid WhatsApp number (10-20 digits)";
                    showError(input, message);
                    isValid = false;
                } else {
                    clearError(input);
                }
                break;

            case "user_name":
                const usernamePattern = /^[a-zA-Z0-9]+$/;
                if (!usernamePattern.test(value)) {
                    showError(input, "Username must contain only letters and numbers (no spaces)");
                    isValid = false;

                    document.getElementById("user_name_ajax_error").textContent = "";

                } else {
                    clearError(input);
                }
                break;

            default:
                clearError(input);
        }

        return isValid;
    }

    function showError(input, message) {
        const errorSpan = input.nextElementSibling;
        const parent = input.parentElement;
        if (!errorSpan) return;
        errorSpan.textContent = message;
        errorSpan.style.color = "red";
        errorSpan.style.display = "block";
        fixSpacing(parent, errorSpan);
    }

    function clearError(input) {
        const errorSpan = input.nextElementSibling;
        const parent = input.parentElement;
        if (!errorSpan) return;
        errorSpan.textContent = "";
        errorSpan.style.display = "none";
        reFixSpacing(parent, errorSpan);
    }

    function requiredAlert(input) {
        showError(input, "This field is required");
    }

    function fixSpacing(parent, error) {
        requestAnimationFrame(() => {
            const height = parseFloat(getComputedStyle(error).height);
            if (parseFloat(getComputedStyle(parent).marginBottom) <= 10) {
                parent.style.marginBottom = `${height}px`;
            }
        });
    }

    function reFixSpacing(parent, error) {
        parent.style.marginBottom = `10px`;
    }

    function setupFloatingLabel(input) {
        const span = input.nextElementSibling;
        const label = span?.nextElementSibling;
        if (!label) return;

        input.addEventListener('blur', () => {
            label.style.top = input.value.trim() !== '' ? '-5px' : '50%';
        });

        input.addEventListener('focus', () => {
            label.style.top = '-5px';
        });
    }
});