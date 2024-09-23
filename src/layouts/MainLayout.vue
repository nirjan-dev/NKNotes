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
      <div class="py-4 px-4 flex justify-between">
        <q-btn round icon="note_add"></q-btn>
        <q-btn round icon="delete"></q-btn>
      </div>

      <NotePreviewList />
    </q-drawer>

    <q-page-container>
      <q-toolbar class="bg-gray-200 text-center app-draggable">
        <q-toolbar-title>Markdown Notes Editor</q-toolbar-title>
      </q-toolbar>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import NotePreviewList from 'components/NotePreviewList.vue';

const leftDrawerOpen = ref(false);
</script>
