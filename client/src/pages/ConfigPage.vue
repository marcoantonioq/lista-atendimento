<template>
  <q-list class="q-ma-md" bordered>
    <q-expansion-item
      group="somegroup"
      class="q-pa-md expansion"
      expand-separator
      icon="settings_suggest"
      label="Sistema"
      default-opened
    >
      <q-input
        v-model="data.eventos.intervaloDias"
        label="Intervalo de Dias"
      ></q-input>
      <q-input
        v-model="token"
        @blur="saveToken"
        label="Token do Sistema"
      ></q-input>
    </q-expansion-item>

    <q-expansion-item
      group="somegroup"
      class="q-pa-md expansion"
      expand-separator
      icon="calendar_month"
      label="Calendários"
    >
      <div
        class="row items-center q-ml-md"
        v-for="cal of data.google.calendars"
        :key="cal.id"
      >
        <q-btn
          flat
          icon="delete"
          @click="
            data.google.calendars = data.google.calendars.filter(
              (e) => e.id !== cal.id
            )
          "
        />
        {{ cal.summary }}
      </div>
      <div class="row q-pb-md q-ml-lg">
        <q-input
          class="col"
          label="ID da agenda"
          v-model="calendarID"
          @keyup.enter="addCalendar"
          @blur="addCalendar"
        />
        <q-btn flat icon="add" @click="addCalendar" />
      </div>
    </q-expansion-item>

    <q-expansion-item
      group="somegroup"
      class="q-pa-md expansion"
      expand-separator
      icon="vpn_key"
      label="Autenticação Google"
    >
      <q-input v-model="data.google.secret.type" label="Type"></q-input>
      <q-input
        v-model="data.google.secret.project_id"
        label="Project ID"
      ></q-input>
      <q-input
        v-model="data.google.secret.private_key_id"
        label="Private Key ID"
      ></q-input>
      <q-input
        v-model="data.google.secret.private_key"
        label="Private Key"
      ></q-input>
      <q-input
        v-model="data.google.secret.client_email"
        label="Client Email"
      ></q-input>
      <q-input
        v-model="data.google.secret.client_id"
        label="Client ID"
      ></q-input>
      <q-input v-model="data.google.secret.auth_uri" label="Auth URI"></q-input>
      <q-input
        v-model="data.google.secret.token_uri"
        label="Token URI"
      ></q-input>
      <q-input
        v-model="data.google.secret.auth_provider_x509_cert_url"
        label="Auth Provider x509 Cert URL"
      ></q-input>
      <q-input
        v-model="data.google.secret.client_x509_cert_url"
        label="Client x509 Cert URL"
      ></q-input>
      <q-input
        v-model="data.google.secret.universe_domain"
        label="Universe Domain"
      ></q-input>
    </q-expansion-item>
  </q-list>
  <q-card class="q-ma-md q-pa-md q-gutter-sm">
    <q-btn color="green-8" label="Salvar" @click="save" />
    <q-btn color="cyan-9" label="Backup" @click="backup" />
    <q-btn color="cyan-9" label="Restaurar" @click="fileInput?.click()" />
    <q-btn color="red-9" label="Reiniciar" @click="reboot" />
    <input
      ref="fileInput"
      type="file"
      style="display: none"
      @change="uploadJson"
    />
  </q-card>
  <q-btn class="save" round dense color="dark" icon="save" @click="save" />
  <q-btn
    v-if="session"
    class="logout"
    alt="Saír"
    round
    dense
    color="red"
    icon="exit_to_app"
    @click="logout"
  />
</template>

<script setup lang="ts">
import { app } from 'src/app';
import { rebootAPP, saveApp } from 'src/boot/socket';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const data = reactive(app);
const calendarID = ref('');
const token = ref('');
const fileInput = ref(null as null | HTMLElement);
const session = localStorage.getItem('token');

function saveToken() {
  localStorage.setItem('token', token.value);
  location.reload();
}

async function reboot() {
  await rebootAPP();
}

async function logout() {
  localStorage.clear();
  location.reload();
}

async function save() {
  await saveApp(data);
  router.push('/');
}

const uploadJson = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const jsonData = e?.target?.result as string;
      const data = JSON.parse(jsonData);
      await saveApp(data);
      router.push('/');
    } catch (error) {
      console.error('Erro ao analisar o arquivo JSON:', error);
    } finally {
      if (fileInput.value) {
        (fileInput.value as HTMLInputElement).value = '';
      }
    }
  };
  reader.readAsText(file);
};

function backup() {
  const jsonData = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'config.json';
  link.click();
  window.URL.revokeObjectURL(url);
}

const addCalendar = () => {
  if (calendarID.value.trim()) {
    data.google.calendars.push({
      id: calendarID.value,
      summary: `Novo Calendário: ${calendarID.value.slice(0, 10)}...`,
      description: '',
      timeZone: '',
      hidden: false,
      selected: true,
      valid: true,
      sharedUsers: [],
    });
    calendarID.value = '';
  }
};
</script>

<style scoped lang="scss">
.save {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
.logout {
  position: fixed;
  top: 20px;
  right: 20px;
}
</style>
