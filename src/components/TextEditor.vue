<template>
  <EditorContent v-if="selectedNote" v-model="content" :editor="editor" />
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import { computed, ref, watch } from 'vue';
import { useNotesStore } from 'src/stores/notesStore';
import { storeToRefs } from 'pinia';
import { useThrottleFn } from '@vueuse/core';

const { selectedNote } = storeToRefs(useNotesStore());

const content = ref(selectedNote?.content);

const AUTO_SAVE_TIME = 5000;

async function saveNote() {
  if (!selectedNote.value) {
    return;
  }

  console.log('auto saving note...');
  await window.context.writeNote(selectedNote.value.title, content.value);
}

const saveNoteThrottled = useThrottleFn(
  async () => await saveNote(),
  AUTO_SAVE_TIME
);

const editor = useEditor({
  extensions: [StarterKit, Markdown],
  content: content.value,
  onUpdate: ({ editor }) => {
    content.value = editor.storage.markdown.getMarkdown();

    saveNoteThrottled();
  },
  editorProps: {
    attributes: {
      class:
        'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none mx-auto min-h-svh bg-slate-50 px-6 py-4 rounded-lg',
    },
  },
});

watch(selectedNote, () => {
  if (selectedNote.value) {
    content.value = selectedNote.value.content;
    editor.value.commands.setContent(selectedNote.value.content);
    saveNote();
  }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const markdownOutput = computed(() => {
  return editor.value.storage.markdown.getMarkdown();
});
</script>
