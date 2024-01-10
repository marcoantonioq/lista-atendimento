<template>
  <div class="search print-hide">
    <input
      class="print-hide"
      type="text"
      v-model="data.search"
      placeholder="Pesquisar..."
      x-webkit-speech=""
    />
    <img
      class="print-hide print hide"
      @click.prevent="imprimir()"
      src="/img/impressora.png"
      alt="Impressão"
    />
    <img
      @click="save"
      v-if="data.search && !data.suggestions.includes(data.search)"
      class="print-hide save hide"
      src="/img/salvar.png"
    />
    <img
      v-if="'REGIONAL' !== data.search"
      @click="clear"
      class="print-hide clear"
      src="/img/lixeira.png"
    />
    <div>
      <h3>Outras:</h3>
      <ul class="suggestions">
        <li
          v-for="suggestion in data.suggestions.filter(
            (el) => el !== data.search
          )"
          :key="suggestion"
          @click="selectSuggestion(suggestion)"
        >
          {{ suggestion }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Router } from "../store/router";
import { reactive, watchEffect, onMounted } from "vue";

const imprimir = () => {
  window.print();
};

const data = reactive({
  search: "REGIONAL",
  suggestions: ["REGIONAL", "DARPE"],
});

const clear = () => {
  if (!["REGIONAL", "DARPE"].includes(data.search)) {
    data.suggestions = data.suggestions.filter((el) => el !== data.search);
    localStorage.setItem("suggestion", JSON.stringify(data.suggestions));
  }
  data.search = "REGIONAL";
};

const save = () => {
  if (!data.suggestions.includes(data.search)) {
    data.suggestions.push(data.search);
  }
  localStorage.setItem("suggestion", JSON.stringify(data.suggestions));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectSuggestion = (suggestion: any) => {
  // router.push(`/lista/${suggestion}`);
  data.search = suggestion;
};

const filter = Router.query.get("filter") || "";
const saved = Router.query.get("save") || false;

if (filter) {
  data.search = filter;
  if (saved) save();
}

const emit = defineEmits<{
  (e: "fetched", fetched: string): void;
}>();

watchEffect(() => {
  emit("fetched", data.search);
});

onMounted(() => {
  const suggestions = JSON.parse(localStorage.getItem("suggestion") || "[]");
  suggestions.forEach((el: string) => {
    if (!data.suggestions.includes(el)) data.suggestions.push(el);
  });
});
</script>

<style scoped lang="scss">
.search {
  display: flex;
  flex-direction: column;
  align-content: center;
  position: relative;
  input[type="text"] {
    width: 100%;
    height: 36px;
    background: url("../../public/img/pesquisa.png") no-repeat 8px 6px;
    background-size: 20px 20px;
    padding-left: 33px;
    border-style: solid;
    border-color: #191919;
    color: #191919;
    font-weight: bold;
    font-size: 1.2rem;
  }
  input:focus-visible {
    outline: 1px dashed black;
  }

  img {
    padding: 10px;
    width: 40px;
    height: 40px;
    cursor: pointer;
  }

  img.save {
    position: absolute;
    right: 70px;
  }
  img.clear {
    position: absolute;
    right: 35px;
  }
  img.print {
    position: absolute;
    right: 0px;
  }

  ul.suggestions {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  .suggestions li {
    padding: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .suggestions li:hover {
    background-color: #f0f0f0;
  }
}
</style>
