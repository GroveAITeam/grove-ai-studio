<script setup lang="ts">
import Input from '@/components/ui/input/Input.vue'
import { useThrottleFn } from '@vueuse/core'
import { Info, Send } from 'lucide-vue-next'
import { ref } from 'vue'

const emit = defineEmits(['sendMsg'])

const messageInput = ref('')

// 发送消息
const handleSendMsg = useThrottleFn(() => {
  if (!messageInput.value.trim()) return
  emit('sendMsg', messageInput.value)
  messageInput.value = ''
}, 1000)
</script>

<template>
  <div class="flex flex-col w-full">
    <!-- 输入框区域 -->
    <div class="px-4 mx-auto w-full max-w-3xl">
      <div class="relative">
        <!-- 输入框 -->
        <Input
          v-model="messageInput"
          type="text"
          class="py-3 pr-32 pl-4 w-full rounded-lg h-15 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="询问任何问题"
          @keyup.enter="handleSendMsg"
        />

        <!-- 发送按钮 -->
        <button
          :disabled="!messageInput.trim()"
          class="absolute right-3 top-1/2 p-1.5 rounded-full transition-colors transform -translate-y-1/2 cursor-pointer hover:text-primary hover:bg-base-300/50 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleSendMsg"
        >
          <Send class="text-lg" />
        </button>
      </div>
    </div>
    <!-- 提示信息 -->
    <div class="flex gap-1 justify-center items-center mt-2 text-xs text-gray-500">
      <Info :size="12" />
      <span>Grove AI 可能会产生不准确的信息，请自行判断内容的准确性。</span>
    </div>
  </div>
</template>
