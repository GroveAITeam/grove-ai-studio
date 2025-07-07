declare namespace Conversation {
  // 消息接口定义
  interface Message {
    id?: number
    conversation_id?: number
    content: string
    role: 'system' | 'user' | 'assistant'
    typing?: boolean
    created_at?: string
    updated_at?: string
    reasoning_content?: string
  }

  // 会话项接口定义
  interface Item {
    id: number
    uid: string
    title: string
    model: string
    updated_at: string
    created_at: string
  }

  // 会话Store State类型定义
  interface State {
    conversations: Item[]
    messageList: Message[]
    activeSessionId: number
    currentSession: null | Item
    isLoading: boolean
    currentPage: number
    pageSize: number
    searchQuery: string
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
