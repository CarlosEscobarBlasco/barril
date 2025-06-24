<template>
  <nav
    class="navbar navbar-light shadow-sm bg-white fixed-top py-2 border-bottom"
  >
    <div
      class="container-fluid d-flex align-items-center justify-content-between"
    >
      <!-- Back button -->
      <div class="d-flex align-items-center">
        <button
          v-if="showBackButton"
          @click="goBack"
          class="btn me-3 d-flex align-items-center justify-content-center"
          style="width: 38px; height: 38px; border-radius: 50%"
          aria-label="Volver"
        >
          <i class="bi bi-chevron-left"></i>
        </button>

        <router-link
          to="/dashboard"
          class="navbar-brand fw-bold fs-4 text-primary mb-0"
        >
          Barril
        </router-link>
      </div>

      <!-- Logout -->
      <!-- <div>
        <button
          v-if="user"
          @click="logout"
          class="btn btn-outline-danger d-flex align-items-center"
        >
          <i class="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </div> -->
    </div>
  </nav>
</template>

<script>
import { supabase } from "../supabase";
import { ref, onMounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

export default {
  setup() {
    const user = ref(null);
    const router = useRouter();
    const route = useRoute();
    const pageTitle = ref("");

    const showBackButton = computed(() => route.path !== "/dashboard");

    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      user.value = session?.user || null;
    };

    const logout = async () => {
      await supabase.auth.signOut();
      user.value = null;
      window.location.href = "/";
    };

    const goBack = () => {
      router.back();
    };

    const updateTitle = () => {
      pageTitle.value = route.meta.title || "Barril";
    };

    onMounted(() => {
      updateTitle();
      getUser();

      supabase.auth.onAuthStateChange((_event, session) => {
        user.value = session?.user || null;
      });
    });
    watch(route, updateTitle);

    return { user, logout, showBackButton, goBack };
  },
};
</script>

<style scoped>
.navbar-brand {
  transition: color 0.2s ease-in-out;
}
.navbar-brand:hover {
  color: #0a58ca;
}
</style>
