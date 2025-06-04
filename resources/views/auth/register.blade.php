<!DOCTYPE html>
<html>
<head>
    <title>Register</title>
</head>
<body>
    <h2>Register</h2>

    @if ($errors->any())
        <ul style="color:red;">
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    @endif

    <form method="POST" action="{{ route('register') }}" enctype="multipart/form-data">
        @csrf
        <label>Full Name:</label>
        <input type="text" name="full_name" required><br>

        <label>User Name:</label>
        <input type="text" name="user_name" required><br>

        <label>Phone:</label>
        <input type="text" name="phone" required><br>

        <label>WhatsApp Number (optional):</label>
        <input type="text" name="whatsapp_number"><br>

        <label>Address:</label>
        <input type="text" name="address"><br>

        <label>Email:</label>
        <input type="email" name="email" required><br>

        <label>Password:</label>
        <input type="password" name="password" required><br>

        <label>Confirm Password:</label>
        <input type="password" name="password_confirmation" required><br>

        <label>Profile Image:</label>
        <input type="file" name="user_image"><br>

        <button type="submit">Register</button>
    </form>
</body>
</html>
