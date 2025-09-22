<template>
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">URL 编码 / 解码</h1>
      <p class="text-gray-600">支持 encodeURI / encodeURIComponent 及对应解码</p>
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
        <label class="text-sm font-medium text-gray-700">作用范围:</label>
        <label class="inline-flex items-center">
          <input type="radio" value="uri" v-model="scope" class="mr-1" /> 整体 URL (encodeURI / decodeURI)
        </label>
        <label class="inline-flex items-center">
          <input type="radio" value="component" v-model="scope" class="mr-1" /> URL 片段 (encodeURIComponent / decodeURIComponent)
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
            placeholder="在此输入待转换文本，如: https://example.com/search?q=hello world&lang=zh-CN"
            class="w-full h-64 p-4 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
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
        <button @click="setExample(exampleUrl)" class="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50">完整 URL</button>
        <button @click="setExample(exampleQuery)" class="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50">查询串</button>
        <button @click="setExample(exampleChinese)" class="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50">中文与空格</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const mode = ref('encode') // 'encode' | 'decode'
const scope = ref('component') // 'uri' | 'component'
const input = ref('')
const output = ref('')
const error = ref('')

const exampleUrl = `https://example.com/search?q=你好 世界&lang=zh-CN#部分`
const exampleQuery = `q=hello world&redirect=/a/b?x=1&y=2`
const exampleChinese = `中文 空格 symbols !@#$%^&*()`

function doEncode(text) {
  try {
    return scope.value === 'uri' ? encodeURI(text) : encodeURIComponent(text)
  } catch (e) {
    throw e
  }
}

function doDecode(text) {
  try {
    return scope.value === 'uri' ? decodeURI(text) : decodeURIComponent(text)
  } catch (e) {
    throw e
  }
}

function transform() {
  error.value = ''
  try {
    output.value = mode.value === 'encode' ? doEncode(input.value) : doDecode(input.value)
  } catch (e) {
    error.value = e && e.message ? e.message : '解析失败，请检查输入'
    output.value = ''
  }
}

function copy(text) {
  if (!text) return
  navigator.clipboard.writeText(String(text)).catch(() => {})
}

function clear(which) {
  if (which === 'input') {
    input.value = ''
    error.value = ''
    output.value = ''
  } else if (which === 'output') {
    output.value = ''
  }
}

function setExample(example) {
  input.value = example
  transform()
}

watch([mode, scope], () => transform())
</script>


