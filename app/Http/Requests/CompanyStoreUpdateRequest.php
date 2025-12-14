<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CompanyStoreUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Set this to true if you want to authorize all users,
        // or add logic to check if the current user has permission (e.g., is an admin).
        return true; 
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            // Moved validation rules from the Controller
            'name' => ['required', 'string'],
            'code' => ['required', 'numeric'],
            // Assuming vatcode is optional if empty/null, but must match the regex if present
            'vatcode' => ['nullable', 'regex:/^(LT(\d{9}|\d{12})|[- ])$/'],
            'street' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'web' => ['nullable', 'url', 'max:255'],
            'bank' => ['nullable', 'string', 'max:255'],
            'bankaccount' => ['nullable', 'string', 'max:255'],
        ];
    }
    
    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.regex' => 'The company name must start with a capital letter and contain only letters.',
            'vatcode.regex' => 'Check VAT code again. Must be a valid LT VAT format (e.g., LT123456789).',
        ];
    }
}