<template>
  <div class="print-hide">
    <q-btn
      v-if="showNotificationButton"
      @click="requestNotificationPermission"
      class="notify"
      key="btn_size_dense_round_sm"
      round
      dense
      color="red"
      size="md"
      icon="notifications"
    />
  </div>
</template>

<script lang="ts" setup>
import { Notify } from 'quasar';
import { ref } from 'vue';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import { getAnalytics } from 'firebase/analytics';

const showNotificationButton = ref(true);

if ('Notification' in window && Notification.permission === 'granted') {
  showNotificationButton.value = false;
  var firebaseConfig = {
    apiKey: 'AIzaSyDjh-kSamZSSOA1pEwMuCB1HZxiZBgCaVE',
    authDomain: 'agenda-408113.firebaseapp.com',
    projectId: 'agenda-408113',
    storageBucket: 'agenda-408113.appspot.com',
    messagingSenderId: '865568496873',
    appId: '1:865568496873:web:66e24b202af5ba7f1b6478',
    measurementId: 'G-KDP8RZ0Z19',
  };

  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);
  getAnalytics(app);

  getToken(messaging, {
    vapidKey:
      'BJt_lJHggy9DmtbU64-umpjs4jgfSZgBG21yBlXHM_rh-71-SAT27MuiWFwuNTivWIwQAHzo-CTYL3xBaCi01Rc',
  }).then((token) => {
    console.log('Token recebido: ', token);
  });
}

const requestNotificationPermission = () => {
  if ('Notification' in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        Notify.create({
          color: 'positive',
          position: 'top',
          message: 'Permissão para notificações concedida!',
        });
        showNotificationButton.value = false;
      } else if (permission === 'denied') {
        Notify.create({
          color: 'negative',
          position: 'top',
          message: 'Permissão para notificações negada!',
        });
      }
    });
  } else {
    Notify.create({
      color: 'negative',
      position: 'top',
      message: 'Seu navegador não suporta notificações!',
    });
  }
};
</script>

<style lang="scss">
.notify {
  position: fixed;
  bottom: 20px;
  right: 60px;
}
</style>
