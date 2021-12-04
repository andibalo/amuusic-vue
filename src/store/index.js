import { signOut } from "@firebase/auth";
import { createStore } from "vuex";
import { auth, db } from "../includes/firebase";
import { Howl } from "howler";
import helpers from "../includes/helpers";

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
    currentSong: {},
    sound: {},
    seek: "00:00",
    duration: "00:00",
    playerProgress: "0%",
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuth: (state) => {
      state.userLoggedIn = !state.userLoggedIn;
    },
    newSong: (state, payload) => {
      state.currentSong = payload;
      state.sound = new Howl({
        src: [payload.url],
        html5: true,
      });
    },
    updatePosition: (state) => {
      state.seek = helpers.formatTime(state.sound.seek());
      state.duration = helpers.formatTime(state.sound.duration());
      state.playerProgress = `${(state.sound.seek() / state.sound.duration()) * 100}%`;
    },
  },
  getters: {
    authModalShow: (state) => state.authModalShow,
    playing: (state) => (state.sound.playing ? state.sound.playing() : false),
  },
  actions: {
    async login({ commit }, payload) {
      await auth.signInWithEmailAndPassword(auth.getAuth(), payload.email, payload.password);

      commit("toggleAuth");
    },
    async register({ commit }, payload) {
      const userCred = await auth.createUserWithEmailAndPassword(
        auth.getAuth(),
        payload.email,
        payload.password
      );

      await db.setDoc(db.doc(db.getFirestore(), "users", userCred.user.uid), {
        name: payload.name,
        email: payload.email,
        age: payload.age,
        country: payload.country,
      });

      await auth.updateProfile(auth.getAuth().currentUser, {
        displayName: payload.name,
      });

      commit("toggleAuth");
    },
    async signOut({ commit }) {
      await auth.signOut(auth.getAuth());

      commit("toggleAuth");
    },
    async newSong({ commit, state, dispatch }, payload) {
      if (state.sound.playing) {
        state.sound.unload();
      }

      commit("newSong", payload);

      state.sound.play();

      state.sound.on("play", () => {
        requestAnimationFrame(() => {
          dispatch("progress");
        });
      });
    },
    async toggleAudio({ state }) {
      if (!state.sound.playing) {
        return;
      }

      if (state.sound.playing()) {
        state.sound.pause();
      } else {
        state.sound.play();
      }
    },
    progress({ commit, state, dispatch }) {
      commit("updatePosition");

      if (state.sound.playing()) {
        requestAnimationFrame(() => {
          dispatch("progress");
        });
      }
    },
    updateSeek({ state, dispatch }, payload) {
      if (!state.sound.playing) {
        return;
      }

      const { x, width } = payload.currentTarget.getBoundingClientRect();

      const clickX = payload.clientX - x;
      const percentage = clickX / width;
      const seconds = state.sound.duration() * percentage;

      state.sound.seek(seconds);

      state.sound.once("seek", () => {
        dispatch("progress");
      });
    },
    init_login({ commit }) {
      commit("toggleAuth");
    },
  },
});
