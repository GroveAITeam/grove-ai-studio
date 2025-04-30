<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { navigator } from '@/router/navigator'
import { useConversationStore } from '@/store/conversation'
import { MessageSquare, Plus, Trash2 } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

// 获取会话store
const conversationStore = useConversationStore()
const {
  loadConversations,
  createNewChat,
  switchConversation,
  deleteConversation,
} = conversationStore
const { conversations } = storeToRefs(conversationStore)

// 加载会话列表
loadConversations()

// 新增对话
const handleCreateNew = () => {
  createNewChat()

  navigator.navigate('/')
}

const handleSwitch = (conversation: Conversation.Item) => {
  switchConversation(conversation)
}

const handleDelete = (index: number) => {
  deleteConversation(index)
}
</script>

<template>
  <div class="flex flex-col p-5 w-full">
    <Button
      class="flex cursor-pointer margin-x-auto"
      variant="outline"
      @click="handleCreateNew"
    >
      <Plus :size="18" />
      新对话
    </Button>

    <!-- 对话列表 -->
    <div class="overflow-y-auto flex-1 p-2">
      <div
        v-for="conversation in conversations"
        :key="conversation.id"
        class="flex gap-1 items-center px-2 py-1.5 rounded-md transition-colors cursor-pointer group" :class="[
          conversation.active ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-base-300/30',
        ]"
        @click="handleSwitch(conversation)"
      >
        <MessageSquare :size="16" :class="conversation.active ? 'text-primary' : 'opacity-70'" />
        <span class="flex-1 text-sm truncate">{{ conversation.title }}</span>
        <button
          class="p-1 rounded-md opacity-0 transition-all group-hover:opacity-100 hover:bg-base-300"
          @click="handleDelete(conversations.indexOf(conversation))"
        >
          <Trash2 :size="16" class="opacity-70 hover:text-error" />
        </button>
      </div>
    </div>
  </div>
</template>
