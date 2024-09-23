<template>
  <div class="flex justify-center pt-2">
    <p class="text-lg text-gray-400">{{ Props.title }}</p>
  </div>
</template>

<script setup lang="ts">
const Props = defineProps<{
  title: string;
}>();
</script>

<style scoped></style>
