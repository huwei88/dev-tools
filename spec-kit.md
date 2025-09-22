1. 项目概述 (Project Overview)

项目名称: Web DevToys

项目愿景: 完整复刻原生 DevToys 应用的核心功能，构建一个终极的、运行在浏览器中的免费开发者工具集。所有操作均在客户端完成，确保 100% 的数据隐私和极致的性能。

核心目标:

实现 DevToys 中所有主流工具的 Web 版本。

通过分类和搜索功能，提供清晰的工具导航。

确保高性能，即使是处理大数据（如大文件的哈希计算）也不会卡死 UI。

可通过 GitHub Pages 直接部署和访问。

2. 技术栈与项目结构 (Tech Stack & Structure)

核心框架: Vue 3 (使用 Composition API 和 <script setup>)

构建工具: Vite

UI & 样式: Tailwind CSS

路由: Vue Router

状态管理 (可选): Pinia (用于管理全局设置，如主题)

代码编辑器组件 (推荐): CodeMirror 6 或 Monaco Editor (VS Code's Editor)。对于需要代码输入的工具，使用专业编辑器组件能极大提升用户体验（语法高亮、错误提示等）。

项目结构:

/src
├── App.vue
├── main.js
├── router/
├── assets/
├── components/         # 共享组件 (如 AppShell, Sidebar, ToolWrapper)
└── tools/              # 按分类存放所有工具组件
    ├── converters/
    │   ├── JsonYamlConverter.vue
    │   └── NumberBaseConverter.vue
    ├── encoders/
    │   ├── HtmlEncoder.vue
    │   └── UrlEncoder.vue
    ├── formatters/
    │   └── JsonFormatter.vue
    └── ...             # 其他分类
3. 应用外壳与导航规范 (App Shell & Navigation)

AppShell.vue:

布局: 左侧为固定宽度的工具导航栏，右侧为展示当前工具的主内容区。

导航栏 (Sidebar.vue):

顶部有一个搜索框，可实时模糊搜索所有工具名称。

下方是可折叠的工具分类列表 (Converters, Encoders/Decoders, Formatters, etc.)。

点击工具名称，右侧内容区通过 Vue Router 切换到对应的工具组件。

当前激活的工具应高亮显示。

ToolWrapper.vue:

每个工具组件都应该被这个包装器组件包裹。

提供统一的头部，显示工具的名称和简短描述。

可以提供一些通用操作，例如“复制输出”、“清空输入”等。

4. 全功能工具集规范 (Full Feature Specification)

这是项目的核心。我们将按照 DevToys 的分类来定义每个工具。

A. 转换器 (Converters)

JSON <> YAML

组件名: JsonYamlConverter.vue

功能: 双向、实时转换 JSON 和 YAML。

UI/UX: 两个并排的代码编辑区。支持缩进设置。实时语法检查和错误提示。

数字进制转换 (Number Base)

组件名: NumberBaseConverter.vue

功能: 在二进制、八进制、十进制、十六进制之间转换。

UI/UX: 四个输入框，分别对应不同进制。修改任意一个，其他三个自动更新。

时间戳 (Timestamp)

组件名: TimestampConverter.vue

功能: 在 Unix 时间戳和人类可读的日期时间 (UTC/Local) 之间转换。

UI/UX: 显示当前时间戳。一个输入框用于时间戳，一个日期时间选择器。双向绑定。

Cron 解析器 (Cron Parser)

组件名: CronParser.vue

功能: 解析 Cron 表达式，并生成接下来 N 次的执行时间。

UI/UX: 一个输入框用于 Cron 表达式。下方列表显示即将到来的执行日期。

B. 编码/解码 (Encoders / Decoders)

HTML

组件名: HtmlEncoder.vue

功能: HTML 实体编码和解码。

UI/UX: 两个文本区，输入原文，输出编码/解码后的文本。一个开关选择模式。

URL

组件名: UrlEncoder.vue

功能: URL 编码和解码。

UI/UX: 类似 HTML 工具，两个文本区，一个开关。

Base64 (文本 & 文件)

组件名: Base64Coder.vue

功能: 对文本和文件进行 Base64 编码和解码。

UI/UX: Tab 页切换“文本”和“文件”模式。文本模式是两个文本区。文件模式是一个文件上传框，下方显示 Base64 字符串或提供解码后文件的下载链接。

GZip

组件名: GzipCompressor.vue

功能: 使用 GZip 压缩和解压文本。

UI/UX: 两个文本区，显示压缩率。

JWT 解码器

组件名: JwtDecoder.vue

功能: 解析 JWT，显示 Header, Payload 和签名。无需验证签名。

UI/UX: 一个输入框。下方三个格式化好的代码块分别显示三部分内容。

C. 格式化工具 (Formatters)

JSON

组件名: JsonFormatter.vue

功能: 格式化（美化）或压缩 JSON 数据。

UI/UX: 一个代码编辑区用于输入。提供“格式化”和“压缩”按钮。提供缩进选项（2空格，4空格，Tab）。

SQL

组件名: SqlFormatter.vue

功能: 格式化 SQL 查询语句。

UI/UX: 类似 JSON 格式化器。可选择不同的 SQL 方言（如 Standard, MySQL, PostgreSQL）。

XML

组件名: XmlFormatter.vue

功能: 格式化或压缩 XML 数据。

UI/UX: 类似 JSON 格式化器。

D. 生成器 (Generators)

哈希 (Hash)

组件名: HashGenerator.vue

功能: 计算文本或文件的哈希值。

UI/UX: Tab 页切换“文本”和“文件”模式。支持 MD5, SHA1, SHA256, SHA512 等算法。实时计算并显示结果。

UUID

组件名: UuidGenerator.vue

功能: 生成一个或多个 UUID v1 或 v4。

UI/UX: 选项选择 UUID 版本。输入框选择生成数量。一个“生成”按钮，下方列表显示结果。

Lorem Ipsum

组件名: LoremIpsumGenerator.vue

功能: 生成 Lorem Ipsum 占位文本。

UI/UX: 选项选择生成段落、句子或单词。输入框指定数量。

Checksum

组件名: ChecksumGenerator.vue

功能: 计算文件的 Checksum (支持多种算法)。

UI/UX: 一个文件上传框，计算后显示不同算法的结果。

E. 文本工具 (Text)

文本比较 (Text Diff)

组件名: TextDiffViewer.vue

功能: 对比两段文本的差异。

UI/UX: 两个并排的文本输入区。下方或侧边以高亮形式显示差异（类似 Git Diff）。

Regex 测试器

组件名: RegexTester.vue

功能: 测试正则表达式。

UI/UX: 一个输入框用于正则表达式。一个输入框用于测试字符串。选项用于 flag (g, i, m)。下方区域高亮并列出所有匹配项。

文本统计 (Inspector & Case Converter)

组件名: TextInspector.vue

功能: 统计字符数、词数、行数等。并提供大小写转换功能。

UI/UX: 一个大文本区。下方实时显示统计数据。提供一组按钮用于转换为驼峰、下划线、大写、小写等。

F. 图形工具 (Graphic)

颜色选择器与对比度

组件名: ColorPicker.vue

功能: 从调色板选择颜色，并计算两种颜色之间的对比度。

UI/UX: 两个颜色选择器（用于前景和背景）。显示颜色的 HEX, RGB, HSL 值。实时计算并显示 WCAG 对比度，并提示是否通过 AA/AAA 级别。

图像压缩

组件名: ImageCompressor.vue

功能: 压缩 PNG/JPEG 图像大小。

UI/UX: 一个文件上传区。提供压缩质量滑块。显示压缩前后的文件大小和压缩率。提供下载按钮。