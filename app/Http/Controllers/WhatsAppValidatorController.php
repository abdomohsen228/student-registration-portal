<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WhatsAppValidatorController extends Controller
{
    public function validateNumber(Request $request)
    {
            $whatsappNumber = $request->input('whatsapp_number');

        try {
            $response = Http::withHeaders([
                "Content-Type" => "application/json",
                "x-rapidapi-host" => config('services.rapidapi.host'),
                "x-rapidapi-key" => config('services.rapidapi.key')
            ])->post(
                "https://" . config('services.rapidapi.host') . "/WhatsappNumberHasItWithToken",
                ['phone_number' => $whatsappNumber]
            );

            // Check for API-specific errors
            if ($response->json('message') === 'Invalid API key') {
                throw new \Exception('Invalid RapidAPI key - please check configuration');
            }

            return response()->json([
                'valid' => $response->successful() && $response->json('status') === 'valid',
                'api_response' => $response->json()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'WhatsApp validation service unavailable',
                'message' => $e->getMessage()
            ], 503);
        }
    }
}