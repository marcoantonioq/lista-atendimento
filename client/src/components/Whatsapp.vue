<template>
  <div class="flex right">
    <a href="/">
      <img
        @click="cancelarRedirecionamento"
        class="icon"
        src="img/botao-fechar.png"
        alt="Página principal"
      />
    </a>
  </div>
  <div class="flex content">
    <a class="btn abrir" @click="abrir">Solicitar Atendimento</a>
    <a class="btn cancel" href="/">Acessar Lista</a>
  </div>
</template>

<script setup>
const mensagem = encodeURIComponent(
  "📄 Batismo, Santa Ceia, ...\n\n📍 Local: \n🕗 Data: \n🤵 Atenderá: "
);
const numeroWhatsApp = "5562984972385";

const urlWhatsApp = `https://api.whatsapp.com/send/?phone=${numeroWhatsApp}&text=${mensagem}&type=phone_number&app_absent=0`;

function abrir() {
  window.location.href = urlWhatsApp;
}
</script>

<style scoped>
.content {
  flex-direction: column;
}
.btn {
  margin-top: 20px;
  padding: 8px 16px;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  font-weight: bold;
}
.cancel {
  color: #000000;
  background-color: #b8b8b8;
}

.cancel:hover {
  background-color: #a0a0a0;
}

.abrir {
  background-color: rgb(0, 128, 0);
}

.abrir:hover {
  background-color: rgb(0, 85, 0);
}
</style>
