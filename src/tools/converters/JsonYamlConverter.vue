<template>
  <div class="space-y-6">
    <!-- 工具标题和描述 -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">JSON <> YAML 转换器</h1>
      <p class="text-gray-600">双向、实时转换 JSON 和 YAML 格式</p>
    </div>

    <!-- 配置选项 -->
    <div class="bg-gray-50 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <label for="indent" class="text-sm font-medium text-gray-700">缩进:</label>
            <select
              id="indent"
              v-model="indentSize"
              class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="2">2 空格</option>
              <option value="4">4 空格</option>
            </select>
          </div>
          
          <div class="flex items-center space-x-2">
            <label class="flex items-center">
              <input
                v-model="autoConvert"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span class="ml-2 text-sm text-gray-700">自动转换</span>
            </label>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <button
            @click="swapContent"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            交换内容
          </button>
        </div>
      </div>
    </div>

    <!-- 转换器主体 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- JSON 输入区域 -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 flex items-center">
            <div class="w-6 h-6 bg-green-100 rounded mr-2 flex items-center justify-center">
              <span class="text-green-600 text-xs font-bold">J</span>
            </div>
            JSON
          </h3>
          <div class="flex items-center space-x-2">
            <button
              @click="copyToClipboard('json')"
              class="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              复制
            </button>
            <button
              @click="clearContent('json')"
              class="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              清空
            </button>
          </div>
        </div>
        
        <div class="relative">
          <textarea
            v-model="jsonInput"
            @input="handleJsonInput"
            :class="[
              'w-full h-96 p-4 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              jsonError ? 'border-red-300 bg-red-50' : 'border-gray-300'
            ]"
            placeholder="请输入 JSON 格式的数据..."
          ></textarea>
          
          <!-- JSON 错误提示 -->
          <div v-if="jsonError" class="absolute bottom-2 left-2 right-2 bg-red-100 border border-red-300 rounded p-2">
            <div class="flex items-start">
              <svg class="w-4 h-4 text-red-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="text-sm text-red-700">
                <p class="font-medium">JSON 格式错误:</p>
                <p class="text-xs mt-1">{{ jsonError }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- YAML 输出区域 -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 flex items-center">
            <div class="w-6 h-6 bg-blue-100 rounded mr-2 flex items-center justify-center">
              <span class="text-blue-600 text-xs font-bold">Y</span>
            </div>
            YAML
          </h3>
          <div class="flex items-center space-x-2">
            <button
              @click="copyToClipboard('yaml')"
              class="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              复制
            </button>
            <button
              @click="clearContent('yaml')"
              class="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              清空
            </button>
          </div>
        </div>
        
        <div class="relative">
          <textarea
            v-model="yamlInput"
            @input="handleYamlInput"
            :class="[
              'w-full h-96 p-4 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              yamlError ? 'border-red-300 bg-red-50' : 'border-gray-300'
            ]"
            placeholder="请输入 YAML 格式的数据..."
          ></textarea>
          
          <!-- YAML 错误提示 -->
          <div v-if="yamlError" class="absolute bottom-2 left-2 right-2 bg-red-100 border border-red-300 rounded p-2">
            <div class="flex items-start">
              <svg class="w-4 h-4 text-red-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="text-sm text-red-700">
                <p class="font-medium">YAML 格式错误:</p>
                <p class="text-xs mt-1">{{ yamlError }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 示例数据 -->
    <div class="bg-gray-50 rounded-lg p-4">
      <h4 class="text-sm font-medium text-gray-900 mb-3">示例数据</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          @click="loadExample('user')"
          class="text-left p-3 bg-white rounded border hover:bg-gray-50 transition-colors"
        >
          <div class="font-medium text-gray-900">用户信息</div>
          <div class="text-sm text-gray-500 mt-1">包含基本用户数据的 JSON 示例</div>
        </button>
        <button
          @click="loadExample('config')"
          class="text-left p-3 bg-white rounded border hover:bg-gray-50 transition-colors"
        >
          <div class="font-medium text-gray-900">配置文件</div>
          <div class="text-sm text-gray-500 mt-1">应用程序配置的 YAML 示例</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import * as yaml from 'js-yaml'

// 响应式数据
const jsonInput = ref('')
const yamlInput = ref('')
const jsonError = ref('')
const yamlError = ref('')
const indentSize = ref(2)
const autoConvert = ref(true)

// 防抖定时器
let jsonTimer = null
let yamlTimer = null

// JSON 输入处理
const handleJsonInput = () => {
  if (!autoConvert.value) return
  
  clearTimeout(jsonTimer)
  jsonTimer = setTimeout(() => {
    convertJsonToYaml()
  }, 300)
}

// YAML 输入处理
const handleYamlInput = () => {
  if (!autoConvert.value) return
  
  clearTimeout(yamlTimer)
  yamlTimer = setTimeout(() => {
    convertYamlToJson()
  }, 300)
}

// JSON 转 YAML
const convertJsonToYaml = () => {
  if (!jsonInput.value.trim()) {
    yamlInput.value = ''
    jsonError.value = ''
    return
  }

  try {
    const jsonObj = JSON.parse(jsonInput.value)
    const indent = parseInt(indentSize.value)
    const yamlStr = yaml.dump(jsonObj, { 
      indent,
      lineWidth: -1,
      noRefs: true,
      sortKeys: false
    })
    yamlInput.value = yamlStr
    jsonError.value = ''
  } catch (error) {
    jsonError.value = error.message
  }
}

// YAML 转 JSON
const convertYamlToJson = () => {
  if (!yamlInput.value.trim()) {
    jsonInput.value = ''
    yamlError.value = ''
    return
  }

  try {
    const yamlObj = yaml.load(yamlInput.value)
    const jsonStr = JSON.stringify(yamlObj, null, parseInt(indentSize.value))
    jsonInput.value = jsonStr
    yamlError.value = ''
  } catch (error) {
    yamlError.value = error.message
  }
}

// 复制到剪贴板
const copyToClipboard = async (type) => {
  const content = type === 'json' ? jsonInput.value : yamlInput.value
  
  if (!content.trim()) {
    alert('没有内容可复制')
    return
  }

  try {
    await navigator.clipboard.writeText(content)
    // 简单的成功提示
    const button = event.target.closest('button')
    const originalText = button.textContent
    button.textContent = '已复制!'
    setTimeout(() => {
      button.textContent = originalText
    }, 1000)
  } catch (error) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = content
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('已复制到剪贴板')
  }
}

