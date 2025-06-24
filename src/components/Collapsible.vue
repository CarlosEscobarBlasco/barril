<template>
  <div class="accordion" :id="'accordion'">
    <div class="accordion-item">
      <h2 class="accordion-header" :id="'heading'">
        <button
          class="accordion-button"
          type="button"
          :class="{ collapsed: !isOpen }"
          @click="toggle"
          :aria-expanded="isOpen.toString()"
          :aria-controls="'collapse'"
        >
          {{ title }}
        </button>
      </h2>
      <div
        :id="'collapse'"
        class="accordion-collapse collapse"
        :class="{ show: isOpen }"
        :aria-labelledby="'heading'"
        :data-bs-parent="'#accordion'"
      >
        <div class="accordion-body">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  title: {
    type: String,
    default: "Toggle",
  },
});

const isOpen = ref(false);

function toggle() {
  isOpen.value = !isOpen.value;
}
</script>
