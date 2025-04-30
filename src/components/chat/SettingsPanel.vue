<script setup lang="ts">
import { X } from 'lucide-vue-next'

// Props definition
const props = defineProps({
  settings: {
    type: Object,
    required: true,
  },
})

// Define emits for the component
const emit = defineEmits(['close', 'update:settings'])

// Helper functions
// Temperature text formatter
function getTemperatureText() {
  return Math.round(props.settings.temperature * 10) / 10
}

// Response length text formatter
function getResponseLength() {
  const length = props.settings.maxTokens
  if (length <= 1167) {
    return '简短'
  }
  if (length <= 2334) {
    return '适中'
  }
  if (length <= 3500) {
    return '详细'
  }
  return '完整'
}

// Update handlers
function updateModel(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:settings', { ...props.settings, model: target.value })
}

function updateTemperature(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:settings', { ...props.settings, temperature: Number(target.value) })
}

function updateMaxTokens(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:settings', { ...props.settings, maxTokens: Number(target.value) })
}

function updateContextLength(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:settings', { ...props.settings, contextLength: Number(target.value) })
}

// Mock model options
const modelOptions = [
  { id: '1:gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
  { id: '1:gpt-4', name: 'GPT-4', provider: 'OpenAI' },
]
</script>

<template>
  <div class="absolute z-10 p-3 mt-10 border rounded-md shadow-lg right-6 w-72 bg-base-200 border-base-300">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-medium">对话设置</h3>
      <button class="p-1 transition-colors rounded-md hover:bg-base-300 opacity-70" @click="$emit('close')">
        <X :size="16" />
      </button>
    </div>

    <div class="space-y-3">
      <!-- 模型选择 -->
      <div>
        <label class="block mb-1 text-sm font-medium">语言模型</label>
        <select
          :value="settings.model"
          class="w-full bg-base-100 border border-base-300 rounded-md px-2 py-1.5 text-sm"
          @change="updateModel"
        >
          <option v-for="model in modelOptions" :key="model.id" :value="model.id">
            {{ model.name }} ({{ model.provider }})
          </option>
        </select>
      </div>

      <!-- 灵活度设置 -->
      <div>
        <label class="block mb-1 text-sm font-medium">
          回答灵活度
          <span class="text-xs opacity-60">（{{ getTemperatureText() }}）</span>
        </label>
        <input
          type="range"
          :value="settings.temperature"
          min="0"
          max="1" step="0.1" class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-base-300"
          @input="updateTemperature"
        >
        <div class="flex justify-between mt-1 text-xs opacity-60">
          <span>精确</span>
          <span>创造性</span>
        </div>
      </div>

      <!-- 回答长度设置 -->
      <div>
        <label class="block mb-1 text-sm font-medium">
          回答长度
          <span class="text-xs opacity-60">（{{ getResponseLength() }}）</span>
        </label>
        <input
          type="range"
          :value="settings.maxTokens"
          :min="500"
          :max="4001" :step="1167" class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-base-300"
          @input="updateMaxTokens"
        >
        <div class="flex justify-between mt-1 text-xs opacity-60">
          <span>简短</span>
          <span>适中</span>
          <span>详细</span>
          <span>完整</span>
        </div>
        <p class="mt-1 text-xs opacity-60">调整AI回答的详细程度</p>
      </div>

      <!-- 上下文长度设置 -->
      <div>
        <label class="block mb-1 text-sm font-medium">
          上下文长度
          <span class="text-xs opacity-60">（{{ settings.contextLength }}轮对话）</span>
        </label>
        <input
          type="range"
          :value="settings.contextLength"
          :min="1"
          :max="20" :step="1" class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-base-300"
          @input="updateContextLength"
        >
        <div class="flex justify-between mt-1 text-xs opacity-60">
          <span>1轮</span>
          <span>20轮</span>
        </div>
        <p class="mt-1 text-xs opacity-60">调整AI能记住的对话轮数</p>
      </div>
    </div>
  </div>
</template>
