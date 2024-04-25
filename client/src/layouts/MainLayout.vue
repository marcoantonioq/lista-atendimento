<template>
  <q-layout view="lHh Lpr lFf">
    <header>
      <q-btn class="title" to="/" outline>CONGREGAÇÃO CRISTÃ NO BRASIL</q-btn>
    </header>
    <q-page-container>
      <q-page>
        <router-view />
        <div class="off" v-if="!settings.connected">Você está off-line</div>
        <PushComponent/>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { settings } from 'src/settings';
import PushComponent from '../components/PushComponent.vue'
settings;
</script>

<style scoped>
header {
  text-align: center;
}

.title {
  font-size: 1.6rem;
  text-decoration: underline;
  color: #191c31;
}

.q-btn--outline:before {
  border: 0px;
}
.off {
  position: fixed;
  bottom: 0px;
  left: 0;
  background-color: red;
  color: aliceblue;
  width: 100vw;
}
</style>
