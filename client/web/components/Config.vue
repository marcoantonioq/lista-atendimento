<template>
  <div class="flex right">
    <a href="#home">
      <img class="icon" src="img/botao-fechar.png" alt="Pagina principal" />
    </a>
  </div>
  <form>
    <div class="input-field" v-if="server === 'SOCKET'">
      <label for="key">SERVIDOR SOCKET</label>
      <input id="ip_socket" type="text" v-model="ip_socket" @blur="reload" />
    </div>
    <div class="input-field">
      <label for="key">Chave de API</label>
      <input id="key" type="text" v-model="key" required @blur="reload" />
    </div>
  </form>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

const key = ref(localStorage.getItem("key") || "");
watch(key, (newKey) => {
  try {
    localStorage.setItem("key", newKey);
  } catch (error) {
    console.error("Erro ao salvar a chave de API:", error);
  }
});

const server = ref(localStorage.getItem("server") || "SOCKET");
watch(server, (newServer) => {
  try {
    localStorage.setItem("server", newServer);
  } catch (error) {
    console.error("Erro ao salvar a servidor!!!:", error);
  }
});

const ip_socket = ref(localStorage.getItem("ip_socket") || "");
watch(ip_socket, (newServer) => {
  try {
    localStorage.setItem("ip_socket", newServer);
  } catch (error) {
    console.error("Erro ao salvar a servidor!!!:", error);
  }
});

function reload() {
  window.location.reload();
}
</script>

<style scoped lang="scss"></style>
