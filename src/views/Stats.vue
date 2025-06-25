<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useHeaderStore } from "@/stores/useHeaderStore";
import { supabase } from "../supabase";
import Multiselect from "vue-multiselect";
import StatsTable from "../components/StatsTable.vue";

const store = useHeaderStore();

const players = ref([]);
const actions = ref([]);
const selectedPlayer = ref(null);

const loadData = async () => {
  const [{ data: ps }, { data: ac }] = await Promise.all([
    supabase.from("player").select("id, name, nickname"),
    supabase.from("action").select("id, name"),
  ]);
  players.value = ps || [];
  actions.value = ac || [];
};

const loadStats = async (player) => {
  //TODO
};

onMounted(async () => {
  loadData();
  store.setTitle("Estadisticas");
});

onUnmounted(() => {
  store.setTitle("");
});

const stats = [
  { action: 'Gol', done: 5, received: 2 },
  { action: 'Asistencia', done: 3, received: 1 },
  { action: 'Falta', done: 2, received: 4 },
  { action: 'Tarjeta amarilla', done: 1, received: 0 },
  { action: 'Tarjeta roja', done: 0, received: 1 },
  { action: 'Penalti', done: 1, received: 1 },
  { action: 'Corner', done: 4, received: 3 },
  { action: 'Fuera de juego', done: 2, received: 2 },
  { action: 'Parada', done: 6, received: 1 },
  { action: 'Saque de banda', done: 3, received: 3 },
  { action: 'Gol en contra', done: 0, received: 2 },
  { action: 'Pase clave', done: 7, received: 0 },
  { action: 'Doble amarilla', done: 1, received: 0 },
  { action: 'Sustitución', done: 2, received: 1 },
  { action: 'Penalti fallado', done: 0, received: 1 },
]

</script>

<template>
  <div class="d-flex flex-column p-3 overflow-auto h-100">
    <Multiselect
      v-model="selectedPlayer"
      :options="players"
      label="name"
      track-by="id"
      placeholder="Jugador"
      @select="loadStats"
    />

    <StatsTable :actions="stats" class="mt-3"></StatsTable>
  </div>
</template>

<script>
export default {
  name: "Stats",
};
</script>
