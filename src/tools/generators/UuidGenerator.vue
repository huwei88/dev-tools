<template>
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">UUID 生成器</h1>
      <p class="text-gray-600">生成 UUID v1 或 v4，可指定数量</p>
    </div>

    <div class="bg-gray-50 rounded-lg p-4 flex flex-wrap items-center gap-4">
      <div class="flex items-center space-x-3 text-sm text-gray-700">
        <label class="inline-flex items-center">
          <input type="radio" value="v1" v-model="version" class="mr-1" /> v1
        </label>
        <label class="inline-flex items-center">
          <input type="radio" value="v4" v-model="version" class="mr-1" /> v4
        </label>
      </div>
      <div class="flex items-center space-x-2 text-sm text-gray-700">
        <label class="text-sm font-medium text-gray-700">数量:</label>
        <input type="number" v-model.number="count" min="1" max="1000" class="w-24 p-2 border rounded" />
        <button @click="generate" class="inline-flex items-center px-3 py-2 text-sm rounded border bg-white hover:bg-gray-50">生成</button>
        <button @click="copyAll" class="inline-flex items-center px-3 py-2 text-sm rounded border bg-white hover:bg-gray-50">复制全部</button>
        <button @click="clearAll" class="inline-flex items-center px-3 py-2 text-sm rounded border bg-white hover:bg-gray-50">清空</button>
      </div>
    </div>

    <div class="bg-white border rounded-lg">
      <div class="px-4 py-2 border-b text-sm text-gray-500">结果</div>
      <ul class="divide-y">
        <li v-for="(u, idx) in uuids" :key="idx" class="px-4 py-3 flex items-center justify-between">
          <code class="font-mono text-gray-900">{{ u }}</code>
          <button @click="copy(u)" class="text-xs text-gray-600 hover:text-gray-900">复制</button>
        </li>
        <li v-if="!uuids.length" class="px-4 py-6 text-center text-sm text-gray-400">暂无结果</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { v1 as uuidv1, v4 as uuidv4 } from 'uuid'

const version = ref('v4')
const count = ref(10)
const uuids = ref([])

function generate() {
  const n = Math.min(Math.max(count.value || 1, 1), 1000)
  const arr = []
  for (let i = 0; i < n; i++) {
    arr.push(version.value === 'v1' ? uuidv1() : uuidv4())
  }
  uuids.value = arr
}

function copy(text) {
  if (!text) return
  navigator.clipboard.writeText(String(text)).catch(() => {})
}

function copyAll() {
  if (!uuids.value.length) return
  copy(uuids.value.join('\n'))
}

function clearAll() { uuids.value = [] }
</script>


