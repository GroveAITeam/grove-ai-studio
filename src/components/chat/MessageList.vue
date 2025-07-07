<script setup lang="ts">
import { defineExpose, defineProps, ref } from 'vue'
import MessageCard from './MessageCard.vue'

defineProps<{
  messages: Conversation.Message[]
}>()

const messagesContainer = ref<HTMLElement | null>(null)

// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 暴露容器引用和方法，使父组件可以操作
defineExpose({
  messagesContainer,
  scrollToBottom,
})
</script>

<template>
  <div
    ref="messagesContainer"
    class="flex overflow-y-auto flex-col flex-1 px-4 mx-auto w-full max-w-3xl grid-rows-0"
  >
    <div class="py-4 space-y-6">
      <MessageCard
        v-for="(message, index) in messages"
        :key="index"
        :message="message"
      />
    </div>
  </div>
</template>
