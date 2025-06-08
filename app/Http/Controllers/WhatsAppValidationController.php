<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WhatsAppValidationController extends Controller
{
    public function validateNumber(Request $request)
    {
        $whatsappNumber = $request->input('whatsapp_number');

        if (!$whatsappNumber) {
            return response()->json(['error' => 'WhatsApp number is required'], 400);
        }

        try {
            $response = Http::withHeaders([
                "Content-Type" => "application/json",
                "x-rapidapi-host" => "whatsapp-number-validator3.p.rapidapi.com",
                "x-rapidapi-key" => "99628e025bmsh643b23eb8124632p12d122jsncf7e69929dcb"
            ])->post("https://whatsapp-number-validator3.p.rapidapi.com/WhatsappNumberHasItWithToken", [
                'phone_number' => $whatsappNumber
            ]);

            if ($response->failed()) {
                return response()->json(['error' => 'Failed to validate WhatsApp number'], 500);
            }

            return response()->json($response->json(), $response->status());

        } catch (\Exception $e) {
            return response()->json(['error' => 'Server error: ' . $e->getMessage()], 500);
        }
    }
}