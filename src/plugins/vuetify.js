import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import ru from 'vuetify/es5/locale/ru';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#2e3e4f',
        secondary: '#5227b4',
        accent: '#cfd108',
        warning: '#fe891f',

        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
      },
    },
  },
  lang: {
    locales: { ru },
    current: 'ru',
  },
  icons: {
    iconfont: 'mdi',
  },
});
