<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { Slider } from '@/components/ui/slider'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  settings: Setting.Item
  sidebarOpen: boolean
}>()

const emit = defineEmits(['close', 'update:settings'])

function getTemperatureText() {
  return Math.round(props.settings.temperature * 10) / 10
}

function updateTemperature(value: number[] | undefined) {
  emit('update:settings', { type: 'temperature', value: Number(value?.[0]) })
}

function updateMaxTokens(value: number[] | undefined) {
  emit('update:settings', { type: 'maxTokens', value: Number(value?.[0]) })
}

function updateContextLength(value: number[] | undefined) {
  emit('update:settings', { type: 'contextLength', value: Number(value?.[0]) })
}
</script>

<template>
  <SidebarProvider
    :open="sidebarOpen"
    class="w-auto"
    :style="{ '--sidebar-width': '300px' }"
  >
    <Sidebar side="right">
      <SidebarHeader class="flex-row items-center justify-between h-[64px] p-3 border-b">
        <h3 class="text-sm font-medium">对话设置</h3>
        <Button variant="link" size="icon" @click="$emit('close')">
          <X :size="16" />
        </Button>
      </SidebarHeader>

      <SidebarContent class="p-3">
        <!-- 灵活度设置 -->
        <div class="mb-3">
          <Label class="block mb-3 text-sm font-medium">
            回答灵活度
            <span class="text-xs opacity-60">（{{ getTemperatureText() }}）</span>
          </Label>
          <Slider
            :modelValue="[settings.temperature]"
            class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-base-300"
            :min="0"
            :max="1"
            :step="0.1"
            @update:model-value="updateTemperature"
          />
          <div class="flex justify-between mt-1 text-xs opacity-60">
            <span>精确</span>
            <span>创造性</span>
          </div>
        </div>

        <!-- 回答长度设置 -->
        <div class="mb-3">
          <Label class="block mb-3 text-sm font-medium">
            回答长度
          </Label>
          <Slider
            :modelValue="[settings.maxTokens]"
            :min="500"
            :max="4001"
            :step="1167"
            class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-base-300"
            @update:model-value="updateMaxTokens"
          />
          <div class="flex justify-between mt-1 text-xs opacity-60">
            <span>简短</span>
            <span>适中</span>
            <span>详细</span>
            <span>完整</span>
          </div>
        </div>

        <!-- 上下文长度设置 -->
        <div class="mb-3">
          <Label class="block mb-3 text-sm font-medium">
            上下文长度
            <span class="text-xs opacity-60">（{{ settings.contextLength }}轮对话）</span>
          </Label>
          <Slider
            :modelValue="[settings.contextLength]"
            :min="1"
            :max="20"
            :step="1"
            class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-base-300"
            @update:model-value="updateContextLength"
          />
          <div class="flex justify-between mt-1 text-xs opacity-60">
            <span>1轮</span>
            <span>20轮</span>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  </SidebarProvider>
</template>
