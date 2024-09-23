<template>
  <EditorContent v-model="content" :editor="editor" />
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import { computed, ref } from 'vue';

const content = ref('<p>I’m running Tiptap with Vue.js. 🎉</p>');

const editor = useEditor({
  extensions: [StarterKit, Markdown],
  content: content.value,
  onUpdate: ({ editor }) => {
    content.value = editor.getHTML();
  },
  editorProps: {
    attributes: {
      class:
        'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none mx-auto min-h-svh bg-slate-50 px-6 py-4 rounded-lg',
    },
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const markdownOutput = computed(() => {
  return editor.value.storage.markdown.getMarkdown();
});
</script>
