<script setup lang="ts">
// import { buildCodeBlock, deepCloneAndUpdate } from '@/module/code-block.js'
import markdownIt from '@/module/markdown-it.ts'
import { watch } from 'vue'

const props = defineProps<{
  message: Message
}>()

interface Message {
  id?: number
  content: string
  role: 'user' | 'assistant'
  typing?: boolean
  created_at?: string
  updated_at?: string
}

watch(
  () => props.message,
  (newValue) => {
    console.log('🚀 ~ newValue:', newValue)
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <div
    class="flex items-start gap-4 w-full overflow-hidden"
    :class="message.role === 'user' ? 'justify-end' : ''"
  >
    <!-- 消息内容 -->
    <div
      class="p-4 rounded-lg"
      :class="{
        'bg-stone-100 text-primary-content': message.role === 'user',
        'bg-base-200': message.role === 'assistant',
      }"
    >
      <div
        class="prose-sm prose break-words"
        :class="{ typing: message.typing }"
        v-html="markdownIt.render(message.content)"
      />
    </div>
  </div>
</template>

<style scoped>
/* 打字动画 */
.typing:after {
  content: '|';
  animation: cursor-blink 1s infinite;
}

@keyframes cursor-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
