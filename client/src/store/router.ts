/* eslint-disable @typescript-eslint/no-explicit-any */
import { reactive, computed, markRaw } from "vue";

import Agenda from "../components/Agenda.vue";
import Darpe from "../components/Darpe.vue";
import Home from "../components/Home.vue";
import Lista from "../components/Lista.vue";
import Config from "../components/Config.vue";
import NotFound from "../components/NotFound.vue";
import Calendar from "../components/Calendar.vue";
import Whatsapp from "../components/Whatsapp.vue";

interface RouteComponent {
  [key: string]: any;
}

interface Router {
  routes: RouteComponent;
  hash: string;
  query: URLSearchParams;
}

export const Router: Router = reactive({
  routes: markRaw({
    "/": Lista,
    lista: Lista,
    home: Home,
    agenda: Agenda,
    darpe: Darpe,
    calendar: Calendar,
    config: Config,
    wa: Whatsapp,
    found: NotFound,
  }),
  hash: "",
  query: new URLSearchParams(),
});

const update = () => {
  Router.hash = window.location.hash;
  Router.query = new URLSearchParams(window.location.hash.replace(/.*\?/, ""));
};

window.addEventListener("hashchange", () => {
  update();
});
update();

export const currentView = computed(() => {
  const id: string = Router.hash.replace(/\?.*/, "").slice(1) || "/";
  return Router.routes[id] || NotFound;
});

export default Router;
