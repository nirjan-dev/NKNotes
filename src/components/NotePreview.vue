<template>
  <div
    class="cursor-pointer px-2.5 py-3 rounded-md transition-colors duration-75"
    :class="{
      'bg-slate-300/75': isActive,
      'hover:bg-slate-400/75': !isActive,
    }"
  >
    <h3 class="mb-1 font-bold truncate">{{ Props.title }}</h3>
    <span class="inline-block w-full text-xs font-light text-left">{{
      getFormattedDate(Props.lastEditTime)
    }}</span>
  </div>
</template>

<script setup lang="ts">
const Props = defineProps<{
  title: string;
  content?: string;
  lastEditTime: number;
  isActive: boolean;
}>();

function getFormattedDate(time: number) {
  const formatter = new Intl.DateTimeFormat(window.context.locale, {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'UTC',
  });

  return formatter.format(time);
}
</script>

<style scoped></style>
