<script setup lang="ts">
import ChatHeader from '@/components/chat/ChatHeader.vue'
import ChatInput from '@/components/chat/ChatInput.vue'
import MessageList from '@/components/chat/MessageList.vue'
import SettingsPanel from '@/components/chat/SettingsPanel.vue'
import { useConversationStore } from '@/store/conversation'
// import {
//   GetCloudLLMModels,
//   StreamRequestMessage,
// } from '@wailsjs/go/main/App'
import { storeToRefs } from 'pinia'
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { toast } from 'vue-sonner'

// Constants
const SETTINGS_STORAGE_KEY = 'chat_settings'

// 使用会话store
const conversationStore = useConversationStore()
const {
  updateChatMode,
  loadConversations,
  loadMessages,
  createNewChat,
  addMessage,
} = conversationStore
const {
  messageList,
  isChatMode,
  activeConversation,
} = storeToRefs(conversationStore)

// 本地状态
const showSettings = ref(false)
const chatMessagesComponent = ref<any>(null)

// Settings
const settings = reactive({
  model: '',
  temperature: 0.7,
  maxTokens: 2000,
  contextLength: 10,
})

// Stream handling
// const streamChunks = ref<Map<number, string>>(new Map())
// const pendingDone = ref<boolean>(false)
const doneTimeout = ref<number | null>(null)

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

const updateSettings = (newSettings: typeof settings) => {
  Object.assign(settings, newSettings)
  saveSettings()
}

const handleClickOutside = (event: MouseEvent) => {
  const settingsPanel = document.querySelector('.settings-panel')
  const settingsButton = document.querySelector('.settings-button')

  if (settingsPanel
    && !settingsPanel.contains(event.target as Node)
    && settingsButton
    && !settingsButton.contains(event.target as Node)) {
    showSettings.value = false
  }
}

// Utility
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
  if (conversationId === 0 && !isChatMode.value) {
    createNewChat()
    updateChatMode(true)
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
    setTimeout(() => {
      const lastMessage = messageList.value[messageList.value.length - 1]
      lastMessage.content = '模拟AI消息。'
      lastMessage.typing = false
      scrollToBottom()
    }, 1000)
    return

    // 检查是否已选择模型
    if (!settings.model) {
      toast.error('请先选择语言模型')
      return
    }

    // 解析模型ID: 格式为 "configId:modelName"
    const [configIdStr, modelName] = settings.model.split(':')

    if (!configIdStr || !modelName) {
      toast.error('模型ID格式错误')
      return
    }

    // 获取云端模型配置
    // const configId = Number(configIdStr)

    // 负责发起流式请求
    // await StreamRequestMessage({
    //   cloud_llm_id: configId,
    //   conversation_id: conversationId,
    //   question: userInput,
    //   model_name: modelName,
    //   temperature: Number(settings.temperature),
    //   max_completion_tokens: Number(settings.maxTokens),
    //   history_length: Number(settings.contextLength),
    // })

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

watch(messageList.value, async () => {
  await scrollToBottom()
}, { deep: true })

// Stream event handling
// EventsOn('stream-request-message', (data) => {
//   if (typeof data.index !== 'number') { return }

//   // 查找最后一个typing的assistant消息
//   const lastTypingIndex = messageList.slice().reverse().findIndex(msg => msg.role === 'assistant' && msg.typing)
//   let lastMessage

//   if (lastTypingIndex !== -1) {
//     lastMessage = messageList[messageList.length - 1 - lastTypingIndex]
//   }
//   else {
//     lastMessage = messageList.slice().reverse().find(msg => msg.role === 'assistant')
//   }

//   if (lastMessage) {
//     try {
//       if (data.done) {
//         pendingDone.value = true
//         if (doneTimeout.value) {
//           clearTimeout(doneTimeout.value)
//         }
//         doneTimeout.value = setTimeout(() => {
//           streamChunks.value.clear()
//           pendingDone.value = false
//           doneTimeout.value = null
//         }, 200) as unknown as number
//         return
//       }

//       if (data.content) {
//         streamChunks.value.set(data.index, data.content)

//         lastMessage.content = ''
//         const sortedIndices = Array.from(streamChunks.value.keys()).sort((a, b) => a - b)
//         for (const index of sortedIndices) {
//           const chunk = streamChunks.value.get(index)
//           if (chunk) {
//             lastMessage.content += chunk
//           }
//         }

//         if (lastMessage.content.length % 10 === 0) {
//           scrollToBottom()
//         }
//       }
//     }
//     catch (error) {
//       console.error('处理流式消息出错:', error)
//     }
//   }
// })

// Lifecycle hooks
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
  <div class="flex overflow-hidden flex-col w-full h-screen" @click="showSettings && handleClickOutside($event)">
    <div class="flex relative flex-col justify-center items-center pb-8 w-full h-full">
      <!-- 聊天头部 -->
      <ChatHeader
        v-if="isChatMode"
        :title="activeConversation.title"
        class="settings-button"
        @toggle-settings="toggleSettings"
      />
      <div class="grid overflow-y-auto relative w-full" :class="[{ 'grid-rows-0 grow shrink': isChatMode }, { 'grid-rows-1': !isChatMode }]">
        <!-- 消息列表区域 -->
        <Transition name="fade-slide" mode="out-in">
          <MessageList
            v-if="isChatMode"
            ref="chatMessagesComponent"
            key="msglist"
            :messages="messageList"
            class=""
            @load-more="handleLoadMore"
          />
        </Transition>
      </div>
      <!-- 主标题区域 -->
      <div v-if="!isChatMode" class="mb-8">
        <h1 class="text-2xl">有什么可以帮忙的？</h1>
      </div>
      <!-- 输入框区域 -->
      <ChatInput @send-msg="handleSendMessage" />
    </div>

    <!-- 设置面板 -->
    <SettingsPanel
      v-if="showSettings"
      :settings="settings"
      class="settings-panel"
      @close="toggleSettings"
      @update:settings="updateSettings"
    />
  </div>
</template>

<style scoped>
.title {
  transform: translateX(-50%);
}
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
