import { createApp } from "vue";
import App from "./App.vue";
import "./assets/css/global.css";
import "./registerServiceWorker";

// https://www.flaticon.com/br

const app = createApp(App);

app.mount("#app");
