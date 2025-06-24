<script setup>
import Tile from "../../components/Tile.vue";
</script>

<template>
  <div
    class="d-flex flex-column justify-content-center align-items-center h-100 p-3"
  >
    <Tile
      title="Partidos"
      icon="bi bi-calendar"
      class="m-2"
      to="/matches"
    />
    <Tile title="Administracion" icon="bi bi-people" class="m-2" to="/admin" />
    <Tile title="Estadisticas" icon="bi bi-graph-up" class="m-2" to="/stats" />
  </div>
</template>

<script>
export default {
  name: "Dashboard",
};
</script>
