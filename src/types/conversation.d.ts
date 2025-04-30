declare namespace Conversation {
  // 消息接口定义
  interface Message {
    id?: number
    conversation_id?: number
    content: string
    role: 'user' | 'assistant'
    typing?: boolean
    created_at?: string
    updated_at?: string
  }

  // 会话项接口定义
  interface Item {
    id: number
    title: string
    created_at?: string
    updated_at?: string
    active: boolean
    group: string
  }

  // 会话Store返回值类型定义
  interface StoreReturn {
    conversations: Ref<Item[]>
    messageList: Ref<Message[]>
    isChatMode: Ref<boolean>
    isLoading: Ref<boolean>
    currentPage: Ref<number>
    pageSize: Ref<number>
    searchQuery: Ref<string>
    activeConversation: ComputedRef<Item>
    loadConversations: () => Promise<void>
    loadMessages: (conversationId: number, minId?: number, append?: boolean) => Promise<void>
    createNewChat: () => void
    switchConversation: (conversation: Item) => Promise<void>
    deleteConversation: (index: number) => Promise<void>
    addMessage: (message: Message | Message[]) => void
    updateLastAssistantMessage: (content: string, typing?: boolean) => void
    updateChatMode: (mode: boolean) => void
  }

  // API响应类型定义
  interface ConversationResponse {
    id: number
    created_at: string
    updated_at: string
    title: string
  }

  interface MessageResponse {
    id: number
    created_at: string
    updated_at: string
    conversation_id: number
    role: string
    content: string
  }

  // 分页结果接口定义
  interface PageResult<T> {
    total: number
    items: T[]
  }

  interface ConversationPageResult extends PageResult<ConversationResponse> {}

  interface MessagePageResult {
    items: MessageResponse[]
  }

  // 消息请求参数接口
  interface MessageRequestParams {
    conversation_id: number
    content: string
    model: string
    temperature: number
    max_tokens: number
    context_length: number
  }
}
