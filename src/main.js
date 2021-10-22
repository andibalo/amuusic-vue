/* eslint-disable quotes */
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VeevalidatePlugin from "./includes/validation";
import "./assets/tailwind.css";
import "./assets/main.css";

createApp(App)
  .use(store)
  .use(router)
  .use(VeevalidatePlugin)
  .mount("#app");
