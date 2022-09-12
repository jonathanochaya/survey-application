<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SurveyQuestion extends Model
{
    const TYPE_TEXTINPUT = 'text';
    const TYPE_TEXTAREA = 'textarea';
    const TYPE_SELECT = 'select';
    const TYPE_RADIO = 'radio';
    const TYPE_CHECKBOX = 'checkbox';

    use HasFactory;

    protected $guarded = [];

    public function survey()
    {
        return $this->belongsTo(Survey::class);
    }
}
