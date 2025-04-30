// import {
//   DestroyConversation,
//   GetConversationList,
//   GetMessageList,
// } from '@wailsjs/go/main/App'
import { defineStore } from 'pinia'
import { toast } from 'vue-sonner'

export const useConversationStore = defineStore('conversation', {
  state: () => ({
    conversations: [] as Conversation.Item[],
    messageList: [] as Conversation.Message[],
    isChatMode: false,
    isLoading: false,
    currentPage: 1,
    pageSize: 10,
    searchQuery: '',
  }),
  getters: {
    activeConversation: (state) => {
      const active = state.conversations.find(c => c.active)
      return active || { id: 0, title: '新对话' }
    },
  },
  actions: {
    async loadConversations() {
      try {
        this.isLoading = true
      } catch (error) {
        toast.error('加载会话列表失败')
        console.error('加载会话列表失败:', error)
      } finally {
        this.isLoading = false
      }
    },
    async loadMessages(conversationId: number, minId: number = 0, append: boolean = false) {
      try {
        console.log('🚀 ~ loadMessages ~ conversationId:', conversationId, minId, append)
      } catch (error) {
        toast.error('加载消息失败')
        console.error('加载消息失败:', error)
      }
    },
    createNewChat() {
      this.conversations.forEach(conv => conv.active = false)
      this.isChatMode = false
      this.messageList = []
    },
    // 切换会话
    async switchConversation(conversation: Conversation.Item) {
      this.conversations.forEach(conv => conv.active = conv.id === conversation.id)
      this.messageList = []
      await this.loadMessages(conversation.id)
      this.isChatMode = true
    },
    async deleteConversation(index: number) {
      const conversation = this.conversations[index]
      const wasActive = conversation.active

      try {
        this.conversations.splice(index, 1)

        if (wasActive && this.conversations.length > 0) {
          this.conversations[0].active = true
          await this.loadMessages(this.conversations[0].id)
        } else if (this.conversations.length === 0) {
          this.messageList = []
          this.isChatMode = false
        }

        toast.success('删除会话成功')
      } catch (error) {
        toast.error('删除会话失败')
        console.error('删除会话失败:', error)
      }
    },
    addMessage(message: Conversation.Message | Conversation.Message[]) {
      if (Array.isArray(message)) {
        this.messageList.push(...message)
      } else {
        this.messageList.push(message)
      }
    },
    updateLastAssistantMessage(content: string, typing: boolean = false) {
      const lastAssistantIndex = [...this.messageList].reverse().findIndex(msg => msg.role === 'assistant')

      if (lastAssistantIndex !== -1) {
        const actualIndex = this.messageList.length - 1 - lastAssistantIndex
        this.messageList[actualIndex].content = content
        this.messageList[actualIndex].typing = typing
      }
    },
    updateChatMode(mode: boolean) {
      this.isChatMode = mode
    },
  },
})
