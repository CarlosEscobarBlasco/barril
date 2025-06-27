<template>
  <div class="max-w-4xl mx-auto p-6">
    <Multiselect
      v-model="selectedAction"
      :options="actions"
      label="name"
      track-by="id"
      placeholder="Accion"
      :searchable="true"
      class="mb-8"
    />

    <div v-if="playerStats.length" class="grid md:grid-cols-2 mt-5">
      <Collapsible class="mt-3" title="Realizados">
        <table class="w-100 bg-white">
          <thead>
            <tr>
              <th class="p-3 border-b border-green-300 text-left">Jugador</th>
              <th
                class="p-3 text-center"
                style="cursor: pointer"
                @click="actorSortAsc = !actorSortAsc"
              >
                Cantidad
                <span>{{ actorSortAsc ? "↑" : "↓" }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(p, index) in sortedActors"
              :key="p.player_id"
              :class="[
                index === 0
                  ? 'gold-row'
                  : index === 1
                  ? 'silver-row'
                  : index === 2
                  ? 'bronze-row'
                  : '',
                'align-middle',
              ]"
            >
              <td class="p-3">{{ p.player_name }}</td>
              <td class="p-3 text-center">
                {{ p.as_actor }}
              </td>
            </tr>
          </tbody>
        </table>
      </Collapsible>
      <Collapsible class="mt-3" title="Objetivo">
        <table class="w-100 bg-white">
          <thead>
            <tr>
              <th class="p-3 text-left">Jugador</th>
              <th
                class="p-3 text-center"
                style="cursor: pointer"
                @click="targetSortAsc = !targetSortAsc"
              >
                Cantidad
                <span>{{ targetSortAsc ? "↑" : "↓" }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(p, index) in sortedTargets"
              :key="p.player_id"
              :class="[
                index === 0
                  ? 'gold-row'
                  : index === 1
                  ? 'silver-row'
                  : index === 2
                  ? 'bronze-row'
                  : '',
                'align-middle',
              ]"
            >
              <td class="p-3">{{ p.player_name }}</td>
              <td class="p-3 text-center">
                {{ p.as_target }}
              </td>
            </tr>
          </tbody>
        </table>
      </Collapsible>
    </div>
    <p v-else class="mt-5 w-100 text-center text-secondary">
      Seleccione una acción para ver sus estadisticas
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, onUnmounted } from "vue";
import { supabase } from "@/supabase";
import Multiselect from "vue-multiselect";
import Collapsible from "@/components/Collapsible.vue";
import { useHeaderStore } from "@/stores/useHeaderStore";

const store = useHeaderStore();

const actions = ref([]);
const selectedAction = ref(null);
const playerStats = ref([]);

const actorSortAsc = ref(false);
const targetSortAsc = ref(true);

const fetchActions = async () => {
  const { data, error } = await supabase
    .from("action")
    .select("*")
    .order("name");
  if (!error) actions.value = data;
};

const fetchPlayerStats = async () => {
  if (!selectedAction.value) {
    playerStats.value = [];
    return;
  }
  const { data, error } = await supabase.rpc("get_action_player_stats", {
    action_id: selectedAction.value.id,
  });
  if (!error && data) playerStats.value = data;
  else playerStats.value = [];

  store.setTitle("Estadisticas: " + selectedAction.value.name);
};

const sortedActors = computed(() => {
  const list = [...playerStats.value].filter((p) => p.as_actor > 0);
  return list.sort((a, b) =>
    actorSortAsc.value ? a.as_actor - b.as_actor : b.as_actor - a.as_actor
  );
});

const sortedTargets = computed(() => {
  const list = [...playerStats.value].filter((p) => p.as_target > 0);
  return list.sort((a, b) =>
    targetSortAsc.value ? a.as_target - b.as_target : b.as_target - a.as_target
  );
});

onMounted(async () => {
  fetchActions();
  store.setTitle("Estadisticas");
});

onUnmounted(() => {
  store.setTitle("");
});

watch(selectedAction, fetchPlayerStats);
</script>

<style scoped>
.gold-row {
  background-color: rgba(255, 215, 0, 0.2);
}

.silver-row {
  background-color: rgba(192, 192, 192, 0.2);
}

.bronze-row {
  background-color: rgba(205, 127, 50, 0.2);
}

tbody tr:nth-child(even) {
  background-color: rgba(0, 0, 0, 0.03);
}
</style>
