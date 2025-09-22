<template>
  <div class="flex h-screen bg-gray-100">
    <!-- 左侧边栏 -->
    <Sidebar 
      :collapsed="sidebarCollapsed"
      @toggle="sidebarCollapsed = !sidebarCollapsed"
    />
    
    <!-- 主内容区域 -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- 顶部导航栏 -->
      <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <button
            @click="sidebarCollapsed = !sidebarCollapsed"
            class="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <h1 class="text-xl font-semibold text-gray-900">Web DevToys</h1>
          
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">开发者工具箱</span>
          </div>
        </div>
      </header>
      
      <!-- 主内容区域 -->
      <main class="flex-1 overflow-auto p-6">
        <ToolWrapper>
          <router-view />
        </ToolWrapper>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from './Sidebar.vue'
import ToolWrapper from './ToolWrapper.vue'

const sidebarCollapsed = ref(false)
</script>
