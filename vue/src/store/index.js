import { createStore } from 'vuex';
import api from '../apis';

const store = createStore({
  state: {
    user: {
      data: sessionStorage.getItem('_user'),
      token: sessionStorage.getItem('_tok')
    },
    surveys: {
      loading: false,
      data: [],
      links: []
    },
    dashboard: {
      loading: false,
      data: {}
    },
    currentSurvey: {
      data: {},
      loading: false,
    },
    questionTypes: ['text', 'select', 'radio', 'checkbox', 'textarea'],
    notification: {
      show: false,
      type: null,
      message: null
    }
  },
  getters: {

  },
  mutations: {
    notify: (state, { message, type }) => {
      state.notification.show = true;
      state.notification.type = type;
      state.notification.message = message;

      setTimeout(() => {
        state.notification.show = false;
      }, 3000);
    },
    logout: (state) => {
      state.user.data = {};
      state.user.token = null;
      sessionStorage.removeItem('_user')
      sessionStorage.removeItem('_tok');
    },
    setUser: (state, payload) => {
      state.user.data = payload.user,
      state.user.token = payload.token

      sessionStorage.setItem('_user', payload.user);
      sessionStorage.setItem('_tok', payload.token);
    },
    saveSurvey: (state, survey) => {
      state.surveys.data = [...state.surveys, survey];
    },
    updateSurvey: (state, survey) => {
      state.surveys.data = state.surveys.data.map(item => {
        return item.id === survey.id? survey: item;
      });
    },
    deleteSurvey: (state, id) => {
      state.surveys.data = state.surveys.data.filter(survey => {
        return survey.id !== id;
      });
    },
    setSurveysLoading: (state, status) => {
      state.surveys.data.loading = status;
    },
    setSurveys: (state, surveys) => {
      state.surveys.data = surveys.data;
      state.surveys.links = surveys.meta.links; // pagination links
    },
    setCurrentSurveyLoading: (state, loading) => {
      state.currentSurvey.loading = loading;
    },
    setCurrentSurvey: (state, survey) => {
      state.currentSurvey.data = survey.data;
    },
    dashboardLoading: (state, loading) => {
      state.dashboard.loading = loading;
    },
    setDashboardData: (state, data) => {
      state.dashboard.data = data;
    }
  },
  actions: {
    register: async ({ commit }, user) => {
      const { data } = await api.post('/register', user);

      commit('setUser', data);
      return data;
    },
    login: async ({ commit }, user) => {
      const { data } = await api.post('/login', user);

      commit('setUser', data);
      return data;
    },
    logout: async ({ commit, state }) => {
      const { data } = await api.post('/logout', null, {
        headers: {
          Authorization: `Bearer ${state.user.token}`
        }
      });

      commit('logout');
      return data;
    },
    saveSurvey: async ({ commit, state }, survey) => {
      delete survey.image_url;

      if(survey.id) {
        const { data } = await api.put(`/survey/${survey.id}`, survey, {
          headers: {
            Authorization: `Bearer ${state.user.token}`
          }
        });

        commit('updateSurvey', data.data);
        return data.data;
      } else {
        const { data } = await api.post(`/survey`, survey, {
          headers: {
            Authorization: `Bearer ${state.user.token}`
          }
        });

        commit('updateSurvey', data.data);
        return data.data;
      }
    },
    deleteSurvey: async ({ commit, state }, id) => {
      // send ajax request - once deleted
      const response = await api.delete(`/survey/${id}`, {
        headers: {
          Authorization: `Bearer ${state.user.token}`,
        }
      });

      // reduce the state
      if(response.status === 204) commit('deleteSurvey', id);

      // return to caller
      return response.status;
    },
    getSurveys: async ({ commit, state }, { url = null } = {}) => {
      // show loading spinner
      commit('setSurveysLoading', true);

      url = url || '/survey';
      const { data } = await api.get(url, {
        headers: {
          Authorization: `Bearer ${state.user.token}`
        }
      });

      // stop loading spinner
      commit('setSurveysLoading', false);

      commit('setSurveys', data);
      return data;
    },
    getSurveyBySlug: async ({ commit }, slug) => {
      commit('setCurrentSurveyLoading', true);

      try{
        const res = await api.get(`/survey-by-slug/${slug}`);

        if(res) {
          commit('setCurrentSurvey', res.data);
          commit('setCurrentSurveyLoading', false);
        }
      } catch (err) {
        commit('setCurrentSurveyLoading', false);
        throw err;
      }
    },
    getSurveyById: async ({ commit, state }, id) => {
      commit('setCurrentSurveyLoading', true);

      const response = await api.get(`/survey/${id}`, {
        headers: {
          Authorization: `Bearer ${state.user.token}`,
        }
      });

      commit('setCurrentSurveyLoading', false);

      // reduce the state
      if(response.status === 200) commit('setCurrentSurvey', response.data);

      // return to caller
      return {status: response.status, survey: response.data};
    },
    saveSurveyAnswer: async ({ commit }, { surveyId, answers }) => {
      return await api.post(`/survey/${surveyId}/answer`, { answers });
    },
    getDashboardData: async ({ commit, state }) => {
      commit('dashboardLoading', true);
      try {
        const response = await api.get(`/dashboard`, {
          headers: {
            Authorization: `Bearer ${state.user.token}`,
          }
        });

        commit('dashboardLoading', false);
        commit('setDashboardData', response.data);

        return response;
      } catch (err) {
        commit('dashboardLoading', false);
      }
    }
  },
  modules: {}
});

export default store;
