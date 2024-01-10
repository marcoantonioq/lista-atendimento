<template>
  <div class="header">
    <h1><b>CONGREGAÇÃO CRISTÃ NO BRASIL</b></h1>
  </div>
  <div class="container">
    <component :is="currentView" />
  </div>
  <div v-if="!settings.onLine" class="warn offline print-hide">
    <b>Você está Offline!</b>
  </div>
</template>

<script setup lang="ts">
import { currentView } from "./store/router";
import { reactive } from "vue";

const settings = reactive({
  onLine: navigator.onLine,
});

window.addEventListener("online", () => {
  settings.onLine = true;
});
window.addEventListener("offline", () => {
  settings.onLine = false;
});
</script>

<style scoped lang="scss">
.offline {
  color: white;
  padding: 5px;
  position: fixed;
  width: 100%;
  bottom: 0px;
  left: 0px;
  text-align: center;
}
</style>
./Eventos
