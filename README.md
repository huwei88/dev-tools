# Web DevToys

一个现代化的开发者工具箱，提供各种实用的在线工具。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 快速的前端构建工具
- **Vue Router** - Vue.js 官方路由管理器
- **Tailwind CSS** - 实用优先的 CSS 框架

## 项目结构

```
src/
├── components/          # 可复用组件
│   ├── AppShell.vue    # 应用外壳组件
│   ├── Sidebar.vue     # 侧边栏组件
│   └── ToolWrapper.vue # 工具包装器组件
├── tools/              # 工具分类目录
│   ├── converters/     # 转换器工具
│   ├── encoders/       # 编码器工具
│   ├── formatters/     # 格式化工具
│   ├── generators/     # 生成器工具
│   ├── text/          # 文本工具
│   └── graphic/       # 图形工具
├── views/             # 页面视图
│   └── Home.vue       # 首页
├── router/            # 路由配置
└── assets/            # 静态资源
```

## 开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 功能特性

- 🎨 现代化的 UI 设计
- 📱 响应式布局
- 🔍 工具搜索功能
- 📂 分类管理
- 🚀 快速加载

## 工具分类

- **转换器** - 各种格式转换工具
- **编码器** - 文本编码解码工具
- **格式化** - 代码格式化工具
- **生成器** - 各种数据生成工具
- **文本工具** - 文本处理工具
- **图形工具** - 图像处理工具

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。
