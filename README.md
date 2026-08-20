# GameCraft Benchmark Demo

一个面向浏览器游戏生成 Benchmark 的公开结果站点。当前展示 4 个游戏生成模型在 9 个游戏上的评测终态，并提供评测版本切换、每个游戏的总体需求与完整中文细项、成功模型可直接试玩的静态构建、最终评分，以及按 VLM 判断和 Replay / Trace 原因分类的中文未满足需求；流水线失败项会明确标记为不可试玩，不伪造评分或未满足项。

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

- `site/data/results.json`：评测版本目录，保存默认版本和所有可选版本的元数据。
- `site/data/versions/<version>.json`：某一评测版本的模型、游戏、需求与结果快照；历史版本不会被新分数覆盖。
- `site/games/<game>/<model>/`：各模型生成游戏的静态构建。
- `site/previews/<game>/<model>.png`：结果卡片预览图。
- `scripts/generate-data.mjs`：从 `.import/` 中的 Benchmark 报告生成公开数据。
- `.github/workflows/pages.yml`：GitHub Pages 部署流程。

## 增加新游戏

1. 将新游戏的固定需求保存为 `.import/targets/<game>.json`。
2. 将每个模型的 `final-vlm-report.json` 保存为 `.import/reports/<game>/<model>.json`。
3. 将构建复制到 `site/games/<game>/<model>/`，并确保 `index.html` 使用相对资源路径（例如 `./assets/...`）。
4. 将预览图保存为 `site/previews/<game>/<model>.png`。
5. 在 `scripts/generate-data.mjs` 中增加游戏元数据、总体需求概述和全部需求的中文说明。
6. 执行 `node scripts/generate-data.mjs`，生成或更新默认的 v8 版本，再本地验收。

生成脚本会校验每一条固定需求是否都有中文说明，防止新增结果时遗漏公开展示内容。

## 增加评测版本

把该版本的报告按 `<reports-root>/<game>/<model>.json` 整理后执行：

```bash
node scripts/generate-data.mjs \
  --version-id v8-adaptive-video \
  --version-label "v8 · 原生画质重判" \
  --version-description "复用 v8 Replay，采用自适应原生画质转码重新进行 VLM Judge。" \
  --reports-root .import/reports-v8-adaptive-video \
  --updated-at 2026-08-20 \
  --data-revision adaptive-video-v8-20260820-143609 \
  --harness-revision v8-adaptive-video \
  --judge-model Seed-2.0-Pro
```

脚本会新增或替换同 ID 的版本快照，并保留其他历史版本。需要让新版本成为页面默认选项时，再加 `--set-default`。页面选择会写入 `?version=<id>`，因此可以直接分享指定版本的网址。

长时间评测可以逐游戏发布。将已经完成的游戏 ID 以逗号连接，并允许尚未导入的组合保持“尚无该版本结果”：

```bash
node scripts/generate-data.mjs \
  --version-id v8.1-video-transcode \
  --version-label "v8.1 视频转码优化" \
  --reports-root .import/reports-v8.1-video-transcode \
  --include-games radius-raid,highway-404 \
  --allow-partial \
  --status partial \
  --data-revision adaptive-video-games-2
```

页面仍保留全部游戏和模型坐标，尚未完成的组合显示为等待发布。最后一个游戏完成后移除 `--allow-partial` 和 `--include-games`、把状态改为 `complete`，需要时使用 `--set-default`。
