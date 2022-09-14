<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSurveyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $survey = $this->route('survey');

        return $this->user()->id === $survey->user_id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'title' => ['required', 'string', 'max:1000'],
            'image' => ['nullable', 'string'],
            'user_id' => ['required', Rule::exists('users', 'id')],
            'status' => ['required', 'boolean'],
            'description' => ['nullable', 'string'],
            'expire_date' => ['nullable', 'date', 'after:tomorrow'],
        ];
    }

    public function prepareForValidation()
    {
        $this->merge([
            'user_id' => $this->user()->id
        ]);
    }
}
