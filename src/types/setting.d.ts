declare namespace Setting {
  interface Item {
    model: string
    temperature: number
    maxTokens: number
    contextLength: number
    [key: string]: string | number
  }

  interface CloudModel {
    id: number
    name: string // 配置名称
    provider: string // 提供商ID
    endpoint: string
    api_key: string
    enabled: boolean
  }

  interface Model {
    id: string
    name: string
    provider: string // 提供商ID
    provider_display: string // 提供商显示名称
    config_name: string // 配置名称
  }
}
