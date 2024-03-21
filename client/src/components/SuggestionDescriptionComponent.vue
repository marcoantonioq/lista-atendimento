<template>
  <div>
    <q-editor class="q-pt-md" v-model="childValue" :label="label" />
    <small
      v-show="
        suggestions.length > 1 ||
        childValue.toUpperCase() !== suggestions[0].toUpperCase()
      "
      class="suggestion"
      v-for="suggestion in suggestions.slice(0, 4)"
      :key="suggestion"
      @click.prevent="childValue = suggestion"
    >
      {{ suggestion }}
    </small>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  label: string;
  list: string[];
  modelValue: string;
}>();

const emit = defineEmits(['update']);

const childValue = ref(props.modelValue);
const suggestions = ref(props.list);

watch(
  () => childValue.value,
  (newValue) => {
    const value = newValue.replace(/&NBSP;/gi, ' ');
    emit('update', value);
    suggestions.value = filterText(props.list, value);
  }
);

function normalizeString(str: string): string {
  return str
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

function includesNormalized(mainStr: string, subStr: string): boolean {
  return normalizeString(mainStr).includes(normalizeString(subStr));
}

function filterText(list: string[], word: string, limit = 4): string[] {
  if (!word) return list.slice(0, limit);

  return list
    .filter((e) => word.split(' ').every((s) => includesNormalized(e, s)))
    .slice(0, limit);
}
</script>

<style scoped lang="scss">
.suggestion {
  background-color: #c5c4c4;
  border-radius: 4px;
  padding: 3px;
  margin: 2px;
  display: inline-flex;
}
</style>
