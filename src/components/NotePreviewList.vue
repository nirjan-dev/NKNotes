<template>
  <ul v-if="notesMock.length">
    <li v-for="note in notesMock" :key="note.title">
      <NotePreview
        :title="note.title"
        :lastEditTime="note.lastEditTime"
        :isActive="false"
      />
    </li>
  </ul>

  <p v-else class="pt-4 text-center">No notes yet!</p>
</template>

<script setup lang="ts">
import { notesMock } from 'src/stores/mocks';
import NotePreview from 'src/components/NotePreview.vue';
</script>

<style scoped></style>
