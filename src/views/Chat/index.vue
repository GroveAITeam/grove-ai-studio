<script setup lang="ts">
import ChatHeader from '@/components/chat/ChatHeader.vue'
import ChatInput from '@/components/chat/ChatInput.vue'
import ConversationList from '@/components/chat/ConversationList.vue'
import MessageList from '@/components/chat/MessageList.vue'
import SettingsPanel from '@/components/chat/SettingsPanel.vue'
import { useConversationStore } from '@/store/conversation'
import { storeToRefs } from 'pinia'
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { toast } from 'vue-sonner'

// TODO 模拟AI SSE消息
const MOCK = '🎉当然！以下是一个使用Python实现的冒泡排序算法的示例：\n\n```python\ndef bubble_sort(arr):\n    n = len(arr)\n    # 遍历所有数组元素\n    for i in range(n):\n        # 最后i个元素已经是有序的\n        for j in range(0, n-i-1):\n            # 如果当前元素大于下一个元素，则交换它们测试最大的长度 ============================================================================================================ ==========\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n        # 打印每一轮排序结果用于调试\n        print(f"第{i+1}轮排序结果: {arr}")\n    return arr\n\n# 示例数组\narr = [64, 34, 25, 12, 22, 11, 90]\nprint("初始数组:", arr)\n\n# 调用冒泡排序函数\nsorted_arr = bubble_sort(arr)\nprint("排序后的数组:", sorted_arr)\n```\n\n在这个代码中：\n1. `bubble_sort`函数接受一个列表作为参数，并对其进行冒泡排序。\n2. 外层循环控制遍历的轮数。\n3. 内层循环用于比较和交换相邻的元素。\n4. 每一轮结束后，最大的元素都会被“冒泡”到列表的末尾。\n5. 在排序过程中，会打印出每一轮排序的中间结果，方便调试和观察排序过程。\n\n运行此代码将会输出每一轮排序后的数组状态，最终输出完全排序的数组。'

// Constants
const SETTINGS_STORAGE_KEY = 'chat_settings'

// 使用会话store
const conversationStore = useConversationStore()
const {
  loadConversations,
  loadMessages,
  createNewChat,
  addMessage,
} = conversationStore
const {
  messageList,
  activeConversation,
} = storeToRefs(conversationStore)

// 本地状态
const showSettings = ref(false)
const chatMessagesComponent = ref<any>(null)
const sidebarLeftOpen = ref(true)
const chatHistory = ref<Conversation.Message[]>([])

// Settings
const settings = reactive<Setting.Item>({
  model: '',
  temperature: 0.7,
  maxTokens: 2000,
  contextLength: 10,
})

const doneTimeout = ref<number | null>(null)

watch(() => conversationStore.currentSession, (newValue, oldValue) => {
  if (newValue?.id !== oldValue?.id) {
    handleSessionChange()
  }
}, { deep: true })

// 启用模型
const loadOpenAIApiKey = async () => {
  try {
    // const result = await GetCloudLLMModels(1, 10)
    // // 获取被启用的云端模型
    // const enabledModel = result.items.find(model => model.enabled)

    // if (!enabledModel) {
    //   toast.error('未找到启用的云端模型配置')
    //   return false
    // }

    loadSettingsFromLocalStorage()
    return true
  } catch (error) {
    console.error('加载模型设置失败:', error)
    toast.error('加载模型设置失败')
    return false
  }
}

const handleSessionChange = async () => {
  chatHistory.value = []
  try {
    // TODO api 获取对话历史
    // const messages = await chatApi.getMessages(session.id)
    chatHistory.value = []
    setTimeout(() => {
      scrollToBottom()
    }, 0)
  } catch (error) {
    console.error('Error loading chat history:', error)
  }
}

// 输入消息
const handleSendMessage = async (input: string) => {
  if (!input.trim()) return

  // 调用API发送消息
  await sendOpenAIRequest(input)
}

const handleLoadMore = async (oldestMessageId: number) => {
  if (!activeConversation.value || activeConversation.value.id === 0) return

  if (!oldestMessageId || oldestMessageId === Infinity) {
    console.log('无法加载更多')
    return
  }

  await loadMessages(activeConversation.value.id, oldestMessageId, true)
  await scrollToBottom()
}

const toggleSettings = () => {
  showSettings.value = !showSettings.value
}

const updateSettings = ({ type, value }: { type: keyof Setting.Item, value: string | number }) => {
  settings[type] = value
  saveSettings()
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatMessagesComponent.value?.scrollToBottom) {
    chatMessagesComponent.value.scrollToBottom()
  }
}

const loadSettingsFromLocalStorage = () => {
  const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY)
  if (savedSettings) {
    try {
      const parsedSettings = JSON.parse(savedSettings)
      if (parsedSettings.temperature) {
        settings.temperature = Number(parsedSettings.temperature)
      }
      if (parsedSettings.maxTokens) {
        settings.maxTokens = Number(parsedSettings.maxTokens)
      }
      if (parsedSettings.contextLength) {
        settings.contextLength = Number(parsedSettings.contextLength)
      }
      if (parsedSettings.model) {
        settings.model = parsedSettings.model
      }
    } catch (error) {
      console.error('解析保存的设置失败:', error)
    }
  }
}

const saveSettings = () => {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
}

