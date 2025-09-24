<?php

return [
    'welcome' => 'Welcome to the API!',

    'auth' => [
        'register' => 'Account created successfully.',
        'login' => 'Login successful.',
        'logout' => 'Logged out successfully.',
        'refresh' => 'Token refreshed successfully.',
        'me' => 'User data retrieved successfully.',
        'valid_token' => 'Token is valid.',
        'verification_link_sent' => 'Verification link sent to your email.',
        'email_verified_success' => 'Email verified successfully.',
        'password_reset_sent' => 'Password reset link sent to your email.',
        'password_reset_success' => 'Password reset successfully.',
        'updated_profile' => 'Profile updated successfully.',
        'password_changed' => 'Password changed successfully.',
    ],

    'feedback' => [
        'success' => 'Feedback submitted successfully! Thank you for your contribution.',
        'get_types_success' => 'Feedback types retrieved successfully.',
    ],

    'error' => [
        'user_inactive' => 'User has been deactivated. Please contact a administrator.',
        'permission_denied' => 'Permission denied. You do not have access to this part of the system.',
        'email_not_registered' => 'Email not registered.',
        'too_many_attempts' => 'Too many attempts, please try again later.',
        'credentials_invalid' => 'Invalid credentials. Check your email and password.',
        'token_invalid_or_expired' => 'Token is invalid or expired. Please log in again.',
        'invalid_token' => 'Invalid token provided.',
        'user_not_found' => 'User not found.',
        'email_already_verified' => 'Email is already verified.',
        'verification_link_invalid' => 'Verification link is invalid or expired.',
        'email_verification_error' => 'An error occurred while verifying the email. Please try again later.',
        'password_reset_invalid_token' => 'Invalid or expired password reset token.',
        'error_password_same' => 'New password cannot be the same as the old password.',
    ],
];
