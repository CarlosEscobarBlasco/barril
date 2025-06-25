<template>
  <main class="d-flex flex-column bg-light h-100">
    <div class="h-100 d-flex flex-column">
      <Header />
      <router-view />
    </div>
  </main>
</template>

<script setup>
import Header from "./components/Header.vue";
</script>
