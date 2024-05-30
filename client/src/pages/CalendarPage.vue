<template>
  <div class="text-center">
    <div class="print-only">LISTA DE ATENDIMENTO E DIVERSOS</div>
    <div>
      {{ data.locale.replace(/-$/, '').trim() }}
    </div>
  </div>

  <div id="lista">
    <div class="print-hide menu flex space-between">
      <div class="search">
        <input
          type="text"
          v-model="data.search"
          placeholder="Pesquisar..."
          x-webkit-speech=""
        />
      </div>
      <q-icon
        v-if="settings.connected && settings.admin"
        name="add"
        @click.prevent="settings.createEvent"
      />
      <q-icon
        v-if="settings.connected && settings.admin"
        name="cached"
        @click.prevent="reload"
        :class="{ rotate: settings.loading }"
        style="transform: scaleX(-1)"
      />
      <q-icon v-if="!!settings.shared" name="share" @click.prevent="shared" />
      <q-icon v-if="!!settings.shared" name="quiz" @click.prevent="whatsapp" />
      <q-icon name="print" @click.prevent="imprimir()" />
      <q-btn to="/" dense flat icon="close" />
    </div>

    <div v-for="title in data.titles" :key="title">
      <table :summary="String(title)">
        <thead>
          <th colspan="5">{{ title }}</th>
        </thead>
        <tbody>
          <ListaTR
            v-for="event in listFiltered.filter((e) => e.title === title)"
            :key="event.gid"
            :event="event"
            @dblclick="settings.selected = event"
            @click.right.prevent="settings.selected = event"
          />
        </tbody>
      </table>
    </div>
    <div
      class="print-hide"
      v-if="!listFiltered.length && !data.search.startsWith('*')"
    >
      <q-btn
        class="print-hide q-mt-lg"
        @click="data.search = `*${data.search}`"
        color="blue"
        flat
        label="Lista completa..."
      />
    </div>

    <div class="print-only right">
      <a style="color: black" :href="settings.url">{{ settings.url }}</a>
    </div>
    <div class="print-only" v-if="data.locale.includes('REGIONAL')">
      <i>
        Oração Santa Ceia <br />
        <b>Pão:</b> "Senhor, abençoa este Pão que vamos comer, que é a comunhão
        do Corpo de Cristo."
        <br />
        <b>Cálice: </b>"Senhor, abençoa o Cálice que vamos beber, que é a
        comunhão do Sangue de Cristo."
      </i>
    </div>
  </div>
  <IconCalendarComponent
    :search="data.search"
    :events="listFiltered"
    @update="data.search = $event"
  />
</template>

<script setup lang="ts">
import { IEvento, app } from '../app';
import { settings } from '../settings';
import { onMounted, onUnmounted, reactive, watch } from 'vue';
import { useRoute } from 'vue-router';
import ListaTR from '../components/ListaTRComponent.vue';
import IconCalendarComponent from '../components/IconCalendarComponent.vue';
import { reloadAPP } from '../boot/socket';

const route = useRoute();
const data = reactive({
  search: route.query.pesquisar?.toString() || '',
  locale: route.params.local?.toString() || '',
  titles: {} as string[],
});

const listFiltered: IEvento[] = [];

updateList();
watch(() => app.eventos.items, updateList);
watch(() => data.search, updateList);

function updateList() {
  let events = app.eventos.items.filter(
    (e) => e.end && e.end.getTime() > new Date().getTime()
  );
  if (!data.search && !data.locale) return [];
  const normalizeString = (str: string): string => {
    return str
      .trim()
      .toUpperCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');
  };
  let searchText = normalizeString(data.search);
  let filterLocale = normalizeString(data.locale);

  if (/^(\*)/gi.test(data.search)) {
    filterLocale = '';
    searchText = searchText.replace(/^(\*|\/)/gi, '').trim();
  }

  if (filterLocale) {
    const regexLocal = new RegExp(`^${filterLocale}`);
    events = events.filter(
      (event) =>
        normalizeString(event.list).includes(filterLocale) ||
        regexLocal.test(normalizeString(event.locale))
    );
  }

  if (searchText) {
    let regexSearch: RegExp | null = null;
    try {
      regexSearch = new RegExp(searchText, 'gi');
      console.log(regexSearch);
    } catch (error) {
      console.log('Regex search inválido!');
    }
    events = events.filter((event) => {
      const text = `${event.date?.toLocaleString()} ${event.title} ${
        event.locale
      } ${event.desc}`;
      return (
        searchText.split(' ').every((e) => normalizeString(text).includes(e)) ||
        (regexSearch && regexSearch.test(text))
      );
    });
  }
  listFiltered.length = 0;
  events.forEach((e) => {
    listFiltered.push(e);
  });
  data.titles = [...new Set(listFiltered.map((event) => event.title))];
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.altKey && event.key.toLowerCase() === 'a') {
    event.preventDefault();
    event.stopPropagation();
    settings.createEvent();
  } else if (event.altKey && ['/', '*'].includes(event.key)) {
    const searchInput = document.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

function imprimir() {
  window.print();
}
function shared() {
  if (navigator.share) {
    navigator
      .share({
        title: 'CCB',
        text: 'Lista de Atendimento',
        url: location.href,
      })
      .then(() => console.log('Conteúdo compartilhado com sucesso!'))
      .catch((error) => console.error('Erro ao compartilhar:', error));
  } else {
    console.error('API de compartilhamento não suportada.');
  }
}

function whatsapp() {
  const mensagem = encodeURIComponent(
    '📄 Batismo, Santa Ceia, ...\n\n📍 Local: \n🕗 Data: \n🤵 Atenderá: '
  );
  const numeroWhatsApp = '5562984972385';
  const urlWhatsApp = `https://api.whatsapp.com/send/?phone=${numeroWhatsApp}&text=${mensagem}&type=phone_number&app_absent=0`;
  window.location.href = urlWhatsApp;
}

async function reload() {
  if (!settings.loading) {
    settings.loading = true;
    try {
      await reloadAPP();
    } catch (error) {
      console.log('Erro ao recarregar!');
    }
    console.log('Terminoou de recarregar...');
    settings.loading = false;
  }
}
</script>

<style scoped lang="scss">
#lista {
  text-transform: uppercase;
}
.icon {
  width: 23px;
  cursor: pointer;
}

.cursor {
  cursor: pointer;
}

.menu {
  a {
    padding: 2px 8px;
    cursor: pointer;
  }

  input,
  input:focus-visible,
  input:focus {
    outline: none;
    width: auto;
    padding: 5px;
    border: none !important;
    font-size: 1.1rem;
    width: 100%;
  }

  .search {
    flex: 1;
    min-width: 90px;
  }

  i {
    font-size: 26px;
    cursor: pointer;
    color: #525252;
    margin: 0 2px;
  }
}

div.table {
  width: 100vw;
  max-width: 100vw;
  overflow-x: auto;
}

.rotate {
  animation: rotate 2s linear infinite;
  transform: rotate(0deg);
  opacity: 0.5;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}
</style>
