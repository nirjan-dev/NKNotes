import { defineStore } from 'pinia';
import { notesMock } from 'src/stores/mocks';
import { NoteInfo } from 'src/types/models';
import { computed, ref } from 'vue';

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<NoteInfo[]>(notesMock);
  const selectedNoteContent = ref('');
  async function loadNotes() {
    const savedNotes = await window.context.getNotes();

    notes.value = savedNotes;
  }

  const selectedNoteIndex = ref<number | null>(null);

  const selectedNote = computed(() => {
    if (selectedNoteIndex.value === null) {
      return null;
    }

    const selectedNote = notes.value[selectedNoteIndex.value];

    return {
      ...selectedNote,
      content: selectedNoteContent.value,
    };
  });

  async function setSelectedNoteIndex(index: number) {
    selectedNoteIndex.value = index;

    const selectedNote = notes.value[selectedNoteIndex.value];
    if (selectedNote) {
      selectedNoteContent.value = await window.context.readNote(
        selectedNote.title
      );
    }
  }

  async function createNewNote() {
    const title = await window.context.createNote();

    if (!title) {
      return;
    }

    notes.value.unshift({
      title,
      lastEditTime: new Date().getTime(),
    });

    selectedNoteIndex.value = 0;
  }

  function deleteSelectedNote() {
    if (selectedNoteIndex.value === null) {
      return;
    }

    notes.value.splice(selectedNoteIndex.value, 1);
    selectedNoteIndex.value = null;
  }

  async function saveSelectedNote() {
    if (!selectedNote.value || !notes?.value.length) {
      return;
    }

    await window.context.writeNote(
      selectedNote.value.title,
      selectedNote.value.content
    );

    selectedNote.value.lastEditTime = Date.now();
  }

  return {
    notes,
    selectedNoteIndex,
    selectedNote,
    setSelectedNoteIndex,
    createNewNote,
    deleteSelectedNote,
    loadNotes,
    saveSelectedNote,
  };
});
