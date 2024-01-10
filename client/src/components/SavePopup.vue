<template>
  <div class="page" @click="closePopup" v-if="settings.showPopup"></div>
  <div class="popup" v-if="settings.showPopup">
    <form autocomplete="off" @submit.prevent="saveItem">
      <div class="input-field">
        <label for="list">Grupo:</label>
        <select v-model="settings.form.list" id="list" v-show="!props.selected">
          <option value="REGIONAL">REGIONAL</option>
          <option value="LOCALIDADES">LOCAL</option>
          <option value="DARPE">DARPE</option>
          <option value="RPC">RPC</option>
          <option value="PORTEIROS">PORTEIROS</option>
        </select>
      </div>

      <div class="input-field">
        <label for="locale">Titulo:</label>
        <input
          v-model="settings.form.title"
          type="text"
          id="title"
          autocomplete="off"
          autofocus
          @keydown.enter.prevent="
            settings.form.title = filterText(titles, settings.form.title)[0]
          "
          @change="settings.form.title = settings.form.title.toUpperCase()"
        />
        <small
          class="suggestion"
          v-for="suggestion in filterText(titles, settings.form.title)"
          :key="suggestion"
          @click="settings.form.title = suggestion"
          >{{ suggestion }}
        </small>
      </div>

      <div class="input-field">
        <label for="locale">Local:</label>
        <input
          v-model="settings.form.locale"
          type="text"
          id="locale"
          autocomplete="off"
          @change="settings.form.locale = settings.form.locale.toUpperCase()"
          @keydown.enter.prevent="
            settings.form.locale = filterText(locales, settings.form.locale)[0]
          "
        />
        <small
          class="suggestion"
          v-for="suggestion in filterText(locales, settings.form.locale)"
          :key="suggestion"
          @click="settings.form.locale = suggestion"
          >{{ suggestion }}
        </small>
      </div>

      <div class="input-field">
        <label for="desc">Descrição:</label>
        <textarea
          v-model="settings.form.desc"
          id="desc"
          rows="4"
          @change="settings.form.desc = settings.form.desc.toUpperCase()"
        ></textarea>
        <small
          class="suggestion"
          v-for="suggestion in filterText(description, settings.form.desc)"
          :key="suggestion"
          @click="settings.form.desc = suggestion"
          >{{ suggestion }}
        </small>
      </div>

      <div class="input-field">
        <label for="date">Data:</label>
        <input
          v-model="settings.form.date"
          type="datetime-local"
          id="date"
          :min="new Date().toISOString().slice(0, 16)"
        />
      </div>

      <div class="input-field">
        <label for="end">Data de Término:</label>
        <input
          v-model="settings.form.end"
          type="datetime-local"
          id="end"
          :min="settings.form.date"
        />
      </div>

      <div class="input-field">
        <label for="recurring">Recorrência:</label>
        <input
          v-show="!props.selected"
          v-model="settings.data.recurring"
          type="text"
          id="recurring"
          @keyup="updateExpression()"
        />
        <small> {{ settings.msg.recurring }} </small>
      </div>
    </form>

    <div class="flex space-between">
      <a class="btn" @click="saveItem">
        <img src="/img/salvar-enviar.png" />
      </a>
      <a
        v-if="props.selected?.maps"
        :href="`https://calendar.google.com/calendar/r/eventedit/${props.selected?.maps}`"
        target="_blank"
        rel="noopener noreferrer"
        class="btn"
      >
        <img src="/img/agenda.png" />
      </a>
      <a class="btn" @click="deleteEvent">
        <img src="/img/lixeira.png" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, watch, watchEffect } from "vue";
import { locales } from "../store/locales";
import { titles } from "../store/titles";
import { description } from "../store/description";
import { format } from "../utils/helpers";
import { filterText } from "../utils/filters";
import { Evento } from "../App";

type form = {
  list: string;
  title: string;
  locale: string;
  date: string;
  end: string;
  desc: string;
  id: number;
  gid: string;
  updated: Date;
  recurring: string;
};

const settings = reactive({
  form: {} as form,
  showPopup: false,
  msg: {
    recurring: "",
  },
  data: {
    recurring: "",
  },
});

const props = defineProps<{
  selected: Evento | null;
  showPopup: boolean;
}>();

const emit = defineEmits(["save", "remove", "close"]);

