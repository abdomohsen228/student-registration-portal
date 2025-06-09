<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewUserRegistered extends Mailable
{
    use Queueable, SerializesModels;

    public $user; // pass user to the view

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function build()
    {
        return $this->subject('New User Registration')
                    ->view('emails/new_user_registered');
    }
}