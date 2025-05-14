<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { useConversationStore } from '@/store/conversation'
import dayjs from 'dayjs'
import { EllipsisVertical, Loader2, Plus, Trash2 } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'
import 'dayjs/locale/zh-cn'

defineProps<{
  sidebarLeftOpen: boolean
}>()

const conversationStore = useConversationStore()
// 设置语言为中文
dayjs.locale('zh-cn')

const sessions = computed(() => conversationStore.conversations)
const activeSessionId = computed(() => conversationStore.activeSessionId)

// 创建新对话
const createNewChat = async () => {
  try {
    await conversationStore.createNewChat()
  } catch (error) {
    console.error('Failed to create chat:', error)
  }
}

// 切换会话
const handleSessionChange = (session: Conversation.Item) => {
  conversationStore.setActiveSession(session)
}

// 删除会话
const deleteLoading = ref(false)
const sessionToDelete = ref<Conversation.Item | null>(null)

const handleRemoveSession = (item: Conversation.Item) => {
  sessionToDelete.value = JSON.parse(JSON.stringify(item))
  console.log(sessionToDelete.value)
}

const handleCancelDelete = () => {
  sessionToDelete.value = null
  deleteLoading.value = false
}

const confirmDeleteSession = async () => {
  if (!sessionToDelete.value) return
  deleteLoading.value = true
  try {
    const res = await conversationStore.removeSession(sessionToDelete.value.id)
    if (res) {
      // 如果还有其他会话，切换到第一个
      if (conversationStore.conversations.length > 0) {
        handleSessionChange(conversationStore.conversations[0])
      }
      toast({
        title: '删除成功',
        description: `会话 ${sessionToDelete.value.title} 已被删除`,
      })
    }
  } catch (error) {
    console.error('Failed to delete session:', error)
    toast({
      title: '删除失败',
      variant: 'destructive',
      description: (error as Error).message || '删除失败',
    })
  } finally {
    deleteLoading.value = false
    sessionToDelete.value = null
  }
}
onMounted(async () => {
  const localActiveSession = localStorage.getItem('activeSession')
  if (localActiveSession) {
    const activeSession = JSON.parse(localActiveSession)
    conversationStore.setActiveSession(activeSession)
    handleSessionChange(activeSession)
  }
  await conversationStore.loadConversations()
})

// 添加时间分组函数
const getTimeGroup = (date: string) => {
  const now = dayjs()
  const targetDate = dayjs(date)
  const diffDays = now.diff(targetDate, 'day')

  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays <= 7) return '7天内'
  if (diffDays <= 30) return '30天内'

  // 如果是不同年份，显示完整年月
  if (targetDate.year() !== now.year()) {
    return targetDate.format('YYYY年M月')
  }
  // 同年不同月
  return targetDate.format('M月')
}

// 对会话列表进行分组
const groupedSessions = computed(() => {
  if (!sessions.value) return {}

  const groups: Record<string, Conversation.Item[]> = {}
  sessions.value.forEach((session: Conversation.Item) => {
    const group = getTimeGroup(session.created_at)
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(session)
  })

  return groups
})
</script>

<template>
  <!-- 添加确认对话框 -->
  <AlertDialog :open="!!sessionToDelete">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>确认删除会话?</AlertDialogTitle>
        <AlertDialogDescription>
          此操作将删除会话 {{ sessionToDelete?.title }}，删除后无法恢复。
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="handleCancelDelete">取消</AlertDialogCancel>
        <AlertDialogAction :disabled="deleteLoading" @click="confirmDeleteSession">
          <Loader2 v-if="deleteLoading" class="mr-2 h-4 w-4 animate-spin" />
          {{ deleteLoading ? '删除中...' : '确认删除' }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  <SidebarProvider
    :open="sidebarLeftOpen"
    class="w-auto"
    :style="{ '--sidebar-width': '200px' }"
  >
    <Sidebar class="hidden flex-1 md:flex absolute">
      <SidebarHeader class="gap-3.5 border-b p-4 h-[64px]">
        <div class="flex w-full items-center justify-center">
          <Label class="flex items-center gap-2 text-sm">
            <Button size="sm" @click="createNewChat">
              <Plus class="w-4 h-4" /><span class="text-xs font-normal">新对话</span>
            </Button>
          </Label>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea class="w-full h-[calc(100dvh-64px)]">
          <SidebarGroup class="px-0">
            <template v-for="(list, groupName) in groupedSessions" :key="groupName">
              <SidebarGroupLabel class="pl-4 mt-2 text-xs text-gray-400">
                {{
                  groupName
                }}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <template v-for="item in list" :key="item.id">
                  <a
                    href="#"
                    class="group/item flex justify-between items-center px-4 py-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    :class="
                      item.id === activeSessionId
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : ''
                    "
                    @click="handleSessionChange(item)"
                  >
                    <div class="flex-1 max-w-[80%] space-y-2">
                      <div
                        class="truncate text-gray-950 dark:text-white"
                        :class="item.id === activeSessionId ? 'font-bold' : 'font-normal'"
                      >
                        {{ item.title }}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <Button
                          class="invisible group-hover/item:visible"
                          size="icon"
                          variant="ghost"
                          @click.stop=""
                        >
                          <EllipsisVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" side="right">
                        <DropdownMenuItem
                          class="text-red-600 hover:text-red-500 cursor-pointer"
                          @click.stop="handleRemoveSession(item)"
                        >
                          <Trash2 class="hover:text-red-500" /> 删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </a>
                </template>
              </SidebarGroupContent>
            </template>
          </SidebarGroup>
          <ScrollBar />
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  </SidebarProvider>
</template>
