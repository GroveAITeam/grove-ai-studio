declare namespace Nav {
  interface Item {
    title: string
    url: string
    icon?: any
    isActive?: boolean
    action?: () => void
  }
}
