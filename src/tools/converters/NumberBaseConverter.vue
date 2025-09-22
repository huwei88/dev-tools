<template>
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">数字进制转换器</h1>
      <p class="text-gray-600">二进制、八进制、十进制、十六进制之间实时联动转换</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="field in fields" :key="field.key" class="space-y-2">
        <label :for="field.key" class="block text-sm font-medium text-gray-700">{{ field.label }}</label>
        <div class="relative">
          <input
            :id="field.key"
            v-model="state[field.key]"
            @input="onInput(field.key)"
            :placeholder="field.placeholder"
            :class="[
              'block w-full pr-28 rounded-md shadow-sm sm:text-sm p-3 font-mono tracking-wide',
              errors[field.key] ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            ]"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
            <button @click="copy(field.key)" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">复制</button>
            <button @click="clear(field.key)" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">清空</button>
          </div>
        </div>
        <p v-if="errors[field.key]" class="text-xs text-red-600">{{ errors[field.key] }}</p>
      </div>
    </div>

    <div class="bg-gray-50 p-4 rounded-md flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <label class="text-sm text-gray-700">大小写:</label>
        <label class="inline-flex items-center text-sm text-gray-700">
          <input type="radio" value="upper" v-model="hexCase" class="mr-1" /> 大写
        </label>
        <label class="inline-flex items-center text-sm text-gray-700">
          <input type="radio" value="lower" v-model="hexCase" class="mr-1" /> 小写
        </label>
      </div>
      <div class="text-sm text-gray-500">支持负号与小数点（会转换为整数部分）</div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'

const hexCase = ref('upper')

const state = reactive({
  binary: '',
  octal: '',
  decimal: '',
  hexadecimal: ''
})

const errors = reactive({
  binary: '',
  octal: '',
  decimal: '',
  hexadecimal: ''
})

const fields = [
  { key: 'binary', label: '二进制 (base 2)', placeholder: '如: 101101' },
  { key: 'octal', label: '八进制 (base 8)', placeholder: '如: 755' },
  { key: 'decimal', label: '十进制 (base 10)', placeholder: '如: 493' },
  { key: 'hexadecimal', label: '十六进制 (base 16)', placeholder: '如: 1ED 或 1ed' }
]

const validators = {
  binary: (v) => /^-?[01]+$/.test(v),
  octal: (v) => /^-?[0-7]+$/.test(v),
  decimal: (v) => /^-?\d+$/.test(v),
  hexadecimal: (v) => /^-?[0-9a-fA-F]+$/.test(v)
}

const parseMap = {
  binary: 2,
  octal: 8,
  decimal: 10,
  hexadecimal: 16
}

function normalizeInput(raw) {
  if (!raw) return ''
  const trimmed = String(raw).trim()
  // 仅保留整数部分，去除小数点后的内容
  const negative = trimmed.startsWith('-')
  let body = negative ? trimmed.slice(1) : trimmed
  body = body.replace(/\s+/g, '')
  return (negative ? '-' : '') + body
}

function toAllBases(fromKey, value) {
  const v = normalizeInput(value)
  if (v === '' || v === '-') {
    state.binary = ''
    state.octal = ''
    state.decimal = ''
    state.hexadecimal = ''
    clearErrors()
    return
  }

  if (!validators[fromKey](v)) {
    setError(fromKey, '输入格式不合法')
    return
  }

  clearErrors()
  const sign = v.startsWith('-') ? -1 : 1
  const abs = sign === -1 ? v.slice(1) : v
  const base = parseMap[fromKey]
  const parsed = parseInt(abs, base)
  const num = isNaN(parsed) ? null : sign * parsed

  if (num === null) {
    setError(fromKey, '无法解析该值')
    return
  }

  state.decimal = String(num)
  state.binary = (sign === -1 ? '-' : '') + Math.abs(num).toString(2)
  state.octal = (sign === -1 ? '-' : '') + Math.abs(num).toString(8)
  const hex = Math.abs(num).toString(16)
  state.hexadecimal = (sign === -1 ? '-' : '') + (hexCase.value === 'upper' ? hex.toUpperCase() : hex.toLowerCase())
}

function setError(key, message) {
  errors[key] = message
}

function clearErrors() {
  errors.binary = ''
  errors.octal = ''
  errors.decimal = ''
  errors.hexadecimal = ''
}

function onInput(key) {
  const value = state[key]
  toAllBases(key, value)
}

async function copy(key) {
  const text = state[key]
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
  } catch (e) {}
}

function clear(key) {
  state[key] = ''
  clearErrors()
  // 同步清空其他框
  toAllBases(key, '')
}

function reapplyFromExisting() {
  if (state.decimal) return toAllBases('decimal', state.decimal)
  if (state.hexadecimal) return toAllBases('hexadecimal', state.hexadecimal)
  if (state.binary) return toAllBases('binary', state.binary)
  if (state.octal) return toAllBases('octal', state.octal)
}

watch(hexCase, () => {
  reapplyFromExisting()
})
</script>
