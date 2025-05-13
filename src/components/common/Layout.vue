<script setup lang="ts">
import AppSidebar from '@/components/common/AppSidebar.vue'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ref } from 'vue'

const sidebarLeftOpenMain = ref(false)
</script>

<template>
  <SidebarProvider v-model:open="sidebarLeftOpenMain">
    <AppSidebar />
    <div class="flex-1 overflow-auto">
      <slot />
    </div>
  </SidebarProvider>
</template>
