import { boot } from 'quasar/wrappers';
import { initializeApp } from 'firebase/app';
import { Analytics, getAnalytics } from 'firebase/analytics';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $analytics: Analytics;
  }
}

export default boot(({ app }) => {
  const firebaseConfig = {
    apiKey: 'AIzaSyDjh-kSamZSSOA1pEwMuCB1HZxiZBgCaVE',
    authDomain: 'agenda-408113.firebaseapp.com',
    projectId: 'agenda-408113',
    storageBucket: 'agenda-408113.appspot.com',
    messagingSenderId: '865568496873',
    appId: '1:865568496873:web:66e24b202af5ba7f1b6478',
    measurementId: 'G-KDP8RZ0Z19',
  };
  const config = initializeApp(firebaseConfig);
  app.config.globalProperties.$analytics = getAnalytics(config);
  console.log(app.config.globalProperties.$analytics, '...dados analytics!');
});
