<template>
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">正则表达式测试器</h1>
      <p class="text-gray-600">测试正则表达式，并高亮匹配结果</p>
    </div>

    <div class="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
      <div>
        <label class="block text-sm font-medium text-gray-700">正则表达式</label>
        <input v-model="pattern" @input="run" placeholder="如: (foo|bar)+" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">标志 (flags)</label>
        <input v-model="flags" @input="run" placeholder="如: gim" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300" />
      </div>
      <div class="text-sm text-gray-600">
        <div>有效标志: g, i, m, s, u, y</div>
        <div v-if="error" class="text-red-600">{{ error }}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">测试文本</label>
        <textarea v-model="text" @input="run" class="w-full h-64 p-4 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300" placeholder="输入测试文本"></textarea>
      </div>
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">匹配高亮</label>
        <div class="w-full h-64 p-4 border rounded-lg text-sm overflow-auto bg-white" v-html="highlighted"></div>
        <div class="text-xs text-gray-500">匹配 {{ matches.length }} 处</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const pattern = ref('')
const flags = ref('g')
const text = ref('')
const highlighted = ref('')
const matches = ref([])
const error = ref('')

function escapeHtml(s) {
  return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function run() {
  highlighted.value = escapeHtml(text.value || '')
  matches.value = []
  error.value = ''
  if (!pattern.value) return
  try {
    const re = new RegExp(pattern.value, flags.value)
    const t = text.value || ''
    if (!flags.value.includes('g')) {
      const m = t.match(re)
      matches.value = m ? [m] : []
      highlighted.value = escapeHtml(t).replace(re, (m0) => `<mark class="bg-yellow-200">${escapeHtml(m0)}</mark>`)
    } else {
      const parts = []
      let lastIndex = 0
      let m
      while ((m = re.exec(t)) !== null) {
        matches.value.push(m)
        const start = m.index
        const end = start + m[0].length
        parts.push(escapeHtml(t.slice(lastIndex, start)))
        parts.push(`<mark class="bg-yellow-200">${escapeHtml(m[0])}</mark>`)
        lastIndex = end
        if (m[0] === '') re.lastIndex++
      }
      parts.push(escapeHtml(t.slice(lastIndex)))
      highlighted.value = parts.join('')
    }
  } catch (e) {
    error.value = e && e.message ? e.message : '正则无效'
  }
}
</script>


