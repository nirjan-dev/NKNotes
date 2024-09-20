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
    </q-drawer>

    <q-page-container>
      <header class="z-[9999] absolute inset-0 h-10 bg-transparent"></header>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
};
</script>
