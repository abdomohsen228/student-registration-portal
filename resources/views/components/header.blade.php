<html lang="{{ app()->getLocale() }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- <link rel="stylesheet" href="../assets/CSS/header.css"> -->
</head>

<body>
    <nav class="Header">
        <div class="main_link_div">
            <a href="/" class="main_link">URegister</a>
        </div>
        <div class="secondary_links_div">
            <a href="#" class="Header_link" data-translate="home">{{ __('messages.home') }}</a>
            <a href="#" class="Header_link" data-translate="form">{{ __('messages.form') }}</a>
            <a href="#" class="Header_link" data-translate="login">{{ __('messages.login') }}</a>
            <a href="#" class="Header_link" data-translate="sign">{{ __('messages.sign') }}</a>
        </div>

    </nav>
</body>

</html>