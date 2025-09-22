<template>
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">文本统计与大小写转换</h1>
      <p class="text-gray-600">统计字符数、词数、行数等，并提供常用大小写转换</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-2 space-y-2">
        <label class="block text-sm font-medium text-gray-700">文本</label>
        <textarea v-model="text" @input="updateStats" class="w-full h-80 p-4 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300" placeholder="输入文本"></textarea>
      </div>
      <div class="space-y-4">
        <div class="bg-white border rounded p-3 text-sm">
          <div class="flex justify-between"><span>字符数</span><span class="font-mono">{{ stats.chars }}</span></div>
          <div class="flex justify-between"><span>不含空白字符数</span><span class="font-mono">{{ stats.charsNoSpace }}</span></div>
          <div class="flex justify-between"><span>词数</span><span class="font-mono">{{ stats.words }}</span></div>
          <div class="flex justify-between"><span>行数</span><span class="font-mono">{{ stats.lines }}</span></div>
        </div>
        <div class="bg-white border rounded p-3 text-sm space-y-2">
          <div class="font-medium text-gray-700 mb-1">大小写转换</div>
          <div class="grid grid-cols-2 gap-2">
            <button @click="toUpper" class="px-2 py-1 border rounded bg-white hover:bg-gray-50">UPPER</button>
            <button @click="toLower" class="px-2 py-1 border rounded bg-white hover:bg-gray-50">lower</button>
            <button @click="toCamel" class="px-2 py-1 border rounded bg-white hover:bg-gray-50">camelCase</button>
            <button @click="toSnake" class="px-2 py-1 border rounded bg-white hover:bg-gray-50">snake_case</button>
            <button @click="toKebab" class="px-2 py-1 border rounded bg-white hover:bg-gray-50">kebab-case</button>
            <button @click="toTitle" class="px-2 py-1 border rounded bg-white hover:bg-gray-50">Title Case</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const text = ref('')
const stats = reactive({ chars: 0, charsNoSpace: 0, words: 0, lines: 0 })

function updateStats() {
  const t = text.value || ''
  stats.chars = t.length
  stats.charsNoSpace = t.replace(/\s/g, '').length
  stats.words = (t.trim().match(/[^\s]+/g) || []).length
  stats.lines = t.split(/\n/).length
}

function toUpper() { text.value = (text.value || '').toUpperCase(); updateStats() }
function toLower() { text.value = (text.value || '').toLowerCase(); updateStats() }

function wordsFromText() { return (text.value || '').split(/[^A-Za-z0-9]+/).filter(Boolean) }
function toCamel() {
  const ws = wordsFromText().map(w => w.toLowerCase())
  if (!ws.length) return
  text.value = ws[0] + ws.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
  updateStats()
}
function toSnake() { text.value = wordsFromText().map(w => w.toLowerCase()).join('_'); updateStats() }
function toKebab() { text.value = wordsFromText().map(w => w.toLowerCase()).join('-'); updateStats() }
function toTitle() { text.value = wordsFromText().map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '); updateStats() }
</script>


