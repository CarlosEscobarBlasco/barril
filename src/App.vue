<template>
  <main class="d-flex flex-column min-vh-100">
    <!-- Header ocupa su espacio normalmente -->
    <Header />

    <!-- Zona scrollable debajo del Header -->
    <div class="flex-grow-1 overflow-auto bg-light">
      <div class="container py-4">
        <router-view />
      </div>
    </div>
  </main>
</template>

<script setup>
import Header from "./components/Header.vue";
</script>
