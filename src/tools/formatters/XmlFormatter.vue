<template>
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">XML 格式化器</h1>
      <p class="text-gray-600">格式化或压缩 XML 数据</p>
    </div>

    <div class="bg-gray-50 rounded-lg p-4 flex flex-wrap items-center gap-4">
      <div class="flex items-center space-x-3 text-sm text-gray-700">
        <label class="inline-flex items-center">
          <input type="radio" value="pretty" v-model="mode" class="mr-1" /> 格式化
        </label>
        <label class="inline-flex items-center">
          <input type="radio" value="minify" v-model="mode" class="mr-1" /> 压缩
        </label>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">输入 XML</label>
        <div class="relative">
          <textarea
            v-model="input"
            @input="formatXml"
            placeholder="粘贴 XML 文本"
            class="w-full h-96 p-4 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          ></textarea>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
            <button @click="copy(input)" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">复制</button>
            <button @click="clear('input')" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">清空</button>
          </div>
        </div>
        <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">输出</label>
        <div class="relative">
          <textarea
            :value="output"
            readonly
            placeholder="结果"
            class="w-full h-96 p-4 border rounded-lg font-mono text-sm resize-none bg-gray-50 focus:outline-none border-gray-200"
          ></textarea>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
            <button @click="copy(output)" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">复制</button>
            <button @click="clear('output')" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">清空</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import xmlFormatter from 'xml-formatter'

const mode = ref('pretty')
const input = ref('')
const output = ref('')
const error = ref('')

function formatXml() {
  error.value = ''
  if (!input.value.trim()) { output.value = ''; return }
  try {
    if (mode.value === 'pretty') {
      output.value = xmlFormatter(input.value, { collapseContent: false, lineSeparator: '\n' })
    } else {
      // 压缩：移除空白与换行
      const pretty = xmlFormatter(input.value, { collapseContent: true, lineSeparator: '' })
      output.value = pretty.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim()
    }
  } catch (e) {
    error.value = e && e.message ? e.message : '格式化失败'
    output.value = ''
  }
}

function copy(text) {
  if (!text) return
  navigator.clipboard.writeText(String(text)).catch(() => {})
}

function clear(which) {
  if (which === 'input') { input.value = ''; output.value = ''; error.value = '' }
  else if (which === 'output') { output.value = '' }
}

watch(mode, () => formatXml())
</script>


