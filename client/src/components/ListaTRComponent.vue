<template>
  <tr>
    <td :style="isValidDate(event.date) ? '' : 'display: none;'">
      <b> {{ dia(event.date) }}/{{ mes(event.date) }}</b>
    </td>
    <td :style="isValidDate(event.date) ? '' : 'display: none;'">
      {{ diaSemana(event.date) }}
    </td>
    <td :style="event.date ? '' : 'display: none;'">
      {{ hora(event.date) }}
    </td>
    <td>
      <div class="">
        {{ event.locale }}
        <q-icon
          class="print-hide"
          v-if="event.recurring"
          name="event_repeat"
          style="color: #9e9e9e"
        />
      </div>
    </td>
    <td>
      <div
        :style="event.desc ? '' : 'display: none;'"
        v-html="event.desc.replace(/(;\n|\n)/gi, '</br>')"
      ></div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { IEvento } from 'src/app';

const prop = defineProps<{ event: IEvento }>();
const event = prop.event;

function diaSemana(date?: Date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  const semana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return semana[date.getDay()] || '';
}

function dia(date?: Date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  return String(date?.getDate()).padStart(2, '0');
}
function mes(date?: Date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  return String(date.getMonth() + 1).padStart(2, '0');
}

function hora(date?: Date) {
  try {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
    }
    const hours = String(date?.getHours()).padStart(2, '0');
    const min = String(date?.getMinutes()).padStart(2, '0');
    return `${hours}:${min}`;
  } catch (error) {
    console.log('Erro format hours!');
    return '';
  }
}

function isValidDate(date: Date | undefined) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return false;
  } else {
    return true;
  }
}
</script>

<style>
tr:nth-child(even) {
  background-color: #f2f2f2;
}

td:nth-child(1),
td:nth-child(2),
td:nth-child(3) {
  width: 0px;
}
</style>
