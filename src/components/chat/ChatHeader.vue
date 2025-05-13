<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { PanelLeft, PanelRight } from 'lucide-vue-next'

defineProps<{
  title: string
  sidebarLeftOpen: boolean
}>()

const emit = defineEmits(['toggleSettings', 'toggleConversation', 'toggleSetting'])

const handleShowList = (val: boolean) => {
  emit('toggleConversation', val)
}

const handleShowSetting = (val: boolean) => {
  emit('toggleSetting', val)
}
</script>

<template>
  <header
    class="w-full sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4 justify-between h-[64px] py-0 max-sm:h-[40px]"
  >
    <div class="flex items-center gap-2">
      <Button
        size="icon"
        variant="ghost"
        class="h-7 w-7 max-sm:hidden cursor-pointer"
        style="-webkit-app-region: no-drag"
        @click="handleShowList(!sidebarLeftOpen)"
      >
        <PanelLeft />
      </Button>
    </div>
    <div class="flex items-center gap-2">
      <Button
        size="icon"
        variant="ghost"
        class="h-7 w-7 max-sm:hidden cursor-pointer"
        @click="handleShowSetting"
      >
        <PanelRight />
      </Button>
    </div>
  </header>
</template>
