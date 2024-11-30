<script setup>
import HomeDetailBoard from "@/components/detail/HomeDetailBoard.vue";
import HomeDetailChat from "@/components/detail/HomeDetailChat.vue";

const props = defineProps({
  currentSublease: Object,
});
</script>

<template>
  <div>
    <HomeDetailBoard :sublease="props.currentSublease" />
    <HomeDetailChat :sublease="props.currentSublease" />
  </div>
</template>

<style scoped></style>