// 清空内容
const clearContent = (type) => {
  if (type === 'json') {
    jsonInput.value = ''
    jsonError.value = ''
  } else {
    yamlInput.value = ''
    yamlError.value = ''
  }
}

// 交换内容
const swapContent = () => {
  const tempJson = jsonInput.value
  const tempYaml = yamlInput.value
  
  jsonInput.value = tempYaml
  yamlInput.value = tempJson
  
  // 交换后重新转换
  if (autoConvert.value) {
    convertYamlToJson()
  }
}

// 加载示例数据
const loadExample = (type) => {
  if (type === 'user') {
    const userExample = {
      "name": "张三",
      "age": 25,
      "email": "zhangsan@example.com",
      "address": {
        "city": "北京",
        "district": "朝阳区",
        "street": "三里屯街道"
      },
      "hobbies": ["读书", "游泳", "编程"],
      "isActive": true
    }
    jsonInput.value = JSON.stringify(userExample, null, parseInt(indentSize.value))
    if (autoConvert.value) {
      convertJsonToYaml()
    }
  } else if (type === 'config') {
    const configExample = `# 应用程序配置
app:
  name: "Web DevToys"
  version: "1.0.0"
  debug: true

database:
  host: "localhost"
  port: 5432
  name: "devtoys_db"
  ssl: false

features:
  - "json_converter"
  - "yaml_converter"
  - "text_formatter"

logging:
  level: "info"
  file: "/var/log/app.log"
  maxSize: "10MB"`

    yamlInput.value = configExample
    if (autoConvert.value) {
      convertYamlToJson()
    }
  }
}

// 监听缩进设置变化
watch(indentSize, () => {
  if (autoConvert.value) {
    convertJsonToYaml()
  }
})

// 监听自动转换设置
watch(autoConvert, (newValue) => {
  if (newValue && jsonInput.value.trim()) {
    convertJsonToYaml()
  }
})
</script>
