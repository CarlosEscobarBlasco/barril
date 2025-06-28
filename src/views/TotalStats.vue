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
              :class="['align-middle']"
            >
              <td class="p-3 d-flex align-items-center">
                <span
                  :class="[
                    index === 0 ? 'dot-gold' : index === 1 ? 'dot-silver' : index === 2 ? 'dot-bronze' : '',
                    'status-dot'
                  ]"
                ></span>
                {{ p.player_name }}
              </td>
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
              :class="['align-middle']"
            >
              <td class="p-3 d-flex align-items-center">
                <span
                  :class="[
                    index === 0 ? 'dot-gold' : index === 1 ? 'dot-silver' : index === 2 ? 'dot-bronze' : '',
                    'status-dot'
                  ]"
                ></span>
                {{ p.player_name }}
              </td>
              <td class="p-3 text-center">
                {{ p.as_target }}
              </td>
            </tr>
          </tbody>
        </table>
      </Collapsible>
    </div>
    <p v-else class="mt-5 w-100 text-center text-secondary">
      Seleccione una acción para ver sus estadísticas
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
  const { data, error } = await supabase.rpc("get_action_counts_per_player", {
    p_action_id: selectedAction.value.id,
  });
  if (!error && data) playerStats.value = data;
  else playerStats.value = [];

  store.setTitle("Estadísticas: " + selectedAction.value.name);
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
  store.setTitle("Estadísticas");
});

onUnmounted(() => {
  store.setTitle("");
});

watch(selectedAction, fetchPlayerStats);
</script>

<style scoped>
/* Quitar fondo de filas */
.gold-row,
.silver-row,
.bronze-row {
  background-color: transparent;
}

/* Puntito pequeño al lado del nombre */
.status-dot {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
}

/* Colores de las bolitas */
.dot-gold {
  background-color: #ffd700; /* Oro */
}
.dot-silver {
  background-color: #c0c0c0; /* Plata */
}
.dot-bronze {
  background-color: #cd7f32; /* Bronce */
}

/* Filas alternas para tabla */
tbody tr:nth-child(even) {
  background-color: rgba(0, 0, 0, 0.03);
}
</style>
