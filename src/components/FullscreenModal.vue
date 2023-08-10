<template>
  <transition name="fade" appear>
    <div
      class="w-screen h-screen z-40 top-0 bottom-0 right-0 fixed bg-opacity-5 center bg-columbia-blue"
    >
      <div class="relative">
        <div
          class="absolute right-0 top-0 text-red-500 font-title m-4 darken-hover cursor-pointer"
          @click="closeModal()"
        >
          <i class="gg-close"></i>
        </div>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
const emit = defineEmits(['close'])
function closeModal() {
  emit('close')
}
</script>
