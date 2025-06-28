<script setup>
import Tile from "../components/Tile.vue";
import { onMounted, onUnmounted } from "vue";
import { useHeaderStore } from "@/stores/useHeaderStore";

const store = useHeaderStore();

onMounted(async () => {
  store.setTitle("Estadísticas");
});

onUnmounted(() => {
  store.setTitle("");
});
</script>

<template>
  <div
    class="d-flex flex-column justify-content-center align-items-center p-3 overflow-auto"
  >
    <Tile title="Jugadores" icon="mdi mdi-tshirt-v-outline" class="m-2" to="/player-stats" />
    <Tile title="Totales" icon="mdi mdi-podium" class="m-2" to="/total-stats" />
  </div>
</template>