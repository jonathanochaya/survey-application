import { createStore } from 'vuex';
import api from '../apis';

const tmpSurveys = [
  {
    id: 100,
    title: 'TheCodeHolic YouTube channel content',
    slug: 'thecodeholic-youtube-channel-content',
    status: 'draft',
    image: '#',
    description: 'My name is zura. <br>I am web developer 9+ years of experience',
    created_at: '2021-12-20 18:00:00',
    updated_at: '2021-12-20 18:00:00',
    expire_date: '2021-12-31 18:00:00',
    questions: [
      {
        id: 1,
        type: 'select',
        question: 'from which country are you?',
        description: null,
        data: {
          options: [
            {
              uuid: '1afbc-24kksksha-ck1li2',
              text: 'USA'
            },
            {
              uuid: '2afbc-27kksksha-ck1li3',
              text: 'Germany'
            },
            {
              uuid: '3afbc-20kksksha-ck1li4',
              text: 'United Kingdom'
            }
          ]
        }
      },
      {
        id: 1,
        type: 'checkbox',
        question: 'which language videos do you want to see on my channel?',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel nobis porro voluptatum, eos placeat tempora, ex accusantium veritatis, impedit optio ipsum dolores tenetur totam amet. Qui nesciunt repellendus dicta beatae.',
        data: {
          options: [
            {
              uuid: '1afbc-24kksksha-ck1li2',
              text: 'JavaScript'
            },
            {
              uuid: '2afbc-27kksksha-ck1li3',
              text: 'HTML + CSS'
            },
            {
              uuid: '3afbc-20kksksha-ck1li4',
              text: 'All of the above'
            },
            {
              uuid: '3afbc-20kksksha-ck1li4',
              text: 'Everything zura thinks will be good'
            }
          ]
        }
      },
    ],
  }
]

const store = createStore({
  state: {
    user: {
      data: {},
      token: sessionStorage.getItem('_tok')
    },
    surveys: [...tmpSurveys],
    questionTypes: ['text', 'select', 'radio', 'checkbox', 'textarea']
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
