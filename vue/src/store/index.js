import { createStore } from 'vuex';

const store = createStore({
  state: {
    user: {
      data: {
        name: 'Tom Cook',
        email: 'tom@example.com',
        imageUrl: '../src/assets/photo.avif',
      },
      token: '123'
    }
  },
  getters: {

  },
  mutations: {
    logout: (state) => {
      state.user.data = {};
      state.user.token = null;
    }
  },
  actions: {

  },
  modules: {}
});

export default store;
