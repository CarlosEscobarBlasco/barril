<template>
  <main class="d-flex flex-column min-vh-100 app-background">
    <Header />
    <div class="flex-grow-1 overflow-auto bg-light">
      <div class="container py-4">
        <router-view style="position: relative;z-index: 1;"/>
      </div>
    </div>
  </main>
</template>

<script setup>
import Header from "./components/Header.vue";
</script>

<style scoped>
.app-background::before {
  content: "";
  position: fixed;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 600px;
  background-image: url('/logo.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.025;
  transform: translate(-50%, -50%);
  z-index: 0;
  pointer-events: none;
  user-select: none;
  filter: blur(2px);
}
</style>