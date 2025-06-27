<template>
  <nav
    class="navbar navbar-light shadow-sm bg-white sticky-top py-2 border-bottom"
  >
    <div class="d-flex align-items-center w-100">
      <button
        v-if="showBackButton"
        @click="goBack"
        class="btn col-1 p-0 d-flex align-items-center justify-content-center mx-2"
        aria-label="Volver"
      >
        <i class="mdi mdi-chevron-left mdi-24px"></i>
      </button>
      <div v-else class="col-1 mx-2"></div>

      <router-link to="/" class="navbar-brand fw-bold fs-4 text-primary mb-0 d-flex align-items-center gap-2">
        {{ store.title || "Barril" }}
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { supabase } from "../supabase";
import { useHeaderStore } from "@/stores/useHeaderStore";

const store = useHeaderStore();
const user = ref(null);
const router = useRouter();
const route = useRoute();

const showBackButton = computed(() => route.path !== "/" && route.path !== "/login");

const getUser = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  user.value = session?.user || null;
};

const logout = async () => {
  await supabase.auth.signOut();
  user.value = null;
  window.location.href = "/login";
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  getUser();
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user || null;
  });
});
</script>

<style scoped>
.navbar-brand {
  transition: color 0.2s ease-in-out;
}
.navbar-brand:hover {
  color: #0a58ca;
}
</style>
