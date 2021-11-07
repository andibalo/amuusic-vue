<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <upload :addSong="addSong" />
      </div>
      <div class="col-span-2">
        <div
          class="bg-white rounded border border-gray-200 relative flex flex-col"
        >
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i
              class="fa fa-compact-disc float-right text-green-400 text-2xl"
            ></i>
          </div>
          <div class="p-6">
            <composition-item
              v-for="(song, i) in songs"
              :key="song.docID"
              :song="song"
              :updateSong="updateSong"
              :index="i"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Upload from "../components/Upload.vue";
import CompositionItem from "../components/CompositionItem.vue";
import { songsCollection, auth, db } from "../includes/firebase";

export default {
  name: "Manage",
  components: {
    Upload,
    CompositionItem,
  },
  data() {
    return {
      songs: [],
      unsavedFlag: false,
    };
  },
  async created() {
    const q = db.query(
      songsCollection,
      db.where("uid", "==", auth.getAuth().currentUser.uid)
    );

    const querySnapshot = await db.getDocs(q);
    querySnapshot.forEach((doc) => {
      const song = {
        ...doc.data(),
        docID: doc.id,
      };

      this.songs.push(song);
    });
  },
  methods: {
    updateSong(i, values) {
      this.songs[i].modified_name = values.modified_name;
      this.songs[i].genre = values.genre;
    },
    removeSong(i) {
      this.songs.splice(i, 1);
    },
    addSong(doc) {
      const song = {
        ...doc.data(),
        docID: doc.id,
      };

      this.songs.push(song);
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    },
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next();
    } else {
      const leave = confirm(
        "You have unsaveed changes, are your sure you want to leave?"
      );

      next(leave);
    }
  },
};
</script>