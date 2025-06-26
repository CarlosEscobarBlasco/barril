<template>
  <div class="h-100">
    <table class="table table-striped mb-0">
      <thead style="position: sticky; top: 0; background: white; z-index: 10">
        <tr>
          <th scope="col">Acción</th>
          <th scope="col">Realizadas</th>
          <th scope="col">Recibido</th>
        </tr>
      </thead>
      <tbody class="text-center">
        <tr v-for="(item, index) in actions" :key="index">
          <td>{{ item.action }}</td>
          <td>{{ item.done }}</td>
          <td>{{ item.received }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  actions: {
    type: Array,
    required: true,
    default: () => []
  }
});
</script>
