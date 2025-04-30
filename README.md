
# 🌲 Grove Studio 项目

<p align="center">
  <a href=""><img src="./doc/images/logo.png" width="150px"></a>
</p>

<p align="center">
  <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue-3.5-brightgreen.svg" alt="Vue Version"></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-6.3-646cff.svg" alt="Vite"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-4.1-38bdf8.svg" alt="TailwindCSS"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.7-3178c6.svg" alt="Vue Version"></a>
</p>

## 📋 目录

- [🌲 Grove Studio 项目](#-grove-studio-项目)
  - [📋 目录](#-目录)
  - [✨ 项目介绍](#-项目介绍)
  - [⚙️ 环境要求](#️-环境要求)
  - [🚀 快速开始](#-快速开始)
  - [📂 项目目录结构](#-项目目录结构)
  - [📦 主要依赖包介绍](#-主要依赖包介绍)
    - [核心依赖](#核心依赖)
    - [UI相关](#ui相关)
    - [网络请求](#网络请求)
    - [开发工具](#开发工具)
  - [🛠️ 开发命令](#️-开发命令)
  - [🧩 组件系统](#-组件系统)
  - [📚 相关文档](#-相关文档)

## ✨ 项目介绍

基于 Vue 3、Vite、TypeScript 和 Tailwind CSS 构建

使用 shadcn/vue 作为 UI 组件库，结合 Pinia 进行状态管理

## ⚙️ 环境要求

| 依赖项       | 版本要求                            |
| ------------ | ----------------------------------- |
| **Node.js**  | ^18.18.0 \|\| ^20.9.0 \|\| >=21.1.0 |
| **包管理器** | pnpm >= 7.33.7                      |

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm dev

# 构建生产版本
npm build
```

## 📂 项目目录结构

```
├── public/              # 静态资源目录
├── src/                 # 源代码目录
│   ├── api/             # API接口定义和请求封装
│   ├── assets/          # 项目资源文件(图片、字体等)
│   ├── components/      # 公共组件
│   │   ├── common/      # 通用组件
│   │   └── ui/          # UI组件库
│   ├── lib/             # 工具库
│   ├── router/          # 路由配置
│   ├── store/           # 状态管理
│   ├── types/           # TypeScript类型定义
│   ├── utils/           # 工具函数
│   ├── views/           # 页面视图组件
│   ├── App.vue          # 根组件
│   ├── main.ts          # 应用入口文件
│   └── index.css        # CSS入口文件
├── .gitignore           # Git忽略文件
├── components.json      # 组件配置
├── eslint.config.mjs    # ESLint配置
├── index.html           # HTML模板
├── package.json         # 项目依赖配置
├── tsconfig.json        # TypeScript配置
├── vite.config.ts       # Vite配置
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

### 网络请求

| 依赖包    | 版本   | 描述                    |
| --------- | ------ | ----------------------- |
| **axios** | ^1.8.4 | 基于Promise的HTTP客户端 |

### 开发工具

| 依赖包                   | 版本    | 描述                           |
| ------------------------ | ------- | ------------------------------ |
| **typescript**           | ~5.7.2  | JavaScript的超集，添加静态类型 |
| **eslint**               | ^9.24.0 | 代码质量和风格检查工具         |
| **@antfu/eslint-config** | ^4.12.0 | Anthony Fu的ESLint配置         |
| **vue-tsc**              | ^2.2.8  | Vue文件的TypeScript类型检查    |
| **sass-embedded**        | ^1.87.0 | Sass预处理器                   |

## 🛠️ 开发命令

| 命令           | 描述             |
| -------------- | ---------------- |
| `npm dev`      | 启动开发服务器   |
| `npm build`    | 构建生产版本     |
| `npm preview`  | 预览构建后的应用 |
| `npm lint`     | 代码检查         |
| `npm lint:fix` | 自动修复代码问题 |

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

- [Vue 3文档](https://vuejs.org/)
- [Vue Router文档](https://router.vuejs.org/)
- [Pinia文档](https://pinia.vuejs.org/)
- [Vite文档](https://vitejs.dev/)
- [TypeScript文档](https://www.typescriptlang.org/)
- [Tailwind CSS文档](https://tailwindcss.com/)
- [shadcn/vue文档](https://www.shadcn-vue.com/)
- [lucide-vue-next图标库](https://lucide.dev/icons/)
