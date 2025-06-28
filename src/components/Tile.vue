<template>
  <router-link
    :to="to"
    class="card text-center text-decoration-none shadow-sm tile-hover col-11 col-sm-10 col-md-8 mx-auto position-relative overflow-hidden"
  >
    <!-- Icono como fondo -->
    <i
      :class="icon"
      class="background-icon position-absolute"
    ></i>

    <div class="card-body d-flex flex-column align-items-center p-5 position-relative">
      <h4 class="card-title mb-0 text-primary">{{ title }}</h4>
    </div>
  </router-link>
</template>

<style scoped>
.tile-hover {
  transition: all 0.2s ease-in-out;
}
.tile-hover:hover {
  background-color: #f8f9fa;
  transform: translateY(-4px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
}

.background-icon {
  font-size: 8rem;
  color: #0d6dfd0f; /* Azul clarito, ajusta al gusto */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  pointer-events: none;
}
.card-body {
  z-index: 1; /* Asegura que el texto esté delante del icono */
}
</style>



<script>
export default {
  name: "Tile",
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
  },
};
</script>

