/* eslint-disable quotes */
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VeevalidatePlugin from "./includes/validation";
import "./includes/firebase";
import "./assets/tailwind.css";
import "./assets/main.css";
import i18n from './i18n'

createApp(App).use(i18n).use(store).use(router).use(VeevalidatePlugin).mount("#app");
