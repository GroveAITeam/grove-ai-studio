<script setup lang="ts">
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { navigator } from '@/router/navigator'

defineProps<{
  items: Nav.Item[]
}>()

const handelPath = (item: Nav.Item) => {
  const { url, action } = item
  navigator.navigate(url)
  action?.()
}
</script>

<template>
  <SidebarGroup>
    <SidebarMenu>
      <SidebarMenuItem
        v-for="item in items"
        :key="item.title"
        class="flex justify-center items-center mt-3"
      >
        <SidebarMenuButton class="cursor-pointer" :tooltip="item.title" @click="handelPath(item)">
          <component :is="item.icon" v-if="item.icon" style="width: 24px;height: 24px;" />
          <span>{{ item.title }}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>
