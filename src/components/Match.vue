<template>
  <router-link
    :to="`${currentPath}/${match.id}`"
    class="match-card text-decoration-none position-relative overflow-hidden"
  >
    <!-- Icono de fondo -->
    <span class="mdi mdi-soccer-field icon-background"></span>

    <!-- Contenido -->
    <div class="d-flex flex-column text-center position-relative z-1">
      <h5 class="mb-2 fw-bold text-primary">{{ formattedDate }}</h5>
      <h6 class="mb-0 text-muted">{{ match.locationName }}</h6>
    </div>
  </router-link>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";

const props = defineProps({
  match: {
    type: Object,
    required: true,
  },
});

const route = useRoute();
const currentPath = route.path;

const formattedDate = computed(() => {
  const date = new Date(props.match.date);
  const dayName = date.toLocaleDateString("es-ES", { weekday: "long" });
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)}, ${day}/${month}/${year}`;
});
</script>

<style scoped>
.match-card {
  background-color: #ffffff;
  border: 2px solid #0d6efd30;
  border-radius: 1rem;
  padding: 2rem 1rem;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150px;
}

.match-card:hover {
  background-color: #e7f1ff;
  border-color: #0d6efd;
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
}

/* Icono de fondo */
.icon-background {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 8rem;
  color: #0d6efd10;
  transform: translate(-50%, -50%);
  pointer-events: none;
  user-select: none;
  z-index: 0;
}
</style>
