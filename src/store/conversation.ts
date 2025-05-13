import { defineStore } from 'pinia'
import { toast } from 'vue-sonner'

export const useConversationStore = defineStore('conversation', {
  state: (): Conversation.State => ({
    conversations: [],
    messageList: [],
    activeSessionId: 0,
    currentSession: null,
    isLoading: false,
    currentPage: 1,
    pageSize: 10,
    searchQuery: '',
  }),
  getters: {
    activeConversation: (state) => {
      const active = state.currentSession
      return active || { id: 0, title: '新对话' }
    },
  },
  actions: {
    // 获取所有会话
    async loadConversations() {
      try {
        // TODO api
        // const res = await chatApi.getSessions()
        const res = {
          data: [{
            id: 4,
            title: '🙋‍♂️ 你好问候交流',
            uid: 'default-user',
            model: 'deepseek-r1',
            system_prompt: 'You are a helpful assistant.',
            temperature: 0.6,
            top_p: 1,
            presence_penalty: 0,
            frequency_penalty: 0,
            created_at: '2025-05-13T08:56:12.733Z',
            updated_at: '2025-05-13T09:18:24.215Z',
            deleted_at: null,
            createdAt: '2025-05-13T08:56:12.733Z',
            updatedAt: '2025-05-13T09:18:24.215Z',
            deletedAt: null,
          }],
        }
        this.conversations = res.data
        if (this.conversations.length > 0 && !this.currentSession) {
          this.setActiveSession(this.conversations[0])
        }
        return res.data
      } catch (error) {
        console.error('Failed to fetch sessions:', error)
        throw error
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
      // this.conversations.forEach(conv => conv.active = false)
      this.messageList = []
    },
    // 切换会话
    async switchConversation(conversation: Conversation.Item) {
      // this.conversations.forEach(conv => conv.active = conv.id === conversation.id)
      this.messageList = []
      await this.loadMessages(conversation.id)
    },

    // 添加删除会话方法
    async removeSession(sessionId: number) {
      try {
        // TODO 删除会话api
        // const res = await chatApi.removeSession(sessionId)
        const res = true
        if (res) {
          this.conversations = this.conversations.filter(s => s.id !== sessionId)
          // 如果删除的是当前活动会话，切换到第一个会话
          if (this.activeSessionId === sessionId && this.conversations.length > 0) {
            this.setActiveSession(this.conversations[0])
          }
        }
        return res
      } catch (error) {
        console.error('Failed to delete session:', error)
        throw error
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
    // 修改 setActiveSession 方法
    setActiveSession(session: Conversation.Item) {
      // 检查 session 是否为 null 或 undefined
      if (!session || typeof session.id === 'undefined') {
        console.error('尝试设置无效的会话对象')
        return
      }

      // 确保会话存在于列表中
      const existingSession = this.conversations.find(s => s.id === session.id)
      if (!existingSession) {
        this.conversations = this.conversations.filter(s => s.id !== session.id)
        this.conversations.unshift(session)
      }
      this.activeSessionId = session.id
      this.currentSession = session
    },
  },
})
