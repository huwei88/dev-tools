<template>
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Lorem Ipsum 生成器</h1>
      <p class="text-gray-600">按段落、句子或单词生成占位文本</p>
    </div>

    <div class="bg-gray-50 rounded-lg p-4 flex flex-wrap items-center gap-4">
      <div class="flex items-center space-x-3 text-sm text-gray-700">
        <label class="inline-flex items-center">
          <input type="radio" value="paragraphs" v-model="mode" class="mr-1" /> 段落
        </label>
        <label class="inline-flex items-center">
          <input type="radio" value="sentences" v-model="mode" class="mr-1" /> 句子
        </label>
        <label class="inline-flex items-center">
          <input type="radio" value="words" v-model="mode" class="mr-1" /> 单词
        </label>
      </div>
      <div class="flex items-center space-x-2 text-sm text-gray-700">
        <label class="text-sm font-medium text-gray-700">数量:</label>
        <input type="number" v-model.number="count" min="1" max="1000" class="w-24 p-2 border rounded" />
        <button @click="generate" class="inline-flex items-center px-3 py-2 text-sm rounded border bg-white hover:bg-gray-50">生成</button>
        <button @click="copyAll" class="inline-flex items-center px-3 py-2 text-sm rounded border bg-white hover:bg-gray-50">复制</button>
        <button @click="clearAll" class="inline-flex items-center px-3 py-2 text-sm rounded border bg-white hover:bg-gray-50">清空</button>
      </div>
    </div>

    <div class="bg-white border rounded-lg">
      <div class="px-4 py-2 border-b text-sm text-gray-500">结果</div>
      <div class="p-4 space-y-4">
        <template v-if="mode === 'paragraphs'">
          <p v-for="(p, idx) in paragraphs" :key="idx" class="text-gray-900">{{ p }}</p>
        </template>
        <template v-else>
          <pre class="whitespace-pre-wrap text-sm text-gray-900">{{ output }}</pre>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const LOREM_WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'.split(' ')

const mode = ref('paragraphs')
const count = ref(5)
const output = ref('')
const paragraphs = ref([])

function randomWord() {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function makeSentence(min = 6, max = 16) {
  const len = Math.floor(Math.random() * (max - min + 1)) + min
  const words = Array.from({ length: len }, () => randomWord())
  return capitalize(words.join(' ')) + '.'
}

function makeParagraph() {
  const sentenceCount = Math.floor(Math.random() * 3) + 3
  return Array.from({ length: sentenceCount }, () => makeSentence()).join(' ')
}

function generate() {
  const n = Math.min(Math.max(count.value || 1, 1), 1000)
  if (mode.value === 'paragraphs') {
    paragraphs.value = Array.from({ length: n }, () => makeParagraph())
    output.value = ''
  } else if (mode.value === 'sentences') {
    paragraphs.value = []
    output.value = Array.from({ length: n }, () => makeSentence()).join('\n')
  } else {
    paragraphs.value = []
    output.value = Array.from({ length: n }, () => randomWord()).join(' ')
  }
}

function copy(text) {
  if (!text) return
  navigator.clipboard.writeText(String(text)).catch(() => {})
}

function copyAll() {
  if (mode.value === 'paragraphs') copy(paragraphs.value.join('\n\n'))
  else copy(output.value)
}

function clearAll() { paragraphs.value = []; output.value = '' }
</script>


