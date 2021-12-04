<template>
  <div>
    <app-header />
    <router-view></router-view>
    <player />
    <auth-modal />
  </div>
</template>

<script>
import AppHeader from "./components/Header.vue";
import AuthModal from "./components/AuthModal.vue";
import Player from "./components/Player.vue";
import { auth } from "./includes/firebase";

export default {
  name: "App",
  components: {
    AppHeader,
    AuthModal,
    Player,
  },
  created() {
    auth.onAuthStateChanged(auth.getAuth(), (user) => {
      console.log(user);
      if (user) {
        this.$store.dispatch("init_login");
      }
    });
  },
};
</script>
