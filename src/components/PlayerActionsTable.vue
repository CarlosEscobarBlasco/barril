<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  actions: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["deleteAction"]);

const handleDelete = (id) => {
  emit("deleteAction", id);
};
</script>

<template>
  <div style="max-height: 300px; overflow-y: auto">
    <table class="table table-striped mb-0">
      <thead style="position: sticky; top: 0; background: white; z-index: 10">
        <tr>
          <th>Jugador</th>
          <th>Acción</th>
          <th>Objetivo</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="action in actions" :key="action.id">
          <td>{{ action.actorName }}</td>
          <td>{{ action.actionName }}</td>
          <td>{{ action.targetName }}</td>
          <td>
            <button
              class="btn btn-sm btn-danger"
              @click="handleDelete(action.id)"
              title="Borrar"
            >
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