watchEffect(() => {
  const defaultDate = new Date();
  const defaultEnd = new Date();
  defaultDate.setHours(19, 0, 0, 0);
  defaultEnd.setHours(21, 0, 0, 0);
  const DEFAULT_FORM_VALUES = {
    id: 0,
    list: "REGIONAL",
    title: "",
    locale: "",
    desc: "",
    gid: "",
    date: "",
    end: "",
    updated: new Date(),
    recurring: "",
  };

  const { selected } = props;

  if (selected) {
    const {
      id = 0,
      list = "REGIONAL",
      title = "",
      locale = "",
      desc = "",
      gid = "",
      date = defaultDate,
    } = selected;
    const recurring = "";

    console.log("Item selecionado: ", list);

    settings.form = {
      id,
      list,
      title,
      locale,
      desc: desc.replace(/(<br>|<\/br>)/gi, "\n"),
      gid: gid || "",
      date: format(date || defaultDate) || "",
      end: format(date || defaultEnd) || "",
      updated: new Date(),
      recurring,
    };
  } else {
    settings.form = {
      ...DEFAULT_FORM_VALUES,
      date: format(defaultDate) || "",
      end: format(defaultEnd) || "",
    };
  }

  settings.showPopup = props.showPopup;
});

watch(
  () => settings.form.date,
  (novo) => {
    const end = new Date(novo);
    end.setHours(end.getHours() + 2, 0, 0);
    const date = format(end);
    if (date) settings.form.end = date;
  }
);

function saveItem() {
  const { list, title, date } = settings.form;
  if (!list.trim() || !title.trim() || !date.trim()) return;

  const target: Evento = {
    ...settings.form,
    desc: settings.form.desc.replace(/\n/g, "<br>"),
    date: new Date(settings.form.date),
    end: new Date(settings.form.end),
    updated: new Date(),
  };
  emit("save", target);
  closePopup();
}

function deleteEvent() {
  emit("remove", { ...props.selected, ...{ desc: "REMOVE" } });

  closePopup();
}

function closePopup() {
  settings.showPopup = false;
  settings.data.recurring = "";
  emit("close");
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closePopup();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});

function updateExpression() {
  settings.msg.recurring = "";
  const regex = /^(\d+)([DSMA])$/;
  settings.data.recurring = settings.data.recurring.toUpperCase();
  const match = settings.data.recurring.match(regex);

  if (!match || match.length < 3) {
    settings.msg.recurring =
      "Expressão de recorrência inválida. Use o formato: [número][D para dias, S para semanas, M para meses, A para anos]";
    return;
  }

  const intervalStr = match[1];
  const frequency = match[2];
  const interval = parseInt(intervalStr, 10);

  if (interval <= 0) {
    settings.msg.recurring = "O intervalo deve ser maior que zero.";
    return;
  }

  const ruleMap: Record<string, string> = {
    D: "DAILY",
    S: "WEEKLY",
    M: "MONTHLY",
    A: "YEARLY",
  };

  const freq = ruleMap[frequency];
  if (!freq) {
    settings.msg.recurring =
      "Tipo de recorrência inválido. Use D para dias, S para semanas, M para meses, A para anos.";
    return;
  }

  if (freq === "WEEKLY") {
    const dayOfWeek = new Date(settings.form.date).getDay();
    const days = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
    const dayOfWeekString = days[dayOfWeek];
    settings.form.recurring = `RRULE:FREQ=${freq};INTERVAL=${interval};BYDAY=${dayOfWeekString}`;
  } else if (freq === "MONTHLY") {
    const dayOfMonth =
      Math.floor((new Date(settings.form.date).getDate() - 1) / 7) + 1;
    settings.form.recurring = `RRULE:FREQ=${freq};INTERVAL=${interval};BYDAY=${dayOfMonth}WE`;
  } else {
    settings.form.recurring = `RRULE:FREQ=${freq};INTERVAL=${interval}`;
  }
}
</script>

<style lang="scss" scoped>
.popup {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 500px;
  width: 90%;
  background-color: white;
  padding: 20px;
  border: 1px solid #535353;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  max-height: 100%;
  overflow-y: scroll;
}

.page {
  background-color: transparent;
  width: 98vw;
  height: 99vh;
  position: fixed;
  top: 0;
  left: 0;
}
.btn {
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  img {
    width: 30px;
  }
}
</style>
