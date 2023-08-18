<script setup lang="ts">
import { ref } from 'vue'
const display = ref(true)
</script>

<template>
  <div
    class="w-full bg-columbia-blue text-center p-2 flex flex-row justify-between"
    :class="display ? 'block' : 'hidden'"
  >
    <span class="text-oxford-blue w-full"><slot></slot></span>
    <div
      class="darken-hover hover:text-red-600 cursor-pointer text-oxford-blue"
      @click="display = false"
    >
      <i class="gg-close"></i>
    </div>
  </div>
</template>

<style scoped></style>
