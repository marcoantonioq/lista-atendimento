<template>
  <div>
    <button @click="prevMonth">Anterior</button>
    | <span>{{ currentMonth }}</span> |
    <button @click="nextMonth">Próximo</button> |
    <button @click="goToToday">Hoje</button>
    <table>
      <thead>
        <tr>
          <th v-for="day in daysOfWeek" :key="day">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, index) in calendar" :key="index">
          <td
            v-for="day in week"
            :key="day.date"
            :class="{
              'other-month': day.isOtherMonth,
              'current-day': day.isCurrentDay,
            }"
          >
            {{ day.date }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      currentDate: new Date(),
    };
  },
  computed: {
    daysOfWeek() {
      return ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    },
    currentMonth() {
      // return this.currentDate?.toLocaleDateString("pt-BR", {
      //   year: "numeric",
      //   month: "long",
      // });
      return "";
    },
    calendar() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);
      const firstDayOfWeek = firstDayOfMonth.getDay();

      const weeks = [];
      let currentWeek = [];
      for (let i = 0; i < firstDayOfWeek; i++) {
        currentWeek.push({ date: "", isOtherMonth: true });
      }

      for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        currentWeek.push({ date: day, isOtherMonth: false });
        if (currentWeek.length === 7) {
          weeks.push(currentWeek);
          currentWeek = [];
        }
      }

      while (currentWeek.length < 7) {
        currentWeek.push({ date: "", isOtherMonth: true, isCurrentDay: false });
      }

      weeks.push(currentWeek);

      return weeks;
    },
  },
  methods: {
    goToToday() {
      this.currentDate = new Date(); // Define a data atual
    },
    prevMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() - 1,
        1
      );
    },
    nextMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        1
      );
    },
  },
});
</script>

<style scoped>
.calendar-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

table {
  width: 100%;
}

.other-month {
  color: lightgray;
}

.current-day {
  background-color: yellow;
}
</style>
