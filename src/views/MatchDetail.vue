<script setup>
import { ref, onMounted, useTemplateRef, computed, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "../supabase";
import { useHeaderStore } from "@/stores/useHeaderStore";
import Multiselect from "vue-multiselect";
import Collapsible from "../components/Collapsible.vue";
import PlayerActionsTable from "../components/PlayerActionsTable.vue";
import "vue-multiselect/dist/vue-multiselect.min.css";

const route = useRoute();
const matchId = route.params.id;

const playerActions = ref([]);
const players = ref([]);
const actions = ref([]);
const matchDetails = ref({});

const selectedActor = ref(null);
const selectedAction = ref(null);
const selectedTarget = ref(null);
const actionToDelete = ref(null);
const showModal = ref(false);

const actorSelect = useTemplateRef("actorSelect");
const actionSelect = useTemplateRef("actionSelect");
const targetSelect = useTemplateRef("targetSelect");

const store = useHeaderStore();

const loadData = async () => {
  const [{ data: pa }, { data: ma }, { data: ps }, { data: ac }] =
    await Promise.all([
      supabase
        .from("player_action")
        .select("*")
        .eq("match_id", matchId)
        .order("id", { ascending: false }),
      supabase.from("match").select("*").eq("id", matchId),
      supabase.from("player").select("id, name, nickname"),
      supabase.from("action").select("id, name"),
    ]);

  matchDetails.value = ma[0] || {};
  playerActions.value = pa || [];
  players.value = ps || [];
  actions.value = ac || [];
  store.setTitle("Partido: " + formatDate(matchDetails.value.date));
};

const saveAction = async () => {
  const { data, error } = await supabase
    .from("player_action")
    .insert([
      {
        actor_player_id: selectedActor.value.id,
        action_id: selectedAction.value.id,
        target_player_id: selectedTarget.value?.id,
        match_id: matchId,
      },
    ])
    .select();

  if (error) {
    console.error("Error inserting match:", error.message);
    return;
  }
  playerActions.value.push(...data);
  selectedActor.value = null;
  selectedAction.value = null;
  selectedTarget.value = null;
};

const onSelect = (nextRef) => {
  setTimeout(() => {
    nextRef?.$el?.querySelector("input")?.focus();
  }, 0);
};

const getPlayerName = (id) => {
  const player = players.value.find((p) => p.id === id);
  return player ? player.name || player.nickname || "-" : "-";
};

const getActionName = (id) => {
  const action = actions.value.find((a) => a.id === id);
  return action ? action.name : "-";
};

const preparedActions = computed(() =>
  playerActions.value.map((action) => ({
    id: action.id,
    actorName: getPlayerName(action.actor_player_id),
    actionName: getActionName(action.action_id),
    targetName: getPlayerName(action.target_player_id),
  }))
);

const onRequestDelete = (actionId) => {
  const rawAction = playerActions.value.find((a) => a.id === actionId);
  if (!rawAction) return;

  actionToDelete.value = {
    id: rawAction.id,
    actorName: getPlayerName(rawAction.actor_player_id),
    actionName: getActionName(rawAction.action_id),
    targetName: getPlayerName(rawAction.target_player_id),
  };

  showModal.value = true;
};

const cancelDelete = () => {
  actionToDelete.value = null;
  showModal.value = false;
};

const confirmDelete = async () => {
  if (!actionToDelete.value) return;

  const { error } = await supabase
    .from("player_action")
    .delete()
    .eq("id", actionToDelete.value.id);

  if (error) {
    console.error("Error deleting action:", error.message);
    return;
  }

  playerActions.value = playerActions.value.filter(
    (a) => a.id !== actionToDelete.value.id
  );
  actionToDelete.value = null;
  showModal.value = false;
};

function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // los meses empiezan en 0
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

onMounted(() => {
  loadData();
});

onUnmounted(() => {
  store.setTitle("");
});
</script>

<template>
  <div class="p-3 d-flex flex-column h-100">
    <div class="d-flex gap-3 flex-column mb-4">
      <div>
        <label>Jugador*</label>
        <Multiselect
          ref="actorSelect"
          v-model="selectedActor"
          :options="players"
          label="name"
          track-by="id"
          placeholder="Jugador"
          @select="onSelect(actionSelect)"
        />
      </div>

      <div>
        <label>Acción*</label>
        <Multiselect
          ref="actionSelect"
          v-model="selectedAction"
          :options="actions"
          label="name"
          track-by="id"
          placeholder="Acción"
        />
      </div>

      <div>
        <label>Objetivo</label>
        <Multiselect
          v-model="selectedTarget"
          :options="players"
          label="name"
          track-by="id"
          placeholder="Objetivo"
        />
      </div>

      <button ref="saveButton" class="btn btn-primary" @click="saveAction">
        Guardar
      </button>
    </div>
    <hr />
    <Collapsible :title="'Acciones (' + playerActions.length + ')'">
      <PlayerActionsTable
        :actions="preparedActions"
        @deleteAction="onRequestDelete"
      />
    </Collapsible>
    <hr />
    <button class="btn btn-danger mt-5" @click="saveAction">
      Eliminar partido
    </button>
  </div>

  <div
    class="modal fade"
    tabindex="-1"
    :class="{ show: showModal }"
    :style="{ display: showModal ? 'block' : 'none' }"
    aria-modal="true"
    role="dialog"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirmar borrado</h5>
          <button
            type="button"
            class="btn-close"
            @click="cancelDelete"
          ></button>
        </div>
        <div class="modal-body">
          <p>¿Seguro que quieres borrar esta acción?</p>
          <ul>
            <li><strong>Jugador:</strong> {{ actionToDelete?.actorName }}</li>
            <li><strong>Acción:</strong> {{ actionToDelete?.actionName }}</li>
            <li><strong>Objetivo:</strong> {{ actionToDelete?.targetName }}</li>
          </ul>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="cancelDelete">
            Cancelar
          </button>
          <button type="button" class="btn btn-danger" @click="confirmDelete">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
