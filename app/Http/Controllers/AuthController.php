<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register()
    {
        $attributes = request()->validate([
            'name' => ['required', 'string'],
            'email' => ['required', 'email', Rule::unique('users', 'email')],
            'password' => ['required', 'confirmed', Password::min(6)->mixedCase()->numbers()->symbols()]
        ]);

        $user = User::create($attributes);

        $token = $user->createToken('user_token')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token
        ]);
    }
}
