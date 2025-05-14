<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { LLM_PROVIDERS } from '@/constants/LLMProviders'
import { ArrowUpRight, PanelLeft, Settings } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

defineProps<{
  title: string
  sidebarLeftOpen: boolean
  settings: Setting.Item
}>()

const emit = defineEmits(['toggleConversation', 'toggleSettings', 'update:settings'])

const router = useRouter()

// 云端模型列表
const cloudModels = ref<Setting.CloudModel[]>([])

// 初始化
onMounted(async () => {
  await loadCloudModels()
})

// 加载云端模型
const loadCloudModels = async () => {
  try {
    // TODO Api
    // const result = await GetCloudLLMModels(1, 100);

    const modelOptions: Setting.CloudModel[] = [
      { id: 1, name: 'GPT-3.5 Turbo', provider: 'openai', endpoint: 'string', api_key: 'string', enabled: true },
      { id: 2, name: 'DeepSeek', provider: 'deepseek', endpoint: 'string', api_key: 'string', enabled: true },
    ]
    cloudModels.value = modelOptions
  } catch (error) {
    console.error('加载云端模型失败:', error)
  }
}

// 获取所有可用模型，按照provider+name分组
const availableModels = computed(() => {
  const models: Setting.Model[] = []

  // 根据云端返回的启用的模型进行过滤
  cloudModels.value.forEach((cloudModel) => {
    if (cloudModel.enabled) {
      // 找到对应的提供商信息
      const providerInfo = LLM_PROVIDERS.find(p => p.id === cloudModel.provider)

      if (providerInfo) {
        // 添加该提供商下的所有模型
        providerInfo.models.forEach((modelName) => {
          models.push({
            // 组合ID：云端配置ID + 模型名，用于唯一标识
            id: `${cloudModel.id}:${modelName}`,
            name: modelName,
            provider: cloudModel.provider, // 使用原始provider ID
            provider_display: providerInfo.name, // 用于显示的提供商名称
            config_name: cloudModel.name,
          })
        })
      }
    }
  })

  return models
})

// 按提供商分组
const modelGroups = computed(() => {
  const groups: { [key: string]: Setting.Model[] } = {}

  availableModels.value.forEach((model) => {
    const groupKey = `${model.config_name}`
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(model)
  })
  return groups
})

const handleShowList = (val: boolean) => {
  emit('toggleConversation', val)
}

const handleShowSetting = (val: boolean) => {
  emit('toggleSettings', val)
}

function updateModel(value: AcceptableValue) {
  emit('update:settings', { type: 'model', value })
}

const handleConfigModel = () => {
  router.push({ path: '/LLM/index' })
}
</script>

<template>
  <header
    class="w-full sticky top-0 flex shrink-0 items-center gap-5 border-b bg-background p-4 justify-between h-[64px] py-0"
  >
    <div class="flex items-center gap-2">
      <Button
        size="icon"
        variant="ghost"
        class="h-7 w-7 cursor-pointer"
        style="-webkit-app-region: no-drag"
        @click="handleShowList(!sidebarLeftOpen)"
      >
        <PanelLeft />
      </Button>
      <Separator orientation="vertical" class="h-4 mr-2" />
      <Label class="whitespace-nowrap font-normal">选择模型:</Label>
      <!-- 模型选择 -->
      <Select
        :modelValue="settings.model"
        @update:model-value="updateModel"
      >
        <SelectTrigger class="w-full bg-base-100 border border-base-300 rounded-md px-2 py-1.5 text-sm min-w-40">
          <SelectValue placeholder="请选择语言模型" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup v-for="(models, groupName) in modelGroups" :key="groupName" :label="groupName">
            <SelectLabel class="flex align-center">
              <span class="text-gray-400">{{ groupName }}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <ArrowUpRight class="ml-2 cursor-pointer" :size="14" @click="handleConfigModel" />
                  </TooltipTrigger>
                  <TooltipContent>点击配置模型</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </SelectLabel>
            <SelectItem v-for="model in models" :key="model.id" :value="model.id">
              {{ model.name }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    <div class="flex items-center">
      <Button
        size="icon"
        variant="ghost"
        class="h-7 cursor-pointer"
        @click="handleShowSetting"
      >
        <Settings />
      </Button>
    </div>
  </header>
</template>