// API functions
const sendOpenAIRequest = async (userInput: string) => {
  // 获取当前活动会话ID
  const conversationId = activeConversation.value?.id || 0

  // 如果没有选中的会话，自动切换到新会话模式
  if (!messageList.value.length) {
    createNewChat()
  }

  try {
    // 添加用户和AI消息
    addMessage([{
      content: userInput,
      role: 'user',
    }, {
      role: 'assistant',
      content: '',
      typing: true,
    }])

    // 确保消息添加后滚动到底部
    await scrollToBottom()

    // TODO 模拟AI消息
    // setTimeout(() => {
    //   const lastMessage = messageList.value[messageList.value.length - 1]
    //   lastMessage.content = '模拟AI消息。'
    //   lastMessage.typing = false
    //   scrollToBottom()
    // }, 1000)
    // return

    // // 检查是否已选择模型
    // if (!settings.model) {
    //   toast.error('请先选择语言模型')
    //   return
    // }

    // 解析模型ID: 格式为 "configId:modelName"
    const [configIdStr, modelName] = settings.model.split(':')

    // if (!configIdStr || !modelName) {
    //   toast.error('模型ID格式错误')
    //   return
    // }

    // 获取云端模型配置
    const configId = Number(configIdStr)

    // 负责发起流式请求
    await handleSSE({
      cloud_llm_id: configId,
      conversation_id: conversationId,
      question: userInput,
      model_name: modelName,
      temperature: Number(settings.temperature),
      max_completion_tokens: Number(settings.maxTokens),
      history_length: Number(settings.contextLength),
    })

    // 流式输出完成，移除typing标记
    const lastMessage = messageList.value[messageList.value.length - 1]
    lastMessage.typing = false

    // 确保结束后再次滚动到底部
    await scrollToBottom()

    // 如果是新会话，刷新会话列表
    if (conversationId === 0) {
      await loadConversations()
    }
  } catch (error) {
    toast.error('发送请求失败，请稍后重试')
    console.error('发送请求失败:', error)

    // 移除typing消息
    const typingIndex = messageList.value.findIndex((msg: any) => msg.typing)
    if (typingIndex !== -1) {
      messageList.value.splice(typingIndex, 1)
    }
  }
}

// Event listeners
watch(settings, () => {
  saveSettings()
}, { deep: true })

watch(messageList.value, () => {
  scrollToBottom()
}, { deep: true })

// SSE 生成器
function* streamRequest() {
  let i = 0
  while (i < MOCK.length) {
    // 随机生成 1 到 20 之间的数
    const chunkSize = Math.floor(Math.random() * 20) + 1
    // 获取一个片段
    const chunk = MOCK.slice(i, i + chunkSize)
    yield chunk // 一次性返回这部分字符
    i += chunkSize // 更新索引，跳过已经返回的字符
    // 休眠
    yield new Promise(resolve => setTimeout(resolve, 50))
  }
}

// 处理 SSE 返回的内容
const processStep = (generator: Generator) => {
  // 获取生成迭代对象
  const result = generator.next()

  // 生成器结束
  if (result.done) return

  if (result.value instanceof Promise) {
    // 如果值是 Promise，等待它完成再继续
    result.value
      .then(() => {
        // 无意义的结果, 继续执行下一个步骤
        processStep(generator)
      })
      .catch((error: string) => {
        console.error('Error occurred during promise resolution:', error)
      })
  } else {
    // 查找最后一个typing的assistant消息
    const lastTypingIndex = messageList.value.slice().reverse().findIndex(msg => msg.role === 'assistant' && msg.typing)
    let lastMessage: any = {}

    if (lastTypingIndex !== -1) {
      lastMessage = messageList.value[messageList.value.length - 1 - lastTypingIndex]
    } else {
      lastMessage = messageList.value.slice().reverse().find(msg => msg.role === 'assistant')
    }
    lastMessage.content += result.value

    // 继续下一步
    processStep(generator)
  }
}

const handleSSE = async (data: any) => {
  console.log('🚀 ~ handleSSE ~ data:', data)
  const generator = streamRequest()
  // 开始处理生成器的每一步
  processStep(generator)
}

const handleShowConversation = (val: boolean) => {
  sidebarLeftOpen.value = val
}

onMounted(async () => {
  await loadOpenAIApiKey()
  window.addEventListener('resize', scrollToBottom)
})

onUnmounted(() => {
  if (doneTimeout.value) {
    clearTimeout(doneTimeout.value)
  }
  window.removeEventListener('resize', scrollToBottom)
})
</script>

<template>
  <div class="relative flex overflow-hidden">
    <!-- 会话列表 -->
    <ConversationList
      :sidebar-left-open="sidebarLeftOpen"
      @toggle-conversation="handleShowConversation"
    />
    <div class="flex relative flex-col justify-center items-center pb-4 w-full h-[calc(100dvh)] max-h-[calc(100dvh)]">
      <!-- 聊天头部 -->
      <ChatHeader
        :title="activeConversation.title"
        :sidebar-left-open="sidebarLeftOpen"
        :settings="settings"
        @toggle-settings="toggleSettings"
        @toggle-conversation="handleShowConversation"
        @update:settings="updateSettings"
      />
      <div class="grid overflow-y-auto relative w-full grid-rows-0 grow shrink">
        <!-- 消息列表区域 -->
        <Transition name="fade-slide" mode="out-in">
          <MessageList
            v-if="messageList.length"
            ref="chatMessagesComponent"
            :messages="messageList"
            @load-more="handleLoadMore"
          />
          <div v-else class="flex-1 flex overflow-y-auto flex-col flex-1 px-4 mx-auto w-full max-w-3xl grid-rows-0 justify-center items-center">
            <h1 class="text-2xl">有什么可以帮忙的？</h1>
          </div>
        </Transition>
      </div>
      <!-- 输入框区域 -->
      <ChatInput @send-msg="handleSendMessage" />
    </div>

    <!-- 设置面板 -->
    <SettingsPanel
      :sidebar-open="showSettings"
      :settings="settings"
      @close="toggleSettings"
      @update:settings="updateSettings"
    />
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: 0.5s;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  height: 0;
  transform: translateY(24px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
::-webkit-scrollbar {
  display: none;
}
</style>
