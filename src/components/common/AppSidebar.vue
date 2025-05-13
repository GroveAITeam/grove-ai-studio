<script setup lang="ts">
import type {
  SidebarProps,
} from '@/components/ui/sidebar'
import Logo from '@/assets/images/appicon.png'
import NavMain from '@/components/common/NavMain.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { navigator } from '@/router/navigator'

import { useConversationStore } from '@/store/conversation'
import {
  Bot,
  MessageCircle,
  Settings2,
} from 'lucide-vue-next'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})
const conversationStore = useConversationStore()
const {
  createNewChat,
} = conversationStore

const content: Nav.Item[] = [
  {
    title: '开启新对话',
    url: '/',
    icon: MessageCircle,
    isActive: true,
    action: createNewChat,
  },
  {
    title: '模型配置',
    url: '/LLM/index',
    icon: Bot,
  },
]
const footer = {
  title: '设置',
  url: '/setting',
  icon: Settings2,
}

const handelPath = (path: string) => {
  navigator.navigate(path)
}
</script>

<template>
  <Sidebar v-bind="props" :default-open="false">
    <SidebarHeader class="justify-center items-center mt-4">
      <img style="width: 24px;height: 24px;" :src="Logo">
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="content" />
    </SidebarContent>
    <SidebarFooter class="justify-center items-center">
      <SidebarMenuButton class="cursor-pointer" :tooltip="footer.title" @click="handelPath(footer.url)">
        <component :is="footer.icon" v-if="footer.icon" style="width: 16px;height: 16px;" />
        <span>{{ footer.title }}</span>
      </SidebarMenuButton>
    </SidebarFooter>
  </Sidebar>
</template>
