<template>
  <aside 
    :class="[
      'bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ease-in-out',
      collapsed ? 'w-16' : 'w-64'
    ]"
  >
    <div class="flex flex-col h-full">
      <!-- Logo 区域 -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span v-if="!collapsed" class="ml-3 text-lg font-semibold text-gray-900">DevToys</span>
        </div>
      </div>
      
      <!-- 搜索框 -->
      <div v-if="!collapsed" class="p-4 border-b border-gray-200">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索工具..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      
      <!-- 分类列表 -->
      <nav class="flex-1 overflow-y-auto">
        <div class="px-4 py-2">
          <div v-for="category in visibleCategories" :key="category.id" class="mb-2">
            <button
              @click="toggleCategory(category.id)"
              class="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            >
              <div class="flex items-center">
                <component :is="category.icon" class="w-5 h-5 mr-3" />
                <span v-if="!collapsed">{{ category.name }}</span>
              </div>
              <svg
                v-if="!collapsed && (searchQuery ? true : category.expanded)"
                class="w-4 h-4 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- 子工具列表 -->
            <div
              v-if="!collapsed && (searchQuery ? true : category.expanded)"
              class="ml-8 mt-1 space-y-1"
            >
              <router-link
                v-for="tool in category.tools"
                :key="tool.id"
                :to="tool.path"
                class="block px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
              >
                {{ tool.name }}
              </router-link>
              <div v-if="!category.tools || category.tools.length === 0" class="px-3 py-2 text-xs text-gray-400">
                无匹配的工具
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle'])

const searchQuery = ref('')

// 分类数据
const categories = ref([
  {
    id: 'converters',
    name: '转换器',
    icon: 'svg',
    expanded: false,
    tools: [
      {
        id: 'json-yaml',
        name: 'JSON <> YAML',
        path: '/converters/json-yaml'
      },
      {
        id: 'number-base',
        name: 'Number Base',
        path: '/converters/number-base'
      },
      {
        id: 'timestamp',
        name: 'Timestamp',
        path: '/converters/timestamp'
      },
      {
        id: 'cron',
        name: 'Cron Parser',
        path: '/converters/cron'
      }
    ]
  },
  {
    id: 'encoders',
    name: '编码器',
    icon: 'svg',
    expanded: false,
    tools: [
      {
        id: 'html-encoder',
        name: 'HTML Encoder',
        path: '/encoders/html'
      },
      {
        id: 'url-encoder',
        name: 'URL Encoder',
        path: '/encoders/url'
      },
      {
        id: 'base64-coder',
        name: 'Base64 Coder',
        path: '/encoders/base64'
      },
      {
        id: 'gzip-compressor',
        name: 'GZip Compressor',
        path: '/encoders/gzip'
      },
      {
        id: 'jwt-decoder',
        name: 'JWT Decoder',
        path: '/encoders/jwt'
      }
    ]
  },
  {
    id: 'formatters',
    name: '格式化',
    icon: 'svg',
    expanded: false,
    tools: [
      {
        id: 'json-formatter',
        name: 'JSON Formatter',
        path: '/formatters/json'
      },
      {
        id: 'sql-formatter',
        name: 'SQL Formatter',
        path: '/formatters/sql'
      }
    ]
  },
  {
    id: 'generators',
    name: '生成器',
    icon: 'svg',
    expanded: false,
    tools: []
  },
  {
    id: 'text',
    name: '文本工具',
    icon: 'svg',
    expanded: false,
    tools: []
  },
  {
    id: 'graphic',
    name: '图形工具',
    icon: 'svg',
    expanded: false,
    tools: []
  }
])

// 计算后的可见分类及工具（基于搜索关键字过滤）
const visibleCategories = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return categories.value
  return categories.value
    .map((c) => {
      const matchCategory = c.name.toLowerCase().includes(q)
      const filteredTools = (c.tools || []).filter((t) => t.name.toLowerCase().includes(q))
      return {
        ...c,
        // 搜索时强制展开
        expanded: true,
        // 匹配到分类名则保留全部工具，否则仅保留匹配的工具
        tools: matchCategory ? c.tools : filteredTools,
      }
    })
    .filter((c) => (c.tools && c.tools.length) || c.name.toLowerCase().includes(q))
})

const toggleCategory = (categoryId) => {
  // 搜索中不允许手动折叠，保持展开以展示匹配结果
  if (searchQuery.value.trim()) return
  const category = categories.value.find(c => c.id === categoryId)
  if (category) {
    category.expanded = !category.expanded
  }
}
</script>
