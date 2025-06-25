<template>
  <div class="table-responsive h-100 overflow-auto">
    <table class="table table-striped table-bordered mb-0">
      <thead class="table-primary text-center sticky-top">
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
