<script setup>
import Tile from "../components/Tile.vue";
import { onMounted, onUnmounted } from "vue";
import { useHeaderStore } from "@/stores/useHeaderStore";

const store = useHeaderStore();

onMounted(async () => {
  store.setTitle("Administración");
});

onUnmounted(() => {
  store.setTitle("");
});
</script>

<template>
  <div
    class="d-flex flex-column justify-content-center align-items-center p-3 overflow-auto"
  >
    <Tile title="Jugadores" icon="mdi mdi-tshirt-v-outline" class="m-2" to="/players" />
    <Tile title="Acciones" icon="mdi mdi-lightning-bolt" class="m-2" to="/actions" />
    <Tile
      title="Canchas"
      icon="mdi mdi-soccer-field"
      class="m-2"
      to="/courts"
    />
  </div>
</template>