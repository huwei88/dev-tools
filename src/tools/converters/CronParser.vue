<template>
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Cron 解析器</h1>
      <p class="text-gray-600">解析 Cron 表达式，生成接下来 N 次的执行时间</p>
    </div>

    <div class="bg-gray-50 rounded-lg p-4 flex flex-wrap items-center gap-4">
      <div class="flex items-center space-x-2">
        <label class="text-sm font-medium text-gray-700">时区:</label>
        <label class="inline-flex items-center text-sm">
          <input type="radio" value="local" v-model="tz" class="mr-1" /> 本地时间
        </label>
        <label class="inline-flex items-center text-sm">
          <input type="radio" value="utc" v-model="tz" class="mr-1" /> UTC
        </label>
      </div>

      <div class="flex items-center space-x-2">
        <label class="text-sm font-medium text-gray-700">生成条数:</label>
        <input type="number" v-model.number="count" min="1" max="100" class="w-24 p-2 border rounded" />
      </div>

      <div class="text-sm text-gray-600">
        当前时间: <span class="font-mono">{{ nowFormatted }}</span>
      </div>
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Cron 表达式</label>
      <input
        v-model="expr"
        @input="parse"
        placeholder="如: */5 * * * * 或 0 12 * * MON-FRI"
        :class="[
          'block w-full rounded-md shadow-sm sm:text-sm p-3 font-mono',
          error ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
        ]"
      />
      <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
    </div>

    <div class="bg-white border rounded-lg">
      <div class="px-4 py-2 border-b text-sm text-gray-500">即将到来的执行时间</div>
      <ul class="divide-y">
        <li v-for="(item, idx) in results" :key="idx" class="px-4 py-3 flex items-center justify-between">
          <div class="font-mono text-gray-900">{{ item.display }}</div>
          <div class="text-xs text-gray-500">{{ item.iso }}</div>
        </li>
        <li v-if="!results.length" class="px-4 py-6 text-center text-sm text-gray-400">暂无结果</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import * as cron from 'cron-parser'

const tz = ref('local')
const count = ref(10)
const expr = ref('*/5 * * * *')
const error = ref('')
const results = ref([])
const nowTick = ref(0)

const nowFormatted = computed(() => {
  void nowTick.value
  const now = new Date()
  return tz.value === 'utc' ? now.toUTCString() : now.toLocaleString()
})

function parse() {
  error.value = ''
  results.value = []
  try {
    const Parser = (cron && cron.default) || cron
    if (!Parser || typeof Parser.parse !== 'function') {
      throw new Error('cron-parser 解析器不可用')
    }
    // 当前包版本提供 Parser.parse(expression, { currentDate })，不支持 tz 选项
    const it = Parser.parse(expr.value, { currentDate: new Date() })
    const out = []
    for (let i = 0; i < count.value; i += 1) {
      const d = it.next() // 已是 Date 对象
      out.push({
        display: tz.value === 'utc' ? d.toUTCString() : d.toLocaleString(),
        iso: d.toISOString()
      })
    }
    results.value = out
  } catch (e) {
    error.value = e.message || '解析失败，请检查表达式'
  }
}

let timer = null
onMounted(() => {
  parse()
  timer = setInterval(() => (nowTick.value += 1), 1000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

watch([tz, count], () => parse())
</script>
