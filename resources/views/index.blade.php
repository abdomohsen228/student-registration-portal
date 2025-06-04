<?php
session_start();  // Start the session before accessing session variables
$errors = $_SESSION['errors'] ?? [];
unset($_SESSION['errors']); // Clear errors after retrieving them
?>
@include('components/header')
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    @vite("resources/css/style.css")
    @vite("resources/css/header.css")
    @vite("resources/css/footer.css")
</head>


<body class="Form-body">

    <div class="container">

        <h1>Register</h1>

        <form id="registrationForm" action="{{ route('register') }}" method="POST" enctype="multipart/form-data">
            <!--___________________________FULLNAME/USERNAME____________________________________________________-->
            <div class="input-box">
                <div class="box">
                    <input type="text" id="F_name" name="full_name" autofocus required>
                    <span class="error" id="full_name_error"><?php echo $errors['full_name'] ?? '' ?></span>
                    <label for="name">Full name</label>
                    <i class="fa fa-user icon"></i>

                </div>

                <div class="box">
                    <input type="text" id="user_name" name="user_name" autofocus required>
                    <span class="error" id="user_name_error"><?php echo $errors['user_name'] ?? '' ?></span>
                    <span class="error" id="user_name_ajax_error"></span> <!-- For AJAX validation -->
                    <label for="user_name">Username</label>
                    <i class="fa fa-user icon"></i>
                </div>
            </div>


            <!--_______________________________EMAIL/ADDRESS______________________________________________________-->
            <div class="input-box">
                <div class="box">
                    <input type="email" id="email" name="email" autofocus required>
                    <span class="error" id="email-status"><?php echo $errors['email'] ?? '' ?></span>
                    <label for="email">Email</label>
                    <i class="fa fa-envelope icon"></i>
                </div>

                <div class="box">
                    <input type="text" id="address" name="address" autofocus required>
                    <span class="error" id="address_error"></span>
                    <label for="address">Address</label>
                    <i class="fa fa-home"></i>
                </div>
            </div>

            <!--_______________________________PASSWORD/CONFIRM______________________________________________________-->
            <div class="input-box">
                <div class="box">
                    <input type="password" id="password" name="password" autofocus required>
                    <span class="error" id="password_error"><?php echo $errors['password'] ?? '' ?></span>
                    <label for="password">Password</label>
                    <i class="fa fa-lock"></i>
                </div>

                <div class="box">
                    <input type="password" id="confirm_password" name="confirm_password" autofocus required>
                    <span class="error" id="confirm_password_error"><?php echo $errors['confirm_password'] ?? '' ?></span>
                    <label for="confirm_password">Confirm Password</label>
                    <i class="fa fa-lock"></i>
                </div>
            </div>

            <!--_______________________________PHONE/WHATSAPP______________________________________________________-->
            <div class="input-box">
                <div class="box">
                    <input type="tel" id="phone" name="phone" autofocus required>
                    <span class="error" id="phone_error"><?php echo $errors['phone'] ?? '' ?></span>
                    <label for="phone">Phone</label>
                    <i class="fa fa-phone"></i>
                </div>

                <div class="box">
                    <input type="tel" id="whatsapp_number" name="whatsapp_number" autofocus required>
                    <span class="error" id="whatsapp_error"><?php echo $errors['whatsapp_number'] ?? '' ?></span>
                    <span class="error" id="whatsapp_error"></span>
                    <label for="whatsapp_number">WhatsApp</label>
                    <i class="fa fa-whatsapp"></i>


                </div>
            </div>

            <!--________________________________BUTTONS/IMAGE________________________________________________-->
            <div class="links">
                <button type="button" id="validate-whatsapp">Validate WhatsApp Number</button>
                <p id="validation-result"></p> <!--the validation message-->

            </div>


            <div class="input-box">
                <div class="file-upload">
                    <label for="user_image">Upload Profile Image</label>
                    <input type="file" id="user_image" name="user_image" accept="image/*" required>
                    <span class="error" id="user_image_error"><?php echo $errors['user_image'] ?? '' ?></span>
                </div>

                <div class="image-preview">
                    <img id="preview" src="#" alt="Image Preview" style="display:none; width:100px; margin-top:10px;">
                </div>

                <div class="box1">
                    <button>Confirm</button>
                </div>
            </div>


        </form>
    </div>
</body>
@vite('js/WA_Number.js')
@vite('js/validation.js')
@vite('js/ajax.js')
<script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
<script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>

</html>
@include('components/footer')