import { createStore } from 'vuex';
import api from '../apis';

const store = createStore({
  state: {
    user: {
      data: {},
      token: sessionStorage.getItem('_tok')
    }
  },
  getters: {

  },
  mutations: {
    logout: (state) => {
      state.user.data = {};
      state.user.token = null;
      sessionStorage.removeItem('_tok');
    },
    setUser: (state, payload) => {
      state.user.data = payload.user,
      state.user.token = payload.token

      sessionStorage.setItem('_tok', payload.token);
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
    }
  },
  modules: {}
});

export default store;
