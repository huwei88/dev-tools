<template>
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">时间戳转换器</h1>
      <p class="text-gray-600">在 Unix 时间戳 与 日期时间（本地/UTC）之间双向转换</p>
    </div>

    <div class="bg-gray-50 rounded-lg p-4 flex flex-wrap items-center gap-4">
      <div class="flex items-center space-x-2">
        <label class="text-sm font-medium text-gray-700">单位:</label>
        <label class="inline-flex items-center text-sm">
          <input type="radio" value="seconds" v-model="unit" class="mr-1" /> 秒
        </label>
        <label class="inline-flex items-center text-sm">
          <input type="radio" value="milliseconds" v-model="unit" class="mr-1" /> 毫秒
        </label>
      </div>

      <div class="flex items-center space-x-2">
        <label class="text-sm font-medium text-gray-700">时区:</label>
        <label class="inline-flex items-center text-sm">
          <input type="radio" value="local" v-model="tz" class="mr-1" /> 本地时间
        </label>
        <label class="inline-flex items-center text-sm">
          <input type="radio" value="utc" v-model="tz" class="mr-1" /> UTC
        </label>
      </div>

      <div class="text-sm text-gray-600">
        当前时间戳: <span class="font-mono">{{ nowTimestamp }}</span>
      </div>
      <div class="text-sm text-gray-600">
        当前时间: <span class="font-mono">{{ nowFormatted }}</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">Unix 时间戳</label>
        <div class="relative">
          <input
            v-model="timestampInput"
            @input="onTimestampInput"
            placeholder="如: 1716796800 (秒) 或 1716796800000 (毫秒)"
            :class="[
              'block w-full rounded-md shadow-sm sm:text-sm p-3 font-mono',
              timestampError ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            ]"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
            <button @click="copy(timestampInput)" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">复制</button>
            <button @click="clear('timestamp')" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">清空</button>
          </div>
        </div>
        <p v-if="timestampError" class="text-xs text-red-600">{{ timestampError }}</p>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">日期时间</label>
        <div class="relative">
          <input
            type="datetime-local"
            v-model="dateInput"
            @input="onDateInput"
            :class="[
              'block w-full rounded-md shadow-sm sm:text-sm p-3',
              dateError ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            ]"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
            <button @click="setNow()" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">现在</button>
            <button @click="clear('date')" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">清空</button>
          </div>
        </div>
        <p v-if="dateError" class="text-xs text-red-600">{{ dateError }}</p>
        <p class="text-xs text-gray-500 font-mono">{{ prettyDate }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const unit = ref('seconds') // 'seconds' | 'milliseconds'
const tz = ref('local') // 'local' | 'utc'
const nowTick = ref(0)
let timer = null

const timestampInput = ref('')
const dateInput = ref('') // YYYY-MM-DDTHH:mm

const timestampError = ref('')
const dateError = ref('')

const nowTimestamp = computed(() => {
  // 依赖 nowTick 以每秒更新
  void nowTick.value
  const now = Date.now()
  return unit.value === 'seconds' ? Math.floor(now / 1000) : now
})

const nowFormatted = computed(() => {
  // 依赖 nowTick 以每秒更新
  void nowTick.value
  const now = new Date()
  return tz.value === 'utc' ? now.toUTCString() : now.toLocaleString()
})

const prettyDate = computed(() => {
  if (!dateInput.value) return ''
  const d = new Date(dateInput.value)
  if (isNaN(d.getTime())) return ''
  return `${d.toLocaleString()} | UTC: ${d.toUTCString()}`
})

function clampToUnit(ms) {
  return unit.value === 'seconds' ? Math.floor(ms / 1000) : ms
}

function parseTimestamp(raw) {
  const s = String(raw).trim()
  if (!/^[-]?\d+$/.test(s)) return { ok: false, error: '时间戳应为整数' }
  const num = Number(s)
  if (!Number.isFinite(num)) return { ok: false, error: '时间戳超出安全范围' }
  const ms = unit.value === 'seconds' ? num * 1000 : num
  const d = new Date(ms)
  if (isNaN(d.getTime())) return { ok: false, error: '无效的时间戳' }
  return { ok: true, ms }
}

function formatDateForInput(d) {
  // 生成本地 datetime-local 需要的字符串
  const pad = (n) => String(n).padStart(2, '0')
  const year = tz.value === 'utc' ? d.getUTCFullYear() : d.getFullYear()
  const month = (tz.value === 'utc' ? d.getUTCMonth() : d.getMonth()) + 1
  const day = tz.value === 'utc' ? d.getUTCDate() : d.getDate()
  const hour = tz.value === 'utc' ? d.getUTCHours() : d.getHours()
  const minute = tz.value === 'utc' ? d.getUTCMinutes() : d.getMinutes()
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}`
}

function onTimestampInput() {
  timestampError.value = ''
  const parsed = parseTimestamp(timestampInput.value)
  if (!parsed.ok) {
    timestampError.value = parsed.error
    return
  }
  const d = new Date(parsed.ms)
  dateInput.value = formatDateForInput(d)
}

function onDateInput() {
  dateError.value = ''
  if (!dateInput.value) {
    timestampInput.value = ''
    return
  }
  const d = new Date(dateInput.value)
  if (isNaN(d.getTime())) {
    dateError.value = '无效的日期时间'
    return
  }
  const ms = d.getTime()
  timestampInput.value = String(clampToUnit(ms))
}

function setNow() {
  const d = new Date()
  dateInput.value = formatDateForInput(d)
  onDateInput()
}

function copy(text) {
  if (!text) return
  navigator.clipboard.writeText(String(text)).catch(() => {})
}

function clear(which) {
  if (which === 'timestamp') {
    timestampInput.value = ''
    timestampError.value = ''
  } else {
    dateInput.value = ''
    dateError.value = ''
  }
}

onMounted(() => {
  setNow()
  timer = setInterval(() => {
    // 触发依赖 nowTimestamp/nowFormatted 的计算刷新
    nowTick.value = nowTick.value + 1
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

watch([unit, tz], () => {
  // 变更单位或时区时，基于当前输入重新计算
  if (timestampInput.value) onTimestampInput()
  else if (dateInput.value) onDateInput()
})
</script>
