<?php

namespace Database\Factories;

use App\Models\Survey;
use Illuminate\Database\Eloquent\Factories\Factory;
use Symfony\Component\Console\Question\Question;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SurveyQuestion>
 */
class SurveyQuestionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'survey_id' => Survey::factory(),
            'type' => fake()->randomElement(['one', 'two']),
            'question' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'data' => fake()->text()
        ];
    }
}
