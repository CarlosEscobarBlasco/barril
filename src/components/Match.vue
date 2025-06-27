<template>
  <router-link
    :to="`${currentPath}/${match.id}`"
    class="card match-card text-decoration-none position-relative border-1 shadow-sm col-12 mx-auto"
  >
    <!-- Icono de fondo -->
    <span class="mdi mdi-soccer-field icon-background"></span>

    <!-- Contenido -->
    <div
      class="card-body d-flex flex-column text-center position-relative z-1 p-1 justify-content-center"
    >
      <h5 class="fw-bold text-primary mb-3">{{ formattedDate }}</h5>
      <h6 class="text-muted mb-0">{{ match.locationName }}</h6>
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
  return `${
    dayName.charAt(0).toUpperCase() + dayName.slice(1)
  }, ${day}/${month}/${year}`;
});
</script>

<style scoped>
.match-card {
  border-radius: 1rem;
  min-height: 160px;
  transition: all 0.2s ease-in-out;
  overflow: hidden;
}

.match-card:hover {
  background-color: #e7f1ff;
  transform: translateY(-3px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
}

/* Icono de fondo */
.icon-background {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 10rem;
  color: #0d6dfd0f; /* Muy suave */
  transform: translate(-50%, -50%);
  pointer-events: none;
  user-select: none;
  z-index: 0;
}
</style>
