<template>
  <router-link
    :to="`${currentPath}/${match.id}`"
    class="match-card text-decoration-none bg-white"
  >
    <div class="d-flex flex-column text-center">
      <h5 class="mb-2 fw-bold text-primary">{{ formattedDate }}</h5>
      <h6 class="mb-0 text-muted">{{ match.location }}</h6>
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
  background-color: #f8f9fa;
  border: 2px solid #0d6efd30;
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

.match-card:hover {
  background-color: #e7f1ff;
  border-color: #0d6efd;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
