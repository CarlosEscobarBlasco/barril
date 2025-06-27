<template>
  <div class="p-6 max-w-3xl mx-auto">
    <Multiselect
      v-model="selectedPlayer"
      :options="players"
      :searchable="true"
      placeholder="Jugador"
      label="name"
      track-by="id"
      class="mb-6"
    />

    <p v-if="selectedPlayer" class="text-muted my-3">
      Partidos:
      <strong>{{ matchesWithPlayer }}</strong>
      ({{
        totalMatches > 0
          ? ((matchesWithPlayer / totalMatches) * 100).toFixed(1)
          : "0.0"
      }}%)
    </p>

    <table
      v-if="selectedPlayer && actionStats.length"
      class="w-full text-sm text-left border border-gray-200 shadow-sm rounded-md overflow-hidden w-100 mt-3"
    >
      <thead class="bg-gray-100 text-gray-700">
        <tr>
          <th class="p-3 border-b">Acción</th>
          <th class="p-3 border-b text-center">Realizado</th>
          <th class="p-3 border-b text-center">Objetivo</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="action in actionStats"
          :key="action.action_name"
          class="hover:bg-gray-50 transition"
        >
          <td class="p-3 border-b">{{ action.action_name }}</td>
          <td
            class="p-3 border-b text-center"
            style="background-color: rgba(121, 255, 121, 0.1)"
          >
            {{ action.as_actor }}
          </td>
          <td
            class="p-3 border-b text-center"
            style="background-color: rgba(255, 101, 101, 0.1)"
          >
            {{ action.as_target }}
          </td>
        </tr>
      </tbody>
    </table>
    <p class="mt-5 w-100 text-center text-secondary" v-else>
      Seleccione un jugador para ver sus estadisticas
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from "vue";
import { supabase } from "@/supabase";
import Multiselect from "vue-multiselect";
import { useHeaderStore } from "@/stores/useHeaderStore";

const store = useHeaderStore();

const players = ref([]);
const selectedPlayer = ref(null);
const actionStats = ref([]);
const totalMatches = ref(0);
const matchesWithPlayer = ref(0);

const fetchPlayers = async () => {
  const { data, error } = await supabase
    .from("player")
    .select("*")
    .order("name");
  if (!error) players.value = data;
};

const fetchStats = async () => {
  if (!selectedPlayer.value) return;
  const { data, error } = await supabase.rpc("get_action_stats", {
    player_id: selectedPlayer.value.id,
  });
  if (!error) actionStats.value = data;
  store.setTitle("Estadisticas: " + selectedPlayer.value.name);
};

const fetchMatchStats = async () => {
  if (!selectedPlayer.value) {
    totalMatches.value = 0;
    matchesWithPlayer.value = 0;
    return;
  }

  // Total de partidos
  const { data: all, error: errAll } = await supabase
    .from("match")
    .select("id");
  totalMatches.value = errAll ? 0 : all.length;

  // Partidos donde ha participado el jugador
  const { data: played, error: errPlayed } = await supabase
    .from("player_match")
    .select("match_id", { distinct: true })
    .eq("player_id", selectedPlayer.value.id);

  matchesWithPlayer.value = errPlayed ? 0 : played.length;
};

watch(selectedPlayer, () => {
  fetchStats();
  fetchMatchStats();
});

onMounted(async () => {
  fetchPlayers();
  store.setTitle("Estadisticas");
});

onUnmounted(() => {
  store.setTitle("");
});
</script>

<style scoped>
tbody tr:nth-child(even) {
  background-color: rgba(0, 0, 0, 0.03);
}
</style>
