<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { supabase } from "../supabase";
import { useHeaderStore } from "@/stores/useHeaderStore";
import BaseModal from "@/components/baseModal.vue";

const store = useHeaderStore();

const actions = ref([]);
const newActionName = ref("");
const selectedAction = ref(null);
const editedName = ref("");

const editModalRef = ref();
const deleteModalRef = ref();

const loadActions = async () => {
  const { data } = await supabase
    .from("action")
    .select("id, name")
    .order("name");
  actions.value = data || [];
};

const addAction = async () => {
  const name = newActionName.value.trim();
  if (!name) return;
  await supabase.from("action").insert({ name });
  newActionName.value = "";
  await loadActions();
};

const openEditModal = (action) => {
  selectedAction.value = action;
  editedName.value = action.name;
  editModalRef.value?.show();
};

const saveEditedAction = async () => {
  if (!editedName.value.trim()) return;
  await supabase
    .from("action")
    .update({ name: editedName.value.trim() })
    .eq("id", selectedAction.value.id);
  await loadActions();
};

const openDeleteModal = (action) => {
  selectedAction.value = action;
  deleteModalRef.value?.show();
};

const deleteAction = async () => {
  try {
    const { error } = await supabase
      .from("action")
      .delete()
      .eq("id", selectedAction.value.id);
    if (error) throw error;
    await loadActions();
  } catch (e) {
    alert("No se puede borrar la acción, algún partido la esta usando");
  }
};

onMounted(() => {
  loadActions();
  store.setTitle("Acciones");
});

onUnmounted(() => {
  store.setTitle("");
});
</script>

<template>
  <div class="d-flex flex-column h-100 p-3 gap-2">
    <div class="d-flex mb-3">
      <input
        v-model="newActionName"
        type="text"
        class="form-control me-2"
        placeholder="Nueva acción"
        @keyup.enter="addAction"
      />
      <button class="btn btn-success" @click="addAction">
        <i class="mdi mdi-plus"></i>
      </button>
    </div>

    <div
      class="d-flex flex-column overflow-auto shadow-sm h-100 border"
      style="max-height: 70vh"
    >
      <template v-if="actions.length > 0">
        <div
          v-for="action in actions"
          :key="action.id"
          class="d-flex justify-content-between align-items-center p-2 bg-white border border-light"
        >
          <span>{{ action.name }}</span>
          <div>
            <button
              class="btn btn-sm btn-outline-primary me-2"
              @click="openEditModal(action)"
              title="Editar"
            >
              <i class="mdi mdi-pencil"></i>
            </button>
            <button
              class="btn btn-sm btn-outline-danger"
              @click="openDeleteModal(action)"
              title="Eliminar"
            >
              <i class="mdi mdi-delete"></i>
            </button>
          </div>
        </div>
      </template>
      <div v-else class="text-center p-3 text-muted fst-italic">
        No hay acciones.
      </div>
    </div>

    <BaseModal ref="editModalRef" @accept="saveEditedAction" @cancel="() => {}">
      <div>
        <label class="form-label">Renombrar acción</label>
        <input type="text" class="form-control" v-model="editedName" />
      </div>
    </BaseModal>

    <BaseModal ref="deleteModalRef" @accept="deleteAction" @cancel="() => {}">
      <p>
        ¿Estás seguro de que deseas eliminar la acción
        <strong>{{ selectedAction?.name }}</strong
        >?
      </p>
    </BaseModal>
  </div>
</template>
