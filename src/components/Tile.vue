<template>
  <router-link
    :to="to"
    class="btn btn-outline-primary col-10 col-lg-6 p-3 d-flex flex-column align-items-center text-decoration-none bg-white"
  >
    <i :class="icon" class="fs-2 mb-2"></i>
    <h5 class="text-center mb-0">{{ title }}</h5>
  </router-link>
</template>

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
