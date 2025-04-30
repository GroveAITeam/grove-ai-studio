<script setup lang="ts">
interface Message {
  id?: number
  content: string
  role: 'user' | 'assistant'
  typing?: boolean
  created_at?: string
  updated_at?: string
}

defineProps<{
  message: Message
}>()

// 格式化日期时间
const formatDateTime = (dateString?: string) => {
  if (!dateString) {
    return new Date().toLocaleTimeString()
  }
  return new Date(dateString).toLocaleTimeString()
}
</script>

<template>
  <div
    class="flex items-start gap-4"
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
        class="prose-sm prose break-words whitespace-pre-wrap"
        :class="{ typing: message.typing }"
        v-html="message.content"
      />
      <div
        v-if="message.role === 'assistant'"
        class="mt-1 text-xs text-left opacity-70"
      >
        {{ formatDateTime(message.created_at) }}
      </div>
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
