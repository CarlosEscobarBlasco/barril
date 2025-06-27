<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { supabase } from "../supabase";
import { useHeaderStore } from "@/stores/useHeaderStore";
import BaseModal from "@/components/baseModal.vue";

const store = useHeaderStore();

const players = ref([]);
const newPlayerName = ref("");
const selectedPlayer = ref(null);
const editedName = ref("");

const editModalRef = ref();
const deleteModalRef = ref();

const loadPlayers = async () => {
  const { data } = await supabase
    .from("player")
    .select("id, name")
    .order("name");
  players.value = data || [];
};

const addPlayer = async () => {
  const name = newPlayerName.value.trim();
  if (!name) return;
  await supabase.from("player").insert({ name });
  newPlayerName.value = "";
  await loadPlayers();
};

const openEditModal = (player) => {
  selectedPlayer.value = player;
  editedName.value = player.name;
  editModalRef.value?.show();
};

const saveEditedPlayer = async () => {
  if (!editedName.value.trim()) return;
  await supabase
    .from("player")
    .update({ name: editedName.value.trim() })
    .eq("id", selectedPlayer.value.id);
  await loadPlayers();
};

const openDeleteModal = (player) => {
  selectedPlayer.value = player;
  deleteModalRef.value?.show();
};

const deletePlayer = async () => {
  try {
    const { error } = await supabase
      .from("player")
      .delete()
      .eq("id", selectedPlayer.value.id);
    if (error) throw error;
    await loadPlayers();
  } catch (e) {
    alert("El jugador pertenece a algún partido y no se puede borrar");
    console.warn("Error deleting player:", e);
  }
};

onMounted(() => {
  loadPlayers();
  store.setTitle("Jugadores");
});

onUnmounted(() => {
  store.setTitle("");
});
</script>

<template>
  <div class="d-flex flex-column h-100 p-3 gap-2">
    <div class="d-flex mb-3">
      <input
        v-model="newPlayerName"
        type="text"
        class="form-control me-2"
        placeholder="Nuevo jugador"
        @keyup.enter="addPlayer"
      />
      <button class="btn btn-success" @click="addPlayer">
        <i class="mdi mdi-plus"></i>
      </button>
    </div>

    <div
      class="d-flex flex-column overflow-auto shadow-sm h-100 border"
      style="max-height: 70vh"
    >
      <template v-if="players.length > 0">
        <div
          v-for="player in players"
          :key="player.id"
          class="d-flex justify-content-between align-items-center p-2 bg-white border border-light"
        >
          <span>{{ player.name }}</span>
          <div>
            <button
              class="btn btn-sm btn-outline-primary me-2"
              @click="openEditModal(player)"
              title="Editar"
            >
              <i class="mdi mdi-pencil"></i>
            </button>
            <button
              class="btn btn-sm btn-outline-danger"
              @click="openDeleteModal(player)"
              title="Eliminar"
            >
              <i class="mdi mdi-delete"></i>
            </button>
          </div>
        </div>
      </template>
      <div v-else class="text-center p-3 text-muted fst-italic">
        No hay jugadores.
      </div>
    </div>

    <!-- Modal editar -->
    <BaseModal
      ref="editModalRef"
      title="Editar jugador"
      @accept="saveEditedPlayer"
      @cancel="() => {}"
    >
      <div>
        <label class="form-label">Nuevo nombre</label>
        <input type="text" class="form-control" v-model="editedName" />
      </div>
    </BaseModal>

    <!-- Modal eliminar -->
    <BaseModal
      ref="deleteModalRef"
      title="Eliminar jugador"
      @accept="deletePlayer"
      @cancel="() => {}"
    >
      <p>
        ¿Estás seguro de que deseas eliminar a
        <strong>{{ selectedPlayer?.name }}</strong
        >?
      </p>
    </BaseModal>
  </div>
</template>
