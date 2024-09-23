<template>
  <div class="flex justify-center pt-2">
    <p class="text-lg text-gray-400">
      {{ notesStore.selectedNote?.title ?? 'Note title' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useNotesStore } from 'src/stores/notesStore';

const notesStore = useNotesStore();
</script>

<style scoped></style>
