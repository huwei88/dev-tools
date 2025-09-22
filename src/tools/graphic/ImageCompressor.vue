<template>
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">图像压缩</h1>
      <p class="text-gray-600">压缩 PNG / JPEG 图像，调整质量并下载</p>
    </div>

    <div class="space-y-4">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">选择图片</label>
        <input type="file" accept="image/png,image/jpeg" @change="onFile" />
        <div v-if="fileName" class="text-sm text-gray-600">{{ fileName }} · {{ humanSize(originalSize) }}</div>
      </div>

      <div class="bg-gray-50 rounded-lg p-4 flex flex-wrap items-center gap-4" v-if="imageUrl">
        <div class="flex items-center space-x-2 text-sm text-gray-700">
          <label class="text-sm font-medium text-gray-700">质量:</label>
          <input type="range" min="10" max="100" v-model.number="quality" @input="recompress" />
          <span class="font-mono">{{ quality }}%</span>
        </div>
        <div class="text-sm text-gray-600">压缩后大小: <span class="font-mono">{{ humanSize(compressedSize) }}</span>，压缩率: <span class="font-mono">{{ ratioText }}</span></div>
        <div>
          <a :href="compressedUrl" :download="downloadName" class="inline-flex items-center px-3 py-2 text-sm rounded border bg-white hover:bg-gray-50" v-if="compressedUrl">下载</a>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6" v-if="imageUrl">
        <div class="space-y-2">
          <div class="text-sm text-gray-700">原图</div>
          <img :src="imageUrl" class="max-w-full rounded border" />
        </div>
        <div class="space-y-2">
          <div class="text-sm text-gray-700">压缩后</div>
          <img :src="compressedUrl" v-if="compressedUrl" class="max-w-full rounded border" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const fileName = ref('')
const imageUrl = ref('')
const originalSize = ref(0)
const compressedUrl = ref('')
const compressedSize = ref(0)
const quality = ref(80)

const ratioText = computed(() => {
  if (!originalSize.value || !compressedSize.value) return '—'
  const r = compressedSize.value / originalSize.value
  return `${(r * 100).toFixed(1)}%`
})

const downloadName = computed(() => fileName.value ? fileName.value.replace(/\.(png|jpg|jpeg)$/i, '_compressed.$1') : 'image_compressed.jpg')

function humanSize(bytes) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB']
  let n = bytes, u = 0
  while (n >= 1024 && u < units.length - 1) { n /= 1024; u++ }
  return `${n.toFixed(2)} ${units[u]}`
}

function onFile(e) {
  const f = e.target.files && e.target.files[0]
  if (!f) return
  if (imageUrl.value) URL.revokeObjectURL(imageUrl.value)
  if (compressedUrl.value) URL.revokeObjectURL(compressedUrl.value)
  imageUrl.value = URL.createObjectURL(f)
  fileName.value = f.name
  originalSize.value = f.size
  recompress()
}

function recompress() {
  if (!imageUrl.value) return
  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    const q = Math.min(Math.max(quality.value / 100, 0.1), 1)
    const mime = fileName.value.match(/\.png$/i) ? 'image/png' : 'image/jpeg'
    canvas.toBlob((blob) => {
      if (!blob) return
      if (compressedUrl.value) URL.revokeObjectURL(compressedUrl.value)
      compressedUrl.value = URL.createObjectURL(blob)
      compressedSize.value = blob.size
    }, mime, q)
  }
  img.src = imageUrl.value
}
</script>


