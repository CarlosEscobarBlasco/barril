<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useHeaderStore } from "@/stores/useHeaderStore";
import * as bootstrap from "bootstrap";
import { supabase } from "../supabase";
import Match from "../components/Match.vue";

const modalElement = ref(null);
let modalInstance = null;

const matchDate = ref("");
const selectedLocation = ref("");
const matches = ref([]);
const locations = ref([]);
const store = useHeaderStore();

const openModal = () => {
  matchDate.value = "";
  selectedLocation.value = "";
  if (modalInstance) modalInstance.show();
};

const handleSubmit = async () => {
  const { data, error } = await supabase
    .from("match")
    .insert([{ date: matchDate.value, location: selectedLocation.value.id }])
    .select();

  if (error) {
    console.error("Error inserting match:", error.message);
    return;
  }

  matches.value.unshift({ ...data[0], locationName: selectedLocation.value.name });
  modalInstance.hide();
};

const loadData = async () => {
  const [{ data: mt }, { data: loc }] = await Promise.all([
    supabase.from("match").select("*").order("id", { ascending: false }),
    supabase.from("location").select("id, name"),
  ]);

  locations.value = loc || [];

  matches.value = (mt || []).map((match) => {
    const locationName =
      locations.value.find((l) => l.id === match.location)?.name || "-";
    return {
      ...match,
      locationName,
    };
  });
};

onMounted(async () => {
  modalInstance = new bootstrap.Modal(modalElement.value);
  store.setTitle("Partidos");
  await loadData();
});

onUnmounted(() => {
  store.setTitle("");
});
</script>

<template>
  <div class="d-flex flex-column align-items-center h-100 p-3">
    <div class="d-flex flex-column col-12 col-lg-6 gap-3">
      <Match v-for="match in matches" :key="match.id" :match="match" />
    </div>

    <button
      class="btn btn-primary rounded-circle position-fixed"
      style="
        bottom: 20px;
        right: 20px;
        width: 56px;
        height: 56px;
        z-index: 1050;
      "
      @click="openModal"
    >
      <i class="bi bi-plus-lg fs-4"></i>
    </button>

    <div
      class="modal fade"
      id="createMatchModal"
      tabindex="-1"
      aria-labelledby="createMatchModalLabel"
      aria-hidden="true"
      ref="modalElement"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createMatchModalLabel">
              Crear partido
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="dateInput" class="form-label">Fecha</label>
                <input
                  type="date"
                  id="dateInput"
                  class="form-control"
                  v-model="matchDate"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="locationSelect" class="form-label">Lugar</label>
                <select
                  id="locationSelect"
                  class="form-select"
                  v-model="selectedLocation"
                  required
                >
                  <option
                    v-for="location in locations"
                    :key="location.id"
                    :value="location"
                  >
                    {{ location.name }}
                  </option>
                </select>
              </div>
              <div class="modal-footer px-0">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancelar
                </button>
                <button type="submit" class="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
