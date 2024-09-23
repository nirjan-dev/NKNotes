<template>
  <q-layout view="hHh lpR fFf">
    <q-drawer
      class="bg-grey-2"
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      behavior="desktop"
    >
      <!-- drawer content -->
      <div class="flex justify-between px-4 py-4">
        <q-btn @click="createNewNote" round icon="note_add"></q-btn>
        <q-btn @click="deleteSelectedNote" round icon="delete"></q-btn>
      </div>

      <NotePreviewList />
    </q-drawer>

    <q-page-container>
      <q-toolbar class="text-center bg-gray-200 app-draggable">
        <q-toolbar-title>Markdown Notes Editor</q-toolbar-title>
      </q-toolbar>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import NotePreviewList from 'components/NotePreviewList.vue';
import { useNotesStore } from 'src/stores/notesStore';
const { createNewNote, deleteSelectedNote } = useNotesStore();
const leftDrawerOpen = ref(false);
</script>
