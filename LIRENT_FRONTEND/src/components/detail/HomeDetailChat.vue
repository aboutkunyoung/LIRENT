<script setup>
import Chat from "@/components/common/Chat.vue";

const props = defineProps({
  sublease: Object,
});
</script>

<template>
  <div class="container fixed">
    <Chat
      :sublease-id="props.sublease.subleaseId"
      :owner-id="props.sublease.memberId"
    />
  </div>
</template>

<style scoped>
.fixed {
  position: fixed;
  top: 8%;
  right: 20px;
  max-width: 400px;
  z-index: 1000;
  border-radius: 8px;
}
</style>
