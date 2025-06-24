<template>
  <Header />
  <main
    style="
      height: 100vh;
      padding-top: 56px;
      box-sizing: border-box;
      overflow-y: auto;
    "
    class="bg-light"
  >
    <router-view />
  </main>
</template>

<script setup>
import Header from "./components/Header.vue";
</script>
