<script setup lang="ts">
import markdownIt from '@/module/markdown-it'
import { LoaderCircle } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  message: Conversation.Message
}>()

const isThinking = ref<boolean>(false)
const thinkContent = ref<string>('')
const formalContent = ref<string>('')
const reasoningContent = ref<string>('')
// const mainContentRef = ref<HTMLElement>()

// 处理思考内容的 Markdown
const processedThinkContent = computed(() => {
  if (!thinkContent.value) return ''
  return markdownIt.render(thinkContent.value)
})

// 处理 Reasoning 内容的 Markdown
const processedReasoningContent = computed(() => {
  if (!reasoningContent.value) return ''
  return markdownIt.render(reasoningContent.value)
})

// 处理正式内容的 Markdown
const processedFormalContent = computed(() => {
  if (!formalContent.value) return null
  return markdownIt.render(formalContent.value)
})

// 监听消息变化，处理思考过程和正式内容
watch(
  () => props.message.content,
  (content) => {
    if (content.includes('<think>') && !content.includes('</think>')) {
      // 开始思考状态
      isThinking.value = true
      thinkContent.value = content.replace('<think>', '')
      formalContent.value = ''
    } else if (content.includes('<think>') && content.includes('</think>')) {
      // 思考已结束，提取思考内容和正式内容
      isThinking.value = false
      const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/)
      thinkContent.value = thinkMatch ? thinkMatch[1] : ''
      formalContent.value = content.replace(/<think>[\s\S]*?<\/think>/, '')
    } else {
      // 没有思考内容，只有正式内容
      isThinking.value = false
      thinkContent.value = ''
      formalContent.value = content
    }
  },
  { immediate: true },
)

watch(() => props.message.reasoning_content, (reason) => {
  reasoningContent.value = reason || ''
}, { immediate: true, deep: true })
</script>

<template>
  <div class="last:min-h-[calc(100dvh-300px)] msg-item relative group/item">
    <div class="flex pb-4" :class="message.role === 'user' ? 'flex-row-reverse' : ''">
      <div class="flex flex-col max-w-[80%]">
        <div
          class="rounded-lg px-4 py-2 list-disc text-[14px] whitespace-wrap msg-item" :class="message.role === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-gray-100 dark:bg-primary-foreground dark:text-white'
          "
        >
          <div
            v-if="reasoningContent && processedReasoningContent"
            class="thinking-container pb-4 mb-4 border-b text-sm leading-8"
          >
            <div class="think" v-html="processedReasoningContent" />
          </div>

          <div v-if="message.content === ''" class="flex items-center ">
            <LoaderCircle class="animate-spin w-4 h-4" />
            <span class="ml-2 text-[14px]">思考中...</span>
          </div>

          <!-- 思考中状态 -->
          <div v-if="isThinking" class="thinking-container">
            <div class="think" v-html="processedThinkContent" />
            <div class="thinking-indicator">
              <LoaderCircle class="animate-spin w-4 h-4 inline-block mr-1" />
              <span>思考中...</span>
            </div>
          </div>

          <!-- 思考已完成，显示思考内容和正式内容 -->
          <template v-else>
            <div
              v-if="thinkContent" class="think mb-3" :class="{ typing: message.typing }"
              v-html="processedThinkContent"
            />
            <div v-html="processedFormalContent" />
            <!-- <div ref="mainContentRef" class="main-content" /> -->
          </template>
        </div>
      </div>
    </div>
    <!-- 消息下方操作区域 -->
    <!-- <div class="invisible group-hover/item:visible">
      <MessageAction :message="message" :role="message.role"></MessageAction>
    </div> -->
  </div>
</template>

<style scoped lang="scss">
@use './message.scss' as *;

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
