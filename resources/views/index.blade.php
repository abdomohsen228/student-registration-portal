<?php
session_start();  // Start the session before accessing session variables
$errors = $_SESSION['errors'] ?? [];
unset($_SESSION['errors']); // Clear errors after retrieving them
?>
@include('components/header')
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" class="html-body">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    @vite(['resources/css/style.css', 'resources/css/header.css', 'resources/css/footer.css'])
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>


<body class="Form-body" dir="ltr">

    <div class="container" dir="ltr">

        <!-- Display Success or Error Messages -->
        @if (session('success'))
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
        @endif
        @if (session('error'))
        <div class="alert alert-error">
            {{ session('error') }}
        </div>
        @endif

        <h1 data-translate="register">{{ __('messages.register') }}</h1>

        <form id="registrationForm" action="{{ route('register') }}" method="POST" enctype="multipart/form-data">
            <!--___________________________FULLNAME/USERNAME____________________________________________________-->
            {{-- @csrf --}}
            <div class="input-box" dir="{{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}">
                <div class="box" dir="{{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}">
                    <input type="text" id="F_name" name="full_name" autofocus required>
                    <span class="error" id="full_name_error"><?php echo $errors['full_name'] ?? '' ?></span>
                    <label for="name" data-translate="fullName">{{ __('messages.fullName') }}</label>
                    <i class="fa fa-user icon"></i>

                </div>

                <div class="box" dir="{{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}">
                    <input type="text" id="user_name" name="user_name" autofocus required>
                    <span class="error" id="user_name_error"><?php echo $errors['user_name'] ?? '' ?></span>
                    <span class="error" id="user_name_ajax_error"></span> <!-- For AJAX validation -->
                    <label for="user_name" data-translate="username">{{ __('messages.username') }}</label>
                    <i class="fa fa-user icon"></i>
                </div>
            </div>


            <!--_______________________________EMAIL/ADDRESS______________________________________________________-->
            <div class="input-box" dir="{{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}">
                <div class="box" dir="{{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}">
                    <input type="email" id="email" name="email" autofocus required>
                    <span class="error" id="email-status"><?php echo $errors['email'] ?? '' ?></span>
                    <label for="email" data-translate="email">{{ __('messages.email') }}</label>
                    <i class="fa fa-envelope icon"></i>
                </div>

                <div class="box" dir="{{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}">
                    <input type="text" id="address" name="address" autofocus required>
                    <span class="error" id="address_error"></span>
                    <label for="address" data-translate="address">{{ __('messages.address') }}</label>
                    <i class="fa fa-home"></i>
                </div>
            </div>

            <!--_______________________________PASSWORD/CONFIRM______________________________________________________-->
            <div class="input-box" dir="{{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}">
                <div class="box">
                    <input type="password" id="password" name="password" autofocus required>
                    <span class="error" id="password_error"><?php echo $errors['password'] ?? '' ?></span>
                    <label for="password" data-translate="password">{{ __('messages.password') }}</label>
                    <i class="fa fa-lock"></i>
                </div>

                <div class="box">
                    <input type="password" id="confirm_password" name="confirm_password" autofocus required>
                    <span class="error" id="confirm_password_error"><?php echo $errors['confirm_password'] ?? '' ?></span>
                    <label for="confirm_password" data-translate="confirmPassword">{{ __('messages.confirmPassword') }}</label>
                    <i class="fa fa-lock"></i>
                </div>
            </div>

            <!--_______________________________PHONE/WHATSAPP______________________________________________________-->
            <div class="input-box" dir="{{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}">
                <div class="box">
                    <input type="tel" id="phone" name="phone" autofocus required>
                    <span class="error" id="phone_error"><?php echo $errors['phone'] ?? '' ?></span>
                    <label for="phone" data-translate="phone">{{ __('messages.phone') }}</label>
                    <i class="fa fa-phone"></i>
                </div>

                <div class="box">
                    <input type="tel" id="whatsapp_number" name="whatsapp_number" autofocus required>
                    <span class="error" id="whatsapp_error"><?php echo $errors['whatsapp_number'] ?? '' ?></span>
                    <span class="error" id="whatsapp_error"></span>
                    <label for="whatsapp_number" data-translate="whatsApp">{{ __('messages.whatsApp') }}</label>
                    <i class="fa fa-whatsapp"></i>


                </div>
            </div>

            <!--________________________________BUTTONS/IMAGE________________________________________________-->
            <div class="links">
                <button type="button" id="validate-whatsapp" data-translate="validate">{{ __('messages.validate') }}</button>
                <p id="validation-result"></p> <!--the validation message-->

            </div>


            <div class="input-box" dir="{{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}">
                <div class="file-upload">
                    <label for="user_image" data-translate="uploadImage">{{ __('messages.uploadImage') }}</label>
                    <input type="file" id="user_image" name="user_image" accept="image/*" required>
                    <span class="error" id="user_image_error"><?php echo $errors['user_image'] ?? '' ?></span>
                </div>

                <div class="image-preview">
                    <img id="preview" src="#" alt="Image Preview" style="display:none; width:100px; margin-top:10px;">
                </div>

                <div class="box1">
                    <button data-translate="confirm" class="confirm-btn">{{ __('messages.confirm') }}</button>
                </div>
            </div>

            @csrf

        </form>
    </div>
    <button id="lang-button" class="lang-button" onclick="switchLang()">AR</button>
</body>
<script>
    window.translations = {
        en: @json(trans('messages', [], 'en')),
        ar: @json(trans('messages', [], 'ar'))
    };
    window.validationMessages = {
        en: @json(trans('validation', [], 'en')),
        ar: @json(trans('validation', [], 'ar'))
    };
    console.log('Translations:', window.translations); // Debugging
</script>
@vite(['resources/js/WA_Number.js', 'resources/js/validation.js', 'resources/js/ajax.js', 'resources/js/lang-switch.js'])
<script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
<script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>

</html>
@include('components/footer')