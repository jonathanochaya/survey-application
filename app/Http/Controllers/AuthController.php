<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Arr;
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
        ], 201);
    }

    public function login()
    {
        $attributes = request()->validate([
            'email' => ['required', 'email', Rule::exists('users', 'email')],
            'password' => 'required',
            'remember' => 'boolean'
        ]);

        $remember = $attributes['remember'];
        $credentials = Arr::except($attributes, ['remember']);

        if(!auth()->attempt($credentials, $remember)) {
            return response([
                'error' => 'The provided credentials are incorrect.'
            ], 422);
        }

        $user = auth()->user();
        $token = $user->createToken('user_token')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token
        ], 200);
    }

    public function logout()
    {
        auth()->user()->tokens()->delete();
        auth()->guard('web')->logout();

        return response([
            'success' => true
        ], 200);
    }
}
