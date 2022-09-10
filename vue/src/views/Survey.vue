<template>
  <DashboardPageComponentVue>
    <template v-slot:header>
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Surveys</h1>

        <router-link :to="{ name: 'SurveyCreate' }" class="py-2 px-3 text-white bg-emerald-500 hover:bg-emerald-600 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 inline-block -mt-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add new survey
        </router-link>
      </div>
    </template>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
      <SurveyListItem @delete="deleteSurvey" v-for="survey in surveys" :key="survey.id" :survey="survey" />
    </div>
  </DashboardPageComponentVue>
</template>

<script setup>
  import { useStore } from 'vuex';
  import { computed } from 'vue';

  import DashboardPageComponentVue from '../components/DashboardPageComponent.vue';
  import SurveyListItem from '../components/SurveyListItem.vue';

  const store = useStore();

  const surveys = computed(() => store.state.surveys.data);

  const deleteSurvey = (survey) => {
    if(confirm(`Are you sure you want to delete this survey?`)) {

      try {
        store.dispatch('deleteSurvey', survey.id)
      } catch (err) {
        // handle error
      }
    }
  }

  store.dispatch('getSurveys');

</script>
