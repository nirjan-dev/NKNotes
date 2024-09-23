<template>
  <ul v-if="notesStore.notes.length">
    <li v-for="(note, index) in notesStore.notes" :key="note.title">
      <NotePreview
        :title="note.title"
        :lastEditTime="note.lastEditTime"
        :isActive="index === notesStore.selectedNoteIndex"
        @click="notesStore.setSelectedNoteIndex(index)"
      />
    </li>
  </ul>

  <p v-else class="pt-4 text-center">No notes yet!</p>
</template>

<script setup lang="ts">
import NotePreview from 'src/components/NotePreview.vue';
import { useNotesStore } from 'src/stores/notesStore';

const notesStore = useNotesStore();
</script>

<style scoped></style>
