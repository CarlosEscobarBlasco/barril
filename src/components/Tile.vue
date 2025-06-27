<template>
  <router-link
    :to="to"
    class="card text-center text-decoration-none shadow-sm  tile-hover col-11 col-sm-10 col-md-8 mx-auto"
  >
    <div class="card-body d-flex flex-column align-items-center p-4">
      <i :class="icon" class="fs-1 text-primary mb-3"></i>
      <h6 class="card-title text-dark mb-0">{{ title }}</h6>
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

