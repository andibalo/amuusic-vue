import { signOut } from "@firebase/auth";
import { createStore } from "vuex";
import { auth, db } from "../includes/firebase";
export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false
  },
  mutations: {
    toggleAuthModal: state => {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuth: state => {
      state.userLoggedIn = !state.userLoggedIn;
    }
  },
  getters: {
    authModalShow: state => {
      return state.authModalShow;
    }
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
        country: payload.country
      });

      await auth.updateProfile(auth.getAuth().currentUser, {
        displayName: payload.name
      });

      commit("toggleAuth");
    },
    async signOut({ commit }) {
      await auth.signOut(auth.getAuth());

      commit("toggleAuth");
    },
    init_login({ commit }) {
      commit("toggleAuth");
    }
  }
});
