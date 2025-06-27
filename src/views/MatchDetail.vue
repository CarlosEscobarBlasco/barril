<script setup>
import { ref, onMounted, useTemplateRef, computed, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { supabase } from "@/supabase";
import { useHeaderStore } from "@/stores/useHeaderStore";
import Multiselect from "vue-multiselect";
import Collapsible from "@/components/Collapsible.vue";
import PlayerActionsTable from "@/components/PlayerActionsTable.vue";
import BaseModal from "@/components/BaseModal.vue";
import "vue-multiselect/dist/vue-multiselect.min.css";

const router = useRouter();
const route = useRoute();
const matchId = route.params.id;

const playerActions = ref([]);
const players = ref([]);
const actions = ref([]);
const matchPlayers = ref([]);
const matchDetails = ref({});

const selectedActor = ref(null);
const selectedAction = ref(null);
const selectedTarget = ref(null);
const actionToDelete = ref(null);

const modalRef = ref(null);
const modalDeleteMatch = ref(null);
const modalAddPlayers = ref(null);

const actorSelect = useTemplateRef("actorSelect");
const actionSelect = useTemplateRef("actionSelect");

const store = useHeaderStore();

const loadData = async () => {
  const [{ data: pa }, { data: ma }, { data: pm }, { data: ps }, { data: ac }] =
    await Promise.all([
      supabase
        .from("player_action")
        .select("*")
        .eq("match_id", matchId)
        .order("id", { ascending: false }),
      supabase.from("match").select("*").eq("id", matchId),
      supabase.from("player_match").select("*").eq("match_id", matchId),
      supabase.from("player").select("id, name"),
      supabase.from("action").select("id, name"),
    ]);

  matchDetails.value = ma[0] || {};
  playerActions.value = pa || [];
  players.value = ps || [];
  actions.value = ac || [];
  matchPlayers.value = pm || [];

  matchPlayers.value = (pm || []).map((playerMatch) => {
    return players.value.find((p) => p.id === playerMatch.player_id);
  });

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

  playerActions.value.unshift(...data);
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
  return player ? player.name : "-";
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

  modalRef.value.show();
};

const cancelDelete = () => {
  actionToDelete.value = null;
  modalRef.value.hide();
};

const confirmDelete = async () => {
  if (!actionToDelete.value) return;

  const { error } = await supabase
    .from("player_action")
    .delete()
    .eq("id", actionToDelete.value.id);

  playerActions.value = playerActions.value.filter(
    (a) => a.id !== actionToDelete.value.id
  );

  actionToDelete.value = null;
  showModal.value = false;
};

const onRequestDeleteMatch = (actionId) => {
  modalDeleteMatch.value.show();
};

const confirmDeleteMatch = async () => {
  const { error } = await supabase.from("match").delete().eq("id", matchId);

  router.back();
};

const cancelDeleteMatch = () => {
  modalDeleteMatch.value.hide();
};

const confirmAddPlayers = () => {
  modalAddPlayers.value.hide();
};

const addPlayer = async (player) => {
  const exists = matchPlayers.value.some((p) => p.id === player.id);
  if (!exists) {
    const { data, error } = await supabase
      .from("player_match")
      .insert([
        {
          player_id: player.id,
          match_id: matchId,
        },
      ])
      .select();
    if (!error) {
      matchPlayers.value.push(player);
    }
  }
};

const removePlayer = async (player) => {
  const { error } = await supabase.from("player_match").delete().match({
    player_id: player.id,
    match_id: matchId,
  });
  if (!error) {
    matchPlayers.value = matchPlayers.value.filter((p) => p.id !== player.id);
  }
};

function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // los meses empiezan en 0
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

onMounted(async () => {
  await loadData();
  if (matchPlayers.value.length === 0) {
    modalAddPlayers.value.show();
  }
});

onUnmounted(() => {
  store.setTitle("");
});
</script>

<template>
  <div class="d-flex flex-column p-3 h-100">
    <div class="d-flex flex-column gap-3 mb-4">
      <div>
        <label>Jugador*</label>
        <Multiselect
          ref="actorSelect"
          v-model="selectedActor"
          :options="matchPlayers"
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
          :options="matchPlayers"
          label="name"
          track-by="id"
          placeholder="Objetivo"
        />
      </div>

      <button
        ref="saveButton"
        class="btn btn-primary"
        @click="saveAction"
        :disabled="!selectedActor || !selectedAction"
      >
        Guardar
      </button>
    </div>

    <hr />

    <Collapsible :title="'Jugadores (' + matchPlayers.length + ')'">
      <Multiselect
        :options="players"
        label="name"
        track-by="id"
        placeholder="Añadir jugador"
        @select="addPlayer"
      />
      <ul class="list-group mt-3" v-if="matchPlayers.length">
        <li
          v-for="player in matchPlayers"
          :key="player.id"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          {{ player.name }}
          <button
            class="btn btn-sm btn-outline-danger"
            @click="removePlayer(player)"
          >
            <i class="bi bi-trash"></i>
          </button>
        </li>
      </ul>
    </Collapsible>
    <small v-if="matchPlayers.length < 10" class="text-danger">
      El partido tiene menos de 10 jugadores
    </small>

    <Collapsible
      class="mt-3"
      :title="'Acciones (' + playerActions.length + ')'"
    >
      <PlayerActionsTable
        :actions="preparedActions"
        @deleteAction="onRequestDelete"
      />
    </Collapsible>

    <hr />

    <button class="btn btn-danger mt-5" @click="onRequestDeleteMatch">
      Eliminar partido
    </button>

    <BaseModal
      ref="modalRef"
      title="Confirmar borrado"
      @accept="confirmDelete"
      @cancel="cancelDelete"
    >
      <div class="modal-body">
        <p>¿Seguro que quieres borrar esta acción?</p>
        <ul>
          <li><strong>Jugador:</strong> {{ actionToDelete?.actorName }}</li>
          <li><strong>Acción:</strong> {{ actionToDelete?.actionName }}</li>
          <li><strong>Objetivo:</strong> {{ actionToDelete?.targetName }}</li>
        </ul>
      </div>
    </BaseModal>

    <BaseModal
      ref="modalDeleteMatch"
      title="⚠ Confirmar borrado ⚠"
      @accept="confirmDeleteMatch"
      @cancel="cancelDeleteMatch"
    >
      <div class="modal-body">
        <p>¿Seguro que quieres borrar este partido?</p>
        <p class="text-danger">
          Se perderan todas las estadisticas asociadas a este partido!
        </p>
      </div>
    </BaseModal>

    <BaseModal
      ref="modalAddPlayers"
      title="Añadir jugadores al partido"
      disable-cancel
      @accept="confirmAddPlayers"
    >
      <div class="modal-body">
        <p v-if="matchPlayers.length === 0">El partido debe tener jugadores</p>
        <p v-else>Añadir mas jugadores</p>
        <Multiselect
          :options="players"
          label="name"
          track-by="id"
          placeholder="Añadir jugador"
          @select="addPlayer"
        />
        <ul class="list-group mt-3" v-if="matchPlayers.length">
          <li
            v-for="player in matchPlayers"
            :key="player.id"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            {{ player.name }}
            <button
              class="btn btn-sm btn-outline-danger"
              @click="removePlayer(player)"
            >
              <i class="bi bi-trash"></i>
            </button>
          </li>
        </ul>
      </div>
    </BaseModal>
  </div>
</template>
