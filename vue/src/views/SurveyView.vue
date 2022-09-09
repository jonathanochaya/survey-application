<template>
  <DashboardPageComponent>
    <template v-slot:header>
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ model? model.title: "Create a Survey"}}
        </h1>

        <button class="py-2 px-3 text-white bg-red-500 rounded-md hover:bg-red-600" @click="deleteSurvey" v-if="route.params.id">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 inline-block -mt-1"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clip-rule="evenodd"/>
          </svg>
          Delete Survey
        </button>
      </div>
    </template>

    <form @submit.prevent="saveSurvey" class="animate-fade-in-down">
      <div class="shadow sm:rounded-md sm:overflow-hidden">
        <!-- Survey Fields -->
        <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
          <!-- Image -->
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Image
            </label>

            <div class="mt-1 flex items-center">
              <img v-if="model.image_url" :src="model.image_url" :alt="model.title" class="w-64 h-48 object-cover" />

              <span v-else class="flex items-center justify-center h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-[80%] w-[80%] text-gray-300"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clip-rule="evenodd" />
                </svg>
              </span>

              <button type="button" class="relative overflow-hidden ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <input type="file" @change="onImageChoose"  class="absolute left-0 top-0 right-0 bottom-0 opacity-0 cursor-pointer"/>
                Change
              </button>
            </div>
          </div>
          <!--/ Image -->

          <!-- Title -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" id="title" v-model="model.title" autocomplete="survey_title"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
          </div>
          <!--/ Title -->

          <!-- Description -->
          <div>
            <label for="about" class="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div class="mt-1">
              <textarea id="description" rows="3" v-model="model.description" autocomplete="survey_description"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                placeholder="Describe your survey" />
            </div>
          </div>
          <!-- Description -->

          <!-- Expire Date -->
          <div>
            <label for="expire_date" class="block text-sm font-medium text-gray-700">Expire Date</label>
            <input type="date" id="expire_date" v-model="model.expire_date"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
          </div>
          <!--/ Expire Date -->

          <!-- Status -->
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="status"
                name="status"
                type="checkbox"
                v-model="model.status"
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="status" class="font-medium text-gray-700"
                >Active</label
              >
            </div>
          </div>
          <!--/ Status -->
        </div>
        <!--/ Survey Fields -->

        <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
          <h3 class="text-2xl font-semibold flex items-center justify-between">
            Questions

            <!-- Add new question -->
            <button type="button" @click="addQuestion"
              class="flex items-center text-sm py-1 px-4 rounded-sm text-white bg-gray-600 hover:bg-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clip-rule="evenodd"/>
              </svg>
              Add Question
            </button>
            <!--/ Add new question -->
          </h3>
          <div v-if="!model.questions.length" class="text-center text-gray-600">
            You don't have any questions created
          </div>
          <div v-for="(question, index) in model.questions" :key="question.id">
            <QuestionEditor
              :question="question"
              :index="index"
              @change="questionChange"
              @addQuestion="addQuestion"
              @deleteQuestion="deleteQuestion"/>
          </div>
        </div>

        <div class="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end">
          <!-- <TButton>
            <SaveIcon class="w-5 h-5 mr-2" />
            Save
          </TButton> -->
          <button class="flex gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" />
            </svg>
            Save
          </button>
        </div>
      </div>
    </form>
  </DashboardPageComponent>
</template>

<script setup>

  import { ref } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter, useRoute } from 'vue-router';
  import { v4 as uuidv4 } from 'uuid';

  import DashboardPageComponent from '../components/DashboardPageComponent.vue';
  import QuestionEditor from '../components/QuestionEditor.vue';


  const store = useStore();
  const route = useRoute();
  const router = useRouter();

  const model = ref({
    title: "",
    slug: "",
    status: false,
    description: null,
    image: null,
    image_url: null,
    expire_date: null,
    questions: [],
  });

  // check whether user is updating survey/viewing
  if(route.params.id) {
    const survey = store.state.surveys.find((survey) => {
      return survey.id === parseInt(route.params.id);
    });

    if(survey) model.value = survey;
  }

  // new survey question template
  const addQuestion = (index) => {
    const newQuestion = {
      id: uuidv4(),
      type: 'text',
      question: '',
      description: null,
      data: {},
    }

    model.value.questions.splice(index, 0, newQuestion);
  }

  /* delete question and change question event handlers */
  const deleteQuestion = (question) => {
    model.value.questions = model.value.questions.filter(item => {
      item.id !== question.id
    });
  }

  const questionChange = (question) => {
    model.value.questions = model.value.questions.map(item => {
      return item.id===question.id? {...question}: item
    });
  }

  // handle upload of image and previewing
  const onImageChoose = (ev) => {
    const file = ev.target.files[0];

    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      model.value.image = reader.result;
      model.value.image_url = reader.result;
    }
  }

  // handle saving of survey data to store and api
  const saveSurvey = async () => {
    try {
      const result = await store.dispatch('saveSurvey', model.value);

      if(result) {
        model.value = result;

        router.push({
          name: "SurveyView",
          params: {id: result.id},
        });
      }
    } catch(err) {
      console.log(err.message);
    }
  }

  // delete survey method
  const deleteSurvey = () => {
    if(confirm('Are you sure - you want to delete survey?')) {
      try {
        const response = store.dispatch('deleteSurvey', model.value.id);

        if(response) router.push({ name: 'Surveys' });
      } catch (err) {
        // handle error gracefully
        console.log(err.message);
      }
    }
  }

</script>
