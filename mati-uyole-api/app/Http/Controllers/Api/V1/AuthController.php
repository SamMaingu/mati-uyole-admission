<?php

namespace App\Http\Controllers\Api\V1;

use App\Contracts\SmsServiceContract;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request, SmsServiceContract $sms): JsonResponse
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'regex:/^0\d{9}$|^(\+?255)\d{9}$/'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        $phone = preg_replace('/^\+?255/', '0', $data['phone']);

        $user = User::create([
            'first_name' => $data['first_name'],
            'middle_name' => $data['middle_name'] ?? null,
            'last_name' => $data['last_name'],
            'phone' => $phone,
            'email' => $data['email'] ?? null,
            'password' => $data['password'],
            'role' => User::ROLE_APPLICANT,
            'application_number' => $this->generateApplicationNumber(),
        ]);

        $sms->send($phone, 'account.created', [
            'name' => $user->first_name,
            'application_number' => $user->application_number,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Account created successfully',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'phone' => ['required', 'regex:/^0\d{9}$|^(\+?255)\d{9}$/'],
            'password' => ['required', 'string'],
        ]);

        $phone = preg_replace('/^\+?255/', '0', $data['phone']);

        $user = User::where('phone', $phone)->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'phone' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Welcome back',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    }

    public function requestOtp(Request $request): JsonResponse
    {
        return response()->json(['message' => 'OTP flow is not implemented yet.'], 501);
    }

    public function verifyOtp(Request $request): JsonResponse
    {
        return response()->json(['message' => 'OTP flow is not implemented yet.'], 501);
    }

    private function generateApplicationNumber(): string
    {
        $year = now()->format('Y');
        $sequence = (User::max('id') ?? 0) + 1;

        return 'MATI-'.$year.'-'.str_pad((string) $sequence, 6, '0', STR_PAD_LEFT);
    }
}