<template>
  <div>
    <!-- 欢迎区域 -->
    <div class="text-center mb-8">
      <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Web DevToys</h1>
      <p class="text-lg text-gray-600">开发者必备的在线工具集合</p>
    </div>

    <!-- 工具分类网格 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="category in categories"
        :key="category.id"
        class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
        @click="selectCategory(category.id)"
      >
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <component :is="category.icon" class="w-6 h-6 text-blue-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900">{{ category.name }}</h3>
        </div>
        <p class="text-gray-600 text-sm mb-4">{{ category.description }}</p>
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-500">{{ category.toolCount }} 个工具</span>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- 最近使用的工具 -->
    <div class="mt-12">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">最近使用的工具</h2>
      <div class="bg-gray-50 rounded-lg p-8 text-center">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-gray-500">还没有使用过任何工具</p>
        <p class="text-sm text-gray-400 mt-1">开始使用左侧分类中的工具吧</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const categories = ref([
  {
    id: 'converters',
    name: '转换器',
    description: '各种格式转换工具',
    toolCount: 0,
    icon: 'svg'
  },
  {
    id: 'encoders',
    name: '编码器',
    description: '文本编码解码工具',
    toolCount: 0,
    icon: 'svg'
  },
  {
    id: 'formatters',
    name: '格式化',
    description: '代码格式化工具',
    toolCount: 0,
    icon: 'svg'
  },
  {
    id: 'generators',
    name: '生成器',
    description: '各种数据生成工具',
    toolCount: 0,
    icon: 'svg'
  },
  {
    id: 'text',
    name: '文本工具',
    description: '文本处理工具',
    toolCount: 0,
    icon: 'svg'
  },
  {
    id: 'graphic',
    name: '图形工具',
    description: '图像处理工具',
    toolCount: 0,
    icon: 'svg'
  }
])

const selectCategory = (categoryId) => {
  console.log('选择分类:', categoryId)
  // TODO: 实现分类选择逻辑
}
</script>
