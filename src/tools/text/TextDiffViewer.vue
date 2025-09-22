<template>
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">文本对比 (Diff)</h1>
      <p class="text-gray-600">对比两段文本差异</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">文本 A</label>
        <textarea v-model="left" @input="computeDiff" class="w-full h-64 p-4 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300" placeholder="输入左侧文本"></textarea>
      </div>
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">文本 B</label>
        <textarea v-model="right" @input="computeDiff" class="w-full h-64 p-4 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300" placeholder="输入右侧文本"></textarea>
      </div>
    </div>

    <div class="bg-white border rounded-lg">
      <div class="px-4 py-2 border-b text-sm text-gray-500 flex items-center justify-between">
        <span>差异预览</span>
        <div class="space-x-2 text-xs">
          <button @click="copyHtml" class="px-2 py-1 border rounded bg-white hover:bg-gray-50">复制结果 (HTML)</button>
        </div>
      </div>
      <div class="p-4 overflow-auto text-sm">
        <div v-html="rendered"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { diffWords } from 'diff'

const left = ref('')
const right = ref('')
const rendered = ref('')

function escapeHtml(s) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function computeDiff() {
  const parts = diffWords(left.value || '', right.value || '')
  const html = parts.map(p => {
    const text = escapeHtml(p.value)
    if (p.added) return `<span style="background:#e6ffed;color:#0a4;">${text}</span>`
    if (p.removed) return `<span style="background:#ffeef0;color:#b00;text-decoration:line-through;">${text}</span>`
    return `<span>${text}</span>`
  }).join('')
  rendered.value = html
}

function copyHtml() {
  if (!rendered.value) return
  navigator.clipboard.writeText(rendered.value).catch(() => {})
}
</script>


