import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules';
import initialModules from './initialModules';
import RStore from '../helper/RStore';
import WebClient from '../middleware/WebClient';
import services from '../middleware';
const { UserService } = services;

Vue.use(Vuex);

const initialState = () => ({
  rules: {
    required: v => {
      const value = (typeof v === 'number') ? v.toString() : v;
      return (!!value && !!value.length) || 'Обязательно для заполнения';
    },
    range: ({ min, max }) => {
      return value => {
        if (!Number.isInteger(+value)) return 'Значение должно быть числом';
        if (value < min) return 'Значение должно быть больше ' + min;
        return value <= max || 'Значение не должно превышать ' + max;
      }
    },
    coords: geo => {
      const message = 'Неправильные координаты. Вид координат: 55.751435, 37.620260';
      if (!geo) return message;
      const coords = geo.toString().split(',');

      if (coords.length !== 2) return message;
      if (!coords.every(c => c.toString().trim().length
        && !Number.isNaN(c)
        && Number(c) >= 0)
      ) return message;

      return true;
    },
    email: value => {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(value) || 'Неправильный e-mail.'
    },
    min: type => {
      const message = 'Недостаточно символов';
      switch(type) {
        case 'phone':
          return v => (v + '').length === 18 || message;

        case 'password':
          return v => (v + '').length > 6 || message;

        default: return true;
      };
    },
  },
});

const vuex = new Vuex.Store({
  state: initialState(),
  mutations: {
    UNSET_DATA: state => state = initialState(),
  },

  actions: {
    async logout({ dispatch }) {
      await UserService.logout();
      dispatch('unsetUserData');
    },
    unsetUserData({ commit, dispatch }) {
      Object.keys(modules).forEach(m => {
        commit(`${m}/UNSET_DATA`);
      });
      commit('UNSET_DATA');
      dispatch('saveToLocaleStorage');
      WebClient.logout();
    },
    saveToLocaleStorage(_, data) {
      RStore.initState(data);
    },
  },

  getters: {
    getRules: state => state.rules,
  },
  modules: initialModules(modules),
});

export default vuex;
