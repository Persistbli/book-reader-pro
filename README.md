# BookReader Pro

> 多格式电子书阅读器，支持 EPUB / PDF / TXT / Markdown / CBZ / HTML

## 在线预览

克隆后本地运行：

```bash
npm install
npm run dev
```

## 技术架构

| 模块 | 技术 |
|------|------|
| 框架 | React 18 + Vite 5 |
| 样式 | TailwindCSS 3 |
| 状态 | Zustand |
| 存储 | IndexedDB |
| EPUB | epub.js |
| PDF | pdf.js |
| MD | marked |
| CBZ | jszip |

## 本地运行（生产构建）

```bash
# 构建
npm run build

# 方式1：Vite preview（推荐，MIME类型正确）
npx vite preview --port 8080

# 方式2：serve
npx serve dist -l 8080

# 方式3：Python http.server（需修正MIME类型）
python -c "
import http.server, socketserver
class Handler(http.server.SimpleHTTPRequestHandler):
    def guess_type(self, path):
        if path.endswith('.js'):
            return 'application/javascript'
        return super().guess_type(path)
Handler.extensions_map['.js'] = 'application/javascript'
import socketserver
with socketserver.TCPServer(('', 8080), Handler) as httpd:
    httpd.serve_forever()
" -d dist
```

> ⚠️ Python `http.server` 默认把 `.js` 当 `text/plain`，会导致 ES module 被浏览器拒绝加载。请使用上方修正方案或 Vite preview。

## 支持的格式

| 格式 | 扩展名 | 解析器 |
|------|--------|--------|
| EPUB | `.epub` | epub.js 原生渲染 |
| PDF | `.pdf` | pdf.js 分页渲染 |
| TXT | `.txt` | 原生分段渲染 |
| Markdown | `.md` `.markdown` | marked 解析 |
| CBZ | `.cbz` | jszip 解包图片 |
| HTML | `.html` `.htm` | 原生渲染 |

## 功能

- **书架管理** — 网格/列表视图、拖拽导入、封面展示
- **阅读器** — 字体大小、行间距、4 种主题（白/暖/灰/黑）
- **目录导航** — EPUB/Markdown 章节跳转
- **阅读进度** — 自动保存、书签
- **响应式布局** — PC / 平板 / 手机

## 项目结构

```
src/
├── core/
│   ├── parsers/      # 插件化 Parser Registry + 6 个解析器
│   ├── reader/       # 阅读器核心逻辑
│   └── storage/      # IndexedDB 封装
├── components/
│   ├── Bookshelf/    # BookCard
│   ├── Reader/       # 各格式阅读器 + 设置面板
│   └── common/       # DropZone
├── pages/            # BookshelfPage / ReaderPage
└── stores/           # Zustand 状态管理
```

## 开发者

[@Persistbli](https://github.com/Persistbli)
