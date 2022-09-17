<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSurveyRequest;
use App\Http\Requests\UpdateSurveyRequest;
use App\Http\Resources\SurveyResource;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use App\Models\Survey;
use App\Models\SurveyQuestion;
use Illuminate\Support\Arr;

class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = request()->user();

        return SurveyResource::collection(Survey::where('user_id', $user->id)->paginate(5));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreSurveyRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreSurveyRequest $request)
    {
        $validated = $request->validated();

        // check if we have image
        if(isset($validated['image'])) {
            $imagePath = $this->saveEncodedImage($validated['image']);
            $validated['image'] = $imagePath;
        }

        $survey = Survey::create($validated);

        foreach(request('questions') as $question) {
            $question['survey_id'] = $survey->id;

            $this->createQuestion($question);
        }

        return new SurveyResource($survey);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Survey  $survey
     * @return \Illuminate\Http\Response
     */
    public function show(Survey $survey)
    {
        $user = request()->user();

        if($user->id !== $survey->user_id) {
            return abort(403, 'Unauthorized action!');
        }

        return new SurveyResource($survey);
    }

    public function viewSlug(Survey $survey)
    {
        return new SurveyResource($survey);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateSurveyRequest  $request
     * @param  \App\Models\Survey  $survey
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateSurveyRequest $request, Survey $survey)
    {
        $validated = $request->validated();

        // only allow image that is of base64 format - this is for case when it's an actualy image url and not encoded blob
        if(isset($validated['image']) && preg_match('/^data:image/', $validated['image'])) {

            $imagePath = $this->saveEncodedImage($validated['image']);
            $validated['image'] = $imagePath;

            if($survey->image) {
                File::delete(public_path($survey->image));
            }
        }

        $survey->update($validated);

        // get ids as plain array of existing questions
        $existingIds = $survey->questions()->pluck('id')->toArray();

        // get ids as plain array of new question
        $newIds = Arr::pluck(request('questions'), 'id');

        // find questions to delete
        $toDelete = array_diff($existingIds, $newIds);

        // find questions to add
        $toAdd = array_diff($newIds, $existingIds);

        // delete questions by ids
        SurveyQuestion::destroy($toDelete);

        // Create new questions
        foreach(request('questions') as $question) {
            if(in_array($question['id'], $toAdd)) {
                $question['survey_id'] = $survey->id;
                $this->createQuestion($question);
            }
        }

        // update existing questions
        $questionMap = collect(request('questions'))->keyBy('id');
        foreach($survey->questions as $question) {
            if(isset($questionMap[$question->id])) {
                $this->updateQuestion($question, $questionMap[$question->id]);
            }
        }

        return new SurveyResource($survey);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Survey  $survey
     * @return \Illuminate\Http\Response
     */
    public function destroy(Survey $survey)
    {
        $user = request()->user();

        if($user->id !== $survey->user_id) {
            return abort(403, 'Unauthorized action!');
        }

        // delete file
        if($survey->image) {
            File::delete(public_path($survey->image));
        }

        $survey->delete();
        return response()->json('', 204);
    }

    private function createQuestion($question)
    {
        if(is_array($question['data'])) {
            $question['data'] = json_encode($question['data']);
        }

        // validate input
        $validQuestion = validator($question, [
            'question' => ['required', 'string'],
            'type' => ['required', Rule::in([
                SurveyQuestion::TYPE_TEXTINPUT,
                SurveyQuestion::TYPE_TEXTAREA,
                SurveyQuestion::TYPE_SELECT,
                SurveyQuestion::TYPE_RADIO,
                SurveyQuestion::TYPE_CHECKBOX
            ])],
            'description' => ['nullable', 'string'],
            'data' => ['present'],
            'survey_id' => Rule::exists('surveys', 'id')
        ])->validated();

        return SurveyQuestion::create($validQuestion);
    }

    private function updateQuestion(SurveyQuestion $question, $data)
    {
        if(isset($data['data']) && is_array($data['data'])) {
            $data['data'] = json_encode($data['data']);
        }

        // validate input
        $validQuestion = validator($data, [
            'question' => ['required', 'string'],
            'type' => ['required', Rule::in([
                SurveyQuestion::TYPE_TEXTINPUT,
                SurveyQuestion::TYPE_TEXTAREA,
                SurveyQuestion::TYPE_SELECT,
                SurveyQuestion::TYPE_RADIO,
                SurveyQuestion::TYPE_CHECKBOX
            ])],
            'description' => ['nullable', 'string'],
            'data' => ['present'],
        ])->validated();

        return $question->update($validQuestion);
    }

    private function saveEncodedImage($imageStr)
    {
        $imagePath = null;

        // check if image is valid base64 string - data:image/png;base64,AAA
        if(preg_match('/^data:image\/(\w+);base64,/', $imageStr, $type)) {

            // get the base64 encoded image part
            $imageStr = substr($imageStr, strpos($imageStr, ',')+1);

            // get file extension from preg_match capture group (\w)
            if(!in_array(strtolower($type[1]), ['jpg', 'jpeg', 'gif', 'png'])) {
                throw new \Exception('invalid image type');
            }

            // convert encoded image to binary image
            $image = base64_decode(str_replace(' ', '+', $imageStr));

            if(!$image) {
                throw new \Exception('decoding image failed');
            }

            $dir = 'images/';
            $file = Str::random() . '.' . $type[1];
            $absolutePath = public_path($dir);
            $imagePath = $dir . $file;

            if(!File::exists($absolutePath)) {
                File::makeDirectory($absolutePath, 0755, true);
            }

            file_put_contents($imagePath, $image);
        } else {
            throw new \Exception('Invalid image');
        }

        return $imagePath;
    }
}
