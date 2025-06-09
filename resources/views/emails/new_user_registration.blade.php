<!DOCTYPE html>
<html>
<head>
    <title>New User Registration</title>
</head>
<body>
    <h1>New User Registered</h1>
    <p><strong>Name:</strong> {{ $user->full_name }}</p>
    <p><strong>Email:</strong> {{ $user->email }}</p>
</body>
</html>