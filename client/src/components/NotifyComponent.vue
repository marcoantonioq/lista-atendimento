<template>
  <q-btn
    v-if="!notificationPermissionGranted"
    @click="askForNotificationPermission"
    class="notification-button"
  >
    <q-icon name="notifications" />
  </q-btn>
</template>

<script>
export default {
  data() {
    return {
      notificationPermissionGranted: false,
      shouldShowButton: false,
    };
  },
  mounted() {
    this.checkNotificationSupport();
    this.askForNotificationPermission();
  },
  methods: {
    checkNotificationSupport() {
      if (Notification.permission === 'granted') {
        this.notificationPermissionGranted = true;
      } else if (Notification.permission !== 'denied') {
        this.shouldShowButton = true;
      }
    },
    askForNotificationPermission() {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          this.notificationPermissionGranted = true;
          const notification = new Notification('Lista de Atendimento', {
            body: 'Corpo da Notificação',
            icon: 'icons/icon-512x512.png',
            badge: 'icons/icon-512x512.png',
            vibrate: true,
          });

          notification.onclick = function () {
            console.log('Notificação clicada!');
          };
        }
      });
    },
  },
};
</script>

<style scoped>
.notification-button {
  position: fixed;
  top: 40px;
  right: 20px;
}
</style>
