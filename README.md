# GameCraft Benchmark Demo

一个面向浏览器游戏生成 Benchmark 的公开结果站点。当前展示 4 个游戏生成模型在 3 个游戏上的 12 次完整评测，并提供可直接试玩的静态构建、最终评分和中文未满足需求。

## 在线访问

正式公网地址：**[https://zhanghy23.github.io/gamecraft-benchmark-demo/](https://zhanghy23.github.io/gamecraft-benchmark-demo/)**

该地址由 GitHub Pages 自动部署，任何人都可以直接访问并试玩游戏。

## 本地开发预览

以下地址仅用于在开发电脑上检查改动，不是公网网址：

```bash
python3 -m http.server 4173 -d site
```

然后在本机打开 <http://127.0.0.1:4173/>。

## 数据与目录

- `site/data/results.json`：页面唯一数据源。
- `site/games/<game>/<model>/`：各模型生成游戏的静态构建。
- `site/previews/<game>/<model>.png`：结果卡片预览图。
- `scripts/generate-data.mjs`：从 `.import/` 中的 Benchmark 报告生成公开数据。
- `.github/workflows/pages.yml`：GitHub Pages 部署流程。

## 增加新游戏

1. 将新游戏的固定需求保存为 `.import/targets/<game>.json`。
2. 将每个模型的 `final-vlm-report.json` 保存为 `.import/reports/<game>/<model>.json`。
3. 将构建复制到 `site/games/<game>/<model>/`，并确保 `index.html` 使用相对资源路径（例如 `./assets/...`）。
4. 将预览图保存为 `site/previews/<game>/<model>.png`。
5. 在 `scripts/generate-data.mjs` 中增加游戏元数据、运行映射和失败需求中文说明。
6. 执行 `node scripts/generate-data.mjs`，再本地验收。

生成脚本会校验每条失败需求是否都有中文说明，防止新增结果时遗漏公开展示内容。
