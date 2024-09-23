import { defineStore } from 'pinia';
import { notesMock } from 'src/stores/mocks';
import { NoteInfo } from 'src/types/models';
import { computed, ref } from 'vue';

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<NoteInfo[]>(notesMock);

  const selectedNoteIndex = ref<number | null>(null);

  const selectedNote = computed(() => {
    if (selectedNoteIndex.value === null) {
      return null;
    }

    const selectedNote = notes.value[selectedNoteIndex.value];

    return {
      ...selectedNote,
      content: `Hello from Notes${selectedNoteIndex.value}`,
    };
  });

  function setSelectedNoteIndex(index: number) {
    selectedNoteIndex.value = index;
  }

  return {
    notes,
    selectedNoteIndex,
    selectedNote,
    setSelectedNoteIndex,
  };
});
