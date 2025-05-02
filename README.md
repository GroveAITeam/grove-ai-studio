
# 🌲 Grove Studio 项目

<p align="center">
  <a href=""><img src="./doc/images/logo.png" width="150px"></a>
</p>

<p align="center">
  <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue-3.5-brightgreen.svg" alt="Vue Version"></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-6.3-646cff.svg" alt="Vite"></a>
  <a href="https://tauri.app/"><img src="https://img.shields.io/badge/Tauri-2.0-FE5F27.svg" alt="Tauri Version"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-4.1-38bdf8.svg" alt="TailwindCSS"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.7-3178c6.svg" alt="TypeScript Version"></a>
</p>

## 📋 目录

- [🌲 Grove Studio 项目](#-grove-studio-项目)
  - [📋 目录](#-目录)
  - [✨ 项目介绍](#-项目介绍)
  - [⚙️ 环境要求](#️-环境要求)
    - [系统要求](#系统要求)
  - [🏀 Tauri 开发环境](#-tauri-开发环境)
      - [Tauri环境安装文档](#tauri环境安装文档)
  - [🚀 快速开始](#-快速开始)
  - [💻 开发规范](#-开发规范)
    - [Git Commit 规范](#git-commit-规范)
  - [📦 主要依赖包介绍](#-主要依赖包介绍)
    - [核心依赖](#核心依赖)
    - [UI相关](#ui相关)
    - [开发工具](#开发工具)
  - [🧩 组件系统](#-组件系统)
  - [📚 相关文档](#-相关文档)

## ✨ 项目介绍

Grove Studio 是一个基于 Tauri + Vue 3 开发的跨平台桌面应用程序。

## ⚙️ 环境要求

### 系统要求

- **Node.js**: ^18.18.0 || ^20.9.0 || >=21.1.0
- **包管理器**: pnpm >= 7.33.7

## 🏀 Tauri 开发环境

#### [Tauri环境安装文档](https://tauri.nodejs.cn/start/prerequisites/) 


## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动 Tauri 开发环境
npm run tauri dev

# 构建生产版本
npm run tauri build
```

## 💻 开发规范

### Git Commit 规范

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/) 规范，通过 commitlint 进行检查。

提交格式：
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

常用的 type 类型：

- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档更新
- `style`: 代码格式修改，不影响代码逻辑
- `refactor`: 代码重构，不新增功能也不修复 Bug
- `perf`: 性能优化
- `test`: 新增或修改测试用例
- `build`: 构建系统或外部依赖项的修改
- `ci`: CI/CD 配置修改
- `chore`: 其他不修改源代码与测试的修改
- `revert`: 回退之前的提交

示例：
```bash
# 新功能
git commit -m "feat: 添加用户登录功能"

# 修复 Bug
git commit -m "fix: 修复登录页面按钮点击无响应的问题"

# 文档更新
git commit -m "docs: 更新 README 安装说明"
```


## 📦 主要依赖包介绍

### 核心依赖

| 依赖包           | 版本    | 描述                                   |
| ---------------- | ------- | -------------------------------------- |
| **vue**          | ^3.5.13 | 渐进式JavaScript框架，本项目的核心框架 |
| **vue-router**   | ^4.5.0  | Vue官方路由管理器                      |
| **pinia**        | ^3.0.2  | Vue官方推荐的状态管理库，替代Vuex      |
| **vite**         | ^6.3.1  | 现代前端构建工具，提供极速的开发体验   |
| **@vueuse/core** | ^13.1.0 | 实用的Vue组合式API工具集               |

### UI相关

| 依赖包                       | 版本     | 描述                                  |
| ---------------------------- | -------- | ------------------------------------- |
| **shadcn/vue**               | -        | 高质量UI组件库，基于Tailwind CSS      |
| **tailwindcss**              | ^4.1.4   | 实用优先的CSS框架                     |
| **@tailwindcss/vite**        | ^4.1.4   | Tailwind CSS的Vite插件                |
| **tailwind-merge**           | ^3.2.0   | 智能合并Tailwind CSS类                |
| **tw-animate-css**           | ^1.2.8   | Tailwind CSS动画库                    |
| **lucide-vue-next**          | ^0.501.0 | 美观的图标库                          |
| **class-variance-authority** | ^0.7.1   | 用于创建类型安全的UI组件变体          |
| **clsx**                     | ^2.1.1   | 用于有条件地构建className字符串的工具 |

### 开发工具

| 依赖包                   | 版本    | 描述                           |
| ------------------------ | ------- | ------------------------------ |
| **typescript**           | ~5.7.2  | JavaScript的超集，添加静态类型 |
| **eslint**               | ^9.24.0 | 代码质量和风格检查工具         |
| **@antfu/eslint-config** | ^4.12.0 | Anthony Fu的ESLint配置         |
| **vue-tsc**              | ^2.2.8  | Vue文件的TypeScript类型检查    |
| **sass-embedded**        | ^1.87.0 | Sass预处理器                   |


## 🧩 组件系统

项目使用 shadcn/vue 作为 UI 组件库，提供了一系列可定制的组件。添加新组件的方法：

```bash
# 添加按钮组件
npx shadcn-vue@latest add button

# 添加对话框组件
npx shadcn-vue@latest add dialog

# 添加表单组件
npx shadcn-vue@latest add form
```

组件示例：

```vue
<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <Button variant="default">点击我</Button>
  <Button variant="destructive">删除</Button>
  <Button variant="outline">轮廓</Button>
</template>
```

## 📚 相关文档

- [Tauri](https://tauri.app/)
- [Vue 3](https://vuejs.org/)
- [Vue Router文档](https://router.vuejs.org/)
- [VueUse](https://vueuse.nodejs.cn/guide/)
- [Pinia文档](https://pinia.vuejs.org/)
- [Vite文档](https://vitejs.dev/)
- [TypeScript文档](https://www.typescriptlang.org/)
- [Tailwind CSS文档](https://tailwindcss.com/)
- [shadcn/vue文档](https://www.shadcn-vue.com/)
- [lucide-vue-next图标库](https://lucide.dev/icons/)
