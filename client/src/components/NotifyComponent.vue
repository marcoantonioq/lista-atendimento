<template>
  <q-page>
    <q-btn @click="askForNotificationPermission" class="notification-button">
      <q-icon name="notifications" />
    </q-btn>
  </q-page>
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
          const notification = new Notification('Hi there!');
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
