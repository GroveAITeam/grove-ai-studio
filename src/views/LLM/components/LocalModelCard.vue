<script lang="ts" setup>
import { ref } from 'vue'
import ModelSizeSelector from './ModelSizeSelector.vue'
import SystemRequirements from './SystemRequirements.vue'

// 模型大小选项
const modelSizes = ref([
  { id: 'small', label: '轻量版', active: true },
  { id: 'medium', label: '标准版', active: false },
  { id: 'large', label: '增强版', active: false },
])

// 当前选中的模型大小信息
const currentModelInfo = ref({
  size: '1-3B 参数',
  description: '适合日常对话和简单任务，对硬件要求较低',
  compatibility: {
    status: 'compatible',
    text: '兼容',
    specs: [
      { icon: '💻', name: 'CPU: i5 12代', compatible: true },
      { icon: '📊', name: '内存: 16GB', compatible: true },
      { icon: '🎮', name: '显卡: GTX 1060', compatible: true },
    ],
  },
})

// 切换模型大小
const switchModelSize = (size: string) => {
  modelSizes.value.forEach(s => s.active = s.id === size)

  if (size === 'small') {
    currentModelInfo.value = {
      size: '1-3B 参数',
      description: '适合日常对话和简单任务，对硬件要求较低',
      compatibility: {
        status: 'compatible',
        text: '兼容',
        specs: [
          { icon: '💻', name: 'CPU: i5 12代', compatible: true },
          { icon: '📊', name: '内存: 16GB', compatible: true },
          { icon: '🎮', name: '显卡: GTX 1060', compatible: true },
        ],
      },
    }
  } else if (size === 'medium') {
    currentModelInfo.value = {
      size: '7-13B 参数',
      description: '适合更复杂的任务，能处理多种语言和领域知识',
      compatibility: {
        status: 'compatible',
        text: '兼容',
        specs: [
          { icon: '💻', name: 'CPU: i5 12代', compatible: true },
          { icon: '📊', name: '内存: 16GB', compatible: true },
          { icon: '🎮', name: '显卡: GTX 1060', compatible: true },
        ],
      },
    }
  } else {
    currentModelInfo.value = {
      size: '30B+ 参数',
      description: '适合高级任务，提供最高质量输出，但需要强大硬件',
      compatibility: {
        status: 'incompatible',
        text: '不兼容',
        specs: [
          { icon: '💻', name: 'CPU: i5 12代', compatible: true },
          { icon: '📊', name: '内存: 16GB', compatible: false },
          { icon: '🎮', name: '显卡: GTX 1060', compatible: false },
        ],
      },
    }
  }
}
</script>

<template>
  <div class="bg-base-200/50 border-base-300/50 border min-w-0 rounded-xl p-4 relative backdrop-blur-md h-full flex flex-col">
    <div class="flex justify-between items-center mb-3">
      <h2>本地模型</h2>
      <span class="bg-[rgb(243.9,244.2,244.8)] text-[#909399] px-2 py-1 rounded text-xs">即将推出</span>
    </div>
    <div class="flex flex-col gap-4">
      <p class="text-base-content/80 text-sm">在您自己的设备上本地运行AI模型，完全保护数据隐私</p>
      <!-- 特性标签 -->
      <div class="flex flex-wrap gap-2">
        <div class="bg-base-300/50 text-base-content flex items-center gap-1 px-2 py-1 rounded text-xs">
          <span>🔒</span>
          数据完全私有
        </div>
        <div class="bg-base-300/50 text-base-content flex items-center gap-1 px-2 py-1 rounded text-xs">
          <span>⚡️</span>
          低延迟响应
        </div>
        <div class="bg-base-300/50 text-base-content flex items-center gap-1 px-2 py-1 rounded text-xs">
          <span>🔌</span>
          无需联网
        </div>
      </div>

      <!-- 简化的运行要求区域 -->
      <div class="bg-base-300/50 rounded-lg p-3">
        <div class="flex justify-between items-center mb-3">
          <h3>运行要求</h3>
          <ModelSizeSelector
            :model-sizes="modelSizes"
            @switch="switchModelSize"
          />
        </div>

        <SystemRequirements :model-info="currentModelInfo" />
      </div>

      <button class="bg-base-300/50 text-base-content/50 w-full py-3 border-none rounded-lg text-sm cursor-not-allowed" disabled>敬请期待</button>
    </div>
  </div>
</template>
