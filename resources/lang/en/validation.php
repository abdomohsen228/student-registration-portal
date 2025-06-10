<?php
return [
    'required' => 'This field is required.',
    'email' => 'The :attribute must be a valid email address.',
    'max' => [
        'string' => 'The :attribute may not be greater than :max characters.',
    ],
    'min' => [
        'string' => 'The :attribute must be at least :min characters.',
    ],
    'unique' => 'The :attribute has already been taken.',
    'regex' => [
        'full_name' => 'Only letters, spaces, hyphens, and apostrophes are allowed.',
        'user_name' => 'Only letters, numbers, underscores, and hyphens are allowed.',
        'phone' => 'Only numbers are allowed.',
        'whatsapp_number' => 'Only numbers are allowed.',
        'password' => 'Password must contain at least one number and one special character.',
    ],
    'image' => 'The :attribute must be an image.',
    'mimes' => 'The :attribute must be a file of type: :values.',
    'confirmed' => 'The :attribute confirmation does not match.',
    'attributes' => [
        'full_name' => 'full name',
        'user_name' => 'username',
        'email' => 'email',
        'address' => 'address',
        'password' => 'password',
        'phone' => 'phone',
        'whatsapp_number' => 'WhatsApp number',
        'user_image' => 'user image',
    ],
    'check_username_error' => 'Could not verify username availability'
];
