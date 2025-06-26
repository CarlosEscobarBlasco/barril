<template>
  <div
    class="modal fade"
    tabindex="-1"
    ref="modalRef"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button type="button" class="btn-close" @click="onCancel"></button>
        </div>
        <div class="modal-body">
          <slot>{{ body }}</slot>
        </div>
        <div class="modal-footer">
          <button v-if="disableCancel" type="button" class="btn btn-secondary" @click="onCancel">
            Cancel
          </button>
          <button type="button" class="btn btn-primary" @click="onAccept">
            Accept
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { Modal } from "bootstrap";

const props = defineProps({
  title: { type: String, default: "Modal Title" },
  body: { type: String, default: "" },
  disableCancel: { type: Boolean, default: false },
});

const emit = defineEmits(["accept", "cancel"]);

const modalRef = ref(null);
let modalInstance = null;

onMounted(() => {
  modalInstance = new Modal(modalRef.value, {
    backdrop: props.disableCancel ? 'static' : true,
    keyboard: !props.disableCancel,
  });
});

const show = () => modalInstance?.show();
const hide = () => modalInstance?.hide();

const onAccept = () => {
  emit("accept");
  hide();
};

const onCancel = () => {
  emit("cancel");
  hide();
};

defineExpose({ show, hide });
</script>
