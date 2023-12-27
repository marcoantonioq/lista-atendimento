<template>
  <div class="flex">
    <u class="flex center print-only">LISTA DE ATENDIMENTO E DIVERSOS</u>
  </div>
  <SavePopup
    :selected="settings.selected"
    :show-popup="settings.showPopup"
    @close="close"
    @save="save"
    @remove="remove"
  />

  <div id="lista">
    <div class="print-hide menu flex space-between">
      <div class="search">
        <input
          type="text"
          v-model="settings.search"
          placeholder="Pesquisar..."
          x-webkit-speech=""
        />
      </div>

      <div class="flex right">
        <a v-if="app.shareable" @click.prevent="app.shared">
          <img class="icon" src="img/compartilhar.png" alt="Compartilhar..." />
        </a>
        <a v-if="app.shareable" href="#wa">
          <img class="icon" src="img/solicitar.png" alt="Solicitar..." />
        </a>
        <a
          v-if="app.isAdmin"
          :class="{ rotate: app.loading }"
          @click.prevent="reloadData()"
        >
          <img
            class="icon print-hide"
            src="/img/recarregar.png"
            alt="Atualizar"
          />
        </a>
        <a v-if="app.isAdmin" @click.prevent="openSavePopup(null)">
          <img
            class="icon print-hide"
            src="/img/adicionar.png"
            alt="Adicionar evento"
          />
        </a>
        <a @click.prevent="imprimir()">
          <img
            class="icon print-hide"
            src="/img/impressora.png"
            alt="Impressão"
          />
        </a>
        <a href="#home">
          <img class="icon" src="img/botao-fechar.png" alt="Pagina principal" />
        </a>
      </div>
    </div>
    <div
      class="table"
      v-for="(titles, title) in groupByProperty(
        app.eventos.filter(
          ({ end }) => end && !isNaN(end.getTime()) && end >= new Date()
        ),
        'title',
        settings.search
      )"
      :key="title"
    >
      <table :summary="String(title)">
        <thead>
          <th colspan="5">{{ title }}</th>
        </thead>
        <tbody>
          <tr
            v-for="(row, id) in titles"
            :key="id"
            @dblclick="openSavePopup(row)"
            :class="{ cursor: app.isAdmin }"
          >
            <td :style="isValidDate(row.date) ? '' : 'display: none;'">
              <b> {{ d.diaMes(row.date) }}</b>
            </td>
            <td :style="isValidDate(row.date) ? '' : 'display: none;'">
              {{ d.diaSemana(row.date) }}
            </td>
            <td
              :style="
                row.date && row.date.getHours() > 5 ? '' : 'display: none;'
              "
            >
              {{ d.hora(row.date) }}
            </td>
            <td>
              {{ row.locale }}
              <img
                v-if="
                  app.isAdmin &&
                  row.recurring &&
                  !['', 'false'].includes(row.recurring.trim())
                "
                class="print-hide"
                style="width: 10px"
                src="/img/repeticao.png"
                alt="Item se repete"
              />
            </td>
            <td
              :style="row.desc ? '' : 'display: none;'"
              v-html="row.desc.replace(/(;\n|\n)/gi, '</br>')"
            ></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="print-only right">
      <a style="color: black" :href="app.BASE_URL">{{ app.BASE_URL }}</a>
    </div>
    <div v-if="settings.search.match(/REGIONAL/gi)" class="print-only">
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
</template>

<script setup lang="ts">
import * as d from "../composables/data";
import SavePopup from "./SavePopup.vue";
import { Evento } from "../../shared/app/Eventos";
import { Router } from "../composables/router";
import { groupByProperty } from "../../shared/utils/filters";
import { isValidDate } from "../../shared/utils/helpers";
import { onMounted, onUnmounted, reactive } from "vue";
import { app, saveEvent, removeEvent, reloadData } from "../composables/app";

const settings = reactive({
  showPopup: false,
  search: Router.query.get("filter") || "REGIONAL",
  selected: null as Evento | null,
});

const openSavePopup = (event: Evento | null) => {
  if (!app.isAdmin) return;
  settings.selected = JSON.parse(JSON.stringify(event));
  settings.showPopup = true;
};

function remove(source: Evento) {
  removeEvent(source);
  close();
}

function save(source: Evento) {
  try {
    // Sanitização
    if (source.title.match(/(AVISOS À IRMANDADE)/gi)) source.date?.setHours(0);

    if (source.title.match(/(VIAGENS MISSIONÁRIAS)/gi))
      source.date?.setHours(1);

    saveEvent(source);

    //   // se foi alterado a data ou lista
    //   if (
    //     settings.selected.list !== source.list ||
    //     settings.selected.date !== source.date
    //   ) {
    //     app.eventos.push(
    //       app.eventos.create({
    //         ...source,
    //         ...{ id: "", gid: "" },
    //       })
    //     );
    //   } else {
    //     app.eventos.push(app.eventos.create(source));
    //   }
    close();
  } catch (error) {
    console.info("Erro ao salvar a data:: ", error);
  }
}

function close() {
  settings.showPopup = false;
  settings.selected = null;
}

const handleKeyDown = (event: KeyboardEvent) => {
  const inputTags = ["INPUT", "TEXTAREA"];
  if (
    event.key.toLowerCase() === "a" &&
    !settings.showPopup &&
    document?.activeElement?.tagName &&
    !inputTags.includes(document?.activeElement?.tagName)
  ) {
    openSavePopup(null);
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});

const imprimir = () => {
  window.print();
};
</script>

<style scoped lang="scss">
#lista {
  margin-bottom: 20px;
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
  }
}

div.table {
  max-width: 100vw;
  overflow-x: auto;
}
tr:nth-child(even) {
  background-color: #f2f2f2;
}

td:nth-child(1),
td:nth-child(2),
td:nth-child(3) {
  width: 0px;
}

.rotate {
  animation: rotate 2s linear infinite;
  transform: rotate(360deg);
  opacity: 0.5;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
