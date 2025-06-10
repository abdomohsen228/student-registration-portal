import { AjaxValidator } from './ajax.js';

document.addEventListener("DOMContentLoaded", function () {
    function getValidationMessage(rule, field, params = {}) {
        const locale = localStorage.getItem('locale') || 'en';
        const translations = window.translations?.[locale] || {};
        const validationMessages = window.validationMessages?.[locale] || {};

        let message = validationMessages[rule] || 'Invalid input';
        if (typeof message === 'object') {
            message = message[params.type] || message.string || 'Invalid input';
        }
        if (rule === 'regex') {
            message = validationMessages.regex?.[field] || message;
        }
        message = message.replace(':attribute', translations[field] || field);
        for (const [key, value] of Object.entries(params)) {
            message = message.replace(`:${key}`, value);
        }
        return message;
    }

    const usernameInput = document.getElementById('user_name');
    const errorElement = document.getElementById('user_name_ajax_error');
    let debounceTimer;

    usernameInput.addEventListener('input', async function() {
        const username = this.value.trim();
        const locale = localStorage.getItem('locale') || 'en';
        const translations = window.translations?.[locale] || {};
        
        clearTimeout(debounceTimer);
        
        if (username.length <= 2) {
            errorElement.textContent = '';
            errorElement.style.color = '';
            return;
        }
        errorElement.textContent = translations.checking || 'Checking...';
        errorElement.style.color = 'blue';
        console.log("Checking username availability...");
        debounceTimer = setTimeout(async () => {
            const result = await AjaxValidator.checkUsernameAvailability(username);
            if (result.error) {
                errorElement.textContent = result.error;
                errorElement.style.color = 'red';
            } else if (!result.available) {
                errorElement.textContent = result.message;
                errorElement.style.color = 'red';
            } else {
                errorElement.textContent = translations.username_available || '✓ Available';
                errorElement.style.color = 'green';
            }
        }, 500);
    });

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

        const userNameError = document.getElementById("user_name_ajax_error").textContent;
        const locale = localStorage.getItem('locale') || 'en';
        const translations = window.translations?.[locale] || {};
        if (!userNameError.includes(translations.username_available || 'Available')) {
            isValid = false;
        }

        if (imageInput.files.length === 0) {
            showError(imageInput, getValidationMessage('required', 'user_image'));
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
                showError(imageInput, getValidationMessage('mimes', 'user_image', { values: 'JPEG, PNG, GIF' }));
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
        const fieldName = input.name;

        if (!value && input.required) {
            showError(input, getValidationMessage('required', fieldName));
            return false;
        }

        switch (fieldName) {
            case "full_name":
                const namePattern = /^[a-zA-Z-' ]*$/;
                if (!namePattern.test(value)) {
                    showError(input, getValidationMessage('regex', 'full_name'));
                    isValid = false;
                } else {
                    clearError(input);
                }
                break;

            case "email":
                const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailPattern.test(value)) {
                    showError(input, getValidationMessage('email', 'email'));
                    isValid = false;
                } else {
                    clearError(input);
                }
                break;

            case "password":
                const passwordPattern = /^(?=.*[0-9])(?=.*[\W_]).{8,}$/;
                if (!passwordPattern.test(value)) {
                    showError(input, getValidationMessage('regex', 'password'));
                    isValid = false;
                } else {
                    clearError(input);
                }
                break;

            case "confirm_password":
                const password = document.getElementById("password").value;
                if (value !== password) {
                    showError(input, getValidationMessage('confirmed', 'confirm_password'));
                    isValid = false;
                } else {
                    clearError(input);
                }
                break;

            case "phone":
            case "whatsapp_number":
                const phonePattern = /^[0-9]*$/;
                if (!phonePattern.test(value)) {
                    showError(input, getValidationMessage('regex', fieldName));
                    isValid = false;
                } else if (value.length < 10 || value.length > 20) {
                    showError(input, getValidationMessage('max', fieldName, { max: 20, type: 'string' }));
                    isValid = false;
                } else {
                    clearError(input);
                }
                break;

            case "user_name":
                const usernamePattern = /^[a-zA-Z0-9_-]+$/;
                if (!usernamePattern.test(value)) {
                    showError(input, getValidationMessage('regex', 'user_name'));
                    isValid = false;
                    document.getElementById("user_name_ajax_error").textContent = "";
                } else if (value.length < 3) {
                    showError(input, getValidationMessage('min', 'user_name', { min: 3, type: 'string' }));
                    isValid = false;
                    document.getElementById("user_name_ajax_error").textContent = "";
                } else if (value.length > 20) {
                    showError(input, getValidationMessage('max', 'user_name', { max: 20, type: 'string' }));
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
        const ajaxError = document.getElementById('user_name_ajax_error');
        if (!label) return;

        input.addEventListener('blur', () => {
            if(label!=ajaxError)
            {label.style.top = input.value.trim() !== '' ? '-5px' : '50%';}
        });

        input.addEventListener('focus', () => {
            if(label!=ajaxError)
            {label.style.top = '-5px';}
        });
    }

        // Function to revalidate all inputs and update error messages
    function revalidateAll() {
        inputs.forEach(input => {
            validateInput(input);
        });
        
        const userNameError = document.getElementById("user_name_ajax_error");
        const locale = localStorage.getItem('locale') || 'en';
        const translations = window.translations?.[locale] || {};
        if (userNameError.textContent && !userNameError.textContent.includes(translations.username_available || 'Available')) {
            const username = usernameInput.value.trim();
            if (username.length > 2) {
                userNameError.textContent = translations.checking || 'Checking...';
                userNameError.style.color = 'blue';
                debounceTimer = setTimeout(async () => {
                    const result = await AjaxValidator.checkUsernameAvailability(username);
                    if (result.error) {
                        userNameError.textContent = result.error;
                        userNameError.style.color = 'red';
                    } else if (!result.available) {
                        userNameError.textContent = result.message;
                        userNameError.style.color = 'red';
                    } else {
                        userNameError.textContent = translations.username_available || '✓ Available';
                        userNameError.style.color = 'green';
                    }
                }, 500);
            }
        }
    }

    window.revalidateAll = revalidateAll;
});

$(document).ready(function() {
    $('#registrationForm').on('submit', function(e) {
        e.preventDefault();
        
        // Clear previous error messages
        $('.error').text('');
        
        // Create FormData object to handle file upload
        let formData = new FormData(this);
        
        // Show loading indicator
        Swal.fire({
            title: 'Processing',
            text: 'Please wait...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Submit form via AJAX
        $.ajax({
            url: $(this).attr('action'),
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(response, status, xhr) {
                // First, ensure we're working with the correct response data
                let responseData = response;
                
                // If response is a string, try to extract JSON
                if (typeof response === 'string') {
                    try {
                        // Look for the first { character
                        const jsonStart = response.indexOf('{');
                        if (jsonStart > -1) {
                            responseData = JSON.parse(response.substring(jsonStart));
                        } else {
                            // If no JSON found, treat as error
                            throw new Error('Invalid response format');
                        }
                    } catch (e) {
                        console.error("Failed to parse response:", e, "Original response:", response);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: 'Invalid response from server',
                            confirmButtonText: 'OK'
                        });
                        return;
                    }
                }
            
                // Now handle the parsed response
                if (xhr.status === 201 && responseData.message && 
                    responseData.message.includes('User created successfully')) {
                    console.log("Registration successful:", responseData);
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: responseData.message,
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $('#registrationForm')[0].reset();
                            window.location.href = '/';
                        }
                    });
                } else {
                    console.error("Unexpected response:", responseData);
                    Swal.fire({
                        icon: 'warning',
                        title: 'Attention!',
                        text: responseData.message || 'Registration failed, try another phone number as it might be already registered',
                        confirmButtonText: 'OK'
                    });
                }
            },
            error: function(xhr) {
                let errorMessage = 'Registration failed';
                
                if (xhr.responseJSON) {
                    // if (xhr.responseJSON.message) {
                    //     console.error("Error response1:", xhr.responseJSON.message);
                    //     errorMessage = xhr.responseJSON.message;
                    // } 
                    if (xhr.responseJSON.errors) {
                        console.error("Error response2:", xhr.responseJSON.errors);
                        errorMessage = xhr.responseJSON.errors[Object.keys(xhr.responseJSON.errors)[0]][0];
                    }
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: errorMessage,
                    confirmButtonText: 'OK'
                });

                // Display validation errors if they exist
                if (xhr.status === 422 && xhr.responseJSON.errors) {
                    const errors = xhr.responseJSON.errors;
                    for (const field in errors) {
                        const errorElement = $(`#${field}_error`);
                        if (errorElement.length) {
                            errorElement.text(errors[field][0]);
                        } else {
                            // If no specific field element, show first error in general alert
                            Swal.fire({
                                icon: 'error',
                                title: 'Validation Error',
                                text: errors[field][0],
                                confirmButtonText: 'OK'
                            });
                            break;
                        }
                    }
                }
            }
        });
    });
});