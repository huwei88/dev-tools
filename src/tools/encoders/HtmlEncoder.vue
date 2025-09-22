<template>
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">HTML 编码 / 解码</h1>
      <p class="text-gray-600">将文本在 HTML 实体编码 与 原文 之间转换</p>
    </div>

    <div class="bg-gray-50 rounded-lg p-4 flex flex-wrap items-center gap-4">
      <div class="flex items-center space-x-3 text-sm text-gray-700">
        <label class="inline-flex items-center">
          <input type="radio" value="encode" v-model="mode" class="mr-1" /> 编码
        </label>
        <label class="inline-flex items-center">
          <input type="radio" value="decode" v-model="mode" class="mr-1" /> 解码
        </label>
      </div>

      <div class="flex items-center space-x-2 text-sm text-gray-700">
        <label class="inline-flex items-center">
          <input type="checkbox" v-model="useNamedEntities" class="mr-1" /> 使用命名实体（尽可能）
        </label>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">输入</label>
        <div class="relative">
          <textarea
            v-model="input"
            @input="transform"
            placeholder="在此输入待转换文本"
            class="w-full h-64 p-4 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          ></textarea>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
            <button @click="copy(input)" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">复制</button>
            <button @click="clear('input')" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">清空</button>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">输出</label>
        <div class="relative">
          <textarea
            :value="output"
            readonly
            placeholder="转换结果将显示在此"
            class="w-full h-64 p-4 border rounded-lg font-mono text-sm resize-none bg-gray-50 focus:outline-none border-gray-200"
          ></textarea>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
            <button @click="copy(output)" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">复制</button>
            <button @click="clear('output')" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">清空</button>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-gray-50 rounded-lg p-4">
      <h4 class="text-sm font-medium text-gray-900 mb-3">常用示例</h4>
      <div class="flex flex-wrap gap-2">
        <button @click="setExample(exampleHtml)" class="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50">HTML 标签与引号</button>
        <button @click="setExample(exampleCompare)" class="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50">比较符</button>
        <button @click="setExample(exampleWhitespace)" class="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50">空白与转义</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const mode = ref('encode') // 'encode' | 'decode'
const useNamedEntities = ref(true)
const input = ref('')
const output = ref('')
const exampleHtml = `<div class='box'>& " ' </div>`
const exampleCompare = `1 < 2 && 3 > 2`
const exampleWhitespace = `使用空格\t与换行\n测试`

const namedMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}

function encodeHtml(text) {
  if (!text) return ''
  // 先替换 & 再替换其他，避免双重编码
  let res = text.replace(/&/g, '&amp;')
  res = res.replace(/</g, useNamedEntities.value ? '&lt;' : '&#60;')
  res = res.replace(/>/g, useNamedEntities.value ? '&gt;' : '&#62;')
  res = res.replace(/\"/g, useNamedEntities.value ? '&quot;' : '&#34;')
  res = res.replace(/'/g, useNamedEntities.value ? '&#39;' : '&#39;')
  return res
}

function decodeHtml(text) {
  if (!text) return ''
  // 使用浏览器能力更稳妥
  const div = document.createElement('div')
  div.innerHTML = text
  return div.textContent || div.innerText || ''
}

function transform() {
  output.value = mode.value === 'encode' ? encodeHtml(input.value) : decodeHtml(input.value)
}

function copy(text) {
  if (!text) return
  navigator.clipboard.writeText(String(text)).catch(() => {})
}

function clear(which) {
  if (which === 'input') {
    input.value = ''
  } else if (which === 'output') {
    output.value = ''
  }
}

function setExample(example) {
  input.value = example
  transform()
}

watch([mode, useNamedEntities], () => transform())
</script>


