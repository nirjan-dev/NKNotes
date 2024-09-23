<template>
  <q-page>
    <NoteTitle title="Note title" />
    <TextEditor />
  </q-page>
</template>

<script setup lang="ts">
import NoteTitle from 'src/components/NoteTitle.vue';
import TextEditor from 'src/components/TextEditor.vue';

defineOptions({
  name: 'IndexPage',
});
</script>
