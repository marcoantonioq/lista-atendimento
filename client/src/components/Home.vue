<template>
  <div class="flex">
    <input type="text" name="search" id="search" />
  </div>
  <div class="flex icons">
    <template v-for="value in values" :key="value.title">
      <a
        :href="value.href"
        :target="value.href.startsWith('http') ? '_blank' : ''"
      >
        <img :src="value.icon" :alt="value.title" />
        {{ value.title }}
      </a>
    </template>
  </div>
  <a class="config" href="#config">
    <img src="/img/configuracao.png" alt="" />
  </a>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

interface MenuItem {
  title: string;
  href: string;
  icon: string;
}

const values = ref<MenuItem[]>([]);

onMounted(async () => {
  try {
    const response = await fetch(`data/menu.json`);
    const json = await response.json();
    values.value = json.values;
  } catch (error) {
    console.error("Erro ao carregar os dados:", error);
  }
});
</script>

<style scoped lang="scss">
.icons {
  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    margin: 5px;
    border-radius: 5px;
    border: 2px solid #d4d9e2;
    min-width: 168px;

    img {
      width: 60px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}

input#search {
  align-items: center;
  border-radius: 5px;
  border: 2px solid #d4d9e2;
  display: none;
  margin: 5px;
  padding: 10px;
  position: absolute;
  top: 9px;
  width: 330px;
}

a.config {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: white;
  padding: 10px;
  img {
    width: 25px;
  }
}
</style>
