<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { supabase } from "../supabase";
import { useHeaderStore } from "@/stores/useHeaderStore";
import BaseModal from "@/components/baseModal.vue";

const store = useHeaderStore();

const courts = ref([]);
const newCourtName = ref("");
const selectedCourt = ref(null);
const editedName = ref("");

const editModalRef = ref();
const deleteModalRef = ref();

const loadCourts = async () => {
  const { data } = await supabase
    .from("location")
    .select("id, name")
    .order("name");
  courts.value = data || [];
};

const addCourt = async () => {
  const name = newCourtName.value.trim();
  if (!name) return;
  await supabase.from("location").insert({ name });
  newCourtName.value = "";
  await loadCourts();
};

const openEditModal = (court) => {
  selectedCourt.value = court;
  editedName.value = court.name;
  editModalRef.value?.show();
};

const saveEditedCourt = async () => {
  if (!editedName.value.trim()) return;
  await supabase
    .from("location")
    .update({ name: editedName.value.trim() })
    .eq("id", selectedCourt.value.id);
  await loadCourts();
};

const openDeleteModal = (court) => {
  selectedCourt.value = court;
  deleteModalRef.value?.show();
};

const deleteCourt = async () => {
  try {
    const { error } = await supabase
      .from("location")
      .delete()
      .eq("id", selectedCourt.value.id);
    if (error) throw error;
    await loadCourts();
  } catch (e) {
    alert("No se puede borrar la cancha, algún partido la está usando.");
  }
};

onMounted(() => {
  loadCourts();
  store.setTitle("Canchas");
});

onUnmounted(() => {
  store.setTitle("");
});
</script>

<template>
  <div class="d-flex flex-column h-100 p-3 gap-2">
    <div class="d-flex mb-3">
      <input
        v-model="newCourtName"
        type="text"
        class="form-control me-2"
        placeholder="Nueva cancha"
        @keyup.enter="addCourt"
      />
      <button class="btn btn-success" @click="addCourt">
        <i class="mdi mdi-plus"></i>
      </button>
    </div>

    <div
      class="d-flex flex-column overflow-auto shadow-sm h-100 border"
      style="max-height: 70vh"
    >
      <template v-if="courts.length > 0">
        <div
          v-for="court in courts"
          :key="court.id"
          class="d-flex justify-content-between align-items-center p-2 bg-white border border-light"
        >
          <span>{{ court.name }}</span>
          <div>
            <button
              class="btn btn-sm btn-outline-primary me-2"
              @click="openEditModal(court)"
              title="Editar"
            >
              <i class="mdi mdi-pencil"></i>
            </button>
            <button
              class="btn btn-sm btn-outline-danger"
              @click="openDeleteModal(court)"
              title="Eliminar"
            >
              <i class="mdi mdi-delete"></i>
            </button>
          </div>
        </div>
      </template>
      <div v-else class="text-center p-3 text-muted fst-italic">
        No hay canchas.
      </div>
    </div>

    <BaseModal ref="editModalRef" @accept="saveEditedCourt" @cancel="() => {}">
      <div>
        <label class="form-label">Renombrar cancha</label>
        <input type="text" class="form-control" v-model="editedName" />
      </div>
    </BaseModal>

    <BaseModal ref="deleteModalRef" @accept="deleteCourt" @cancel="() => {}">
      <p>
        ¿Estás seguro de que deseas eliminar la cancha
        <strong>{{ selectedCourt?.name }}</strong
        >?
      </p>
    </BaseModal>
  </div>
</template>
