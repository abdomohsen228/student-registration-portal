// Before submitting the form, check if the username already exists in the database
$(document).ready(function () {
    $("#user_name").on("input", function () {
        let username = $(this).val().trim();

        // Skip AJAX if the username is empty or invalid
        const usernamePattern = /^[a-zA-Z0-9]+$/;
        if (!usernamePattern.test(username) || username.length === 0) {
            // $("#user_name_error").text("").css("color", "");
            $("#user_name_ajax_error").text(""); // Clear AJAX error

            return;
        }
        if (username.length > 0) {
            $.ajax({
                url: "controllers/check_username.php",
                method: "GET",
                data: { q: username },
                success: function (response) {
                    $("#user_name_ajax_error").text(response).css("color", response.includes("exists") ? "red" : "green");
                }
            });
        } else {
            $("#user_name_ajax_error").text("");
        }
    });
});