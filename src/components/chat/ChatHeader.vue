<script setup lang="ts">
import { Settings } from 'lucide-vue-next'

defineProps<{
  title: string
}>()

const emit = defineEmits(['toggleSettings'])
</script>

<template>
  <div class="flex pt-10">
    <button
      class="absolute top-5 right-5 cursor-pointer"
      @click="emit('toggleSettings')"
    >
      <Settings :size="18" />
    </button>
  </div>
</template>
