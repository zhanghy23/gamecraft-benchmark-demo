const matrixShell = document.querySelector('#matrixShell');
const stats = document.querySelector('#stats');
const updatedAt = document.querySelector('#updatedAt');
const dialog = document.querySelector('#playDialog');
const frame = document.querySelector('#gameFrame');
const dialogTitle = document.querySelector('#dialogTitle');
const dialogMeta = document.querySelector('#dialogMeta');
const standalone = document.querySelector('#openStandalone');
const closeDialog = document.querySelector('#closeDialog');
const versionSelect = document.querySelector('#benchmarkVersionSelect');
const versionTitle = document.querySelector('#versionPanelTitle');
const versionStatus = document.querySelector('#versionStatus');
const versionDescription = document.querySelector('#versionDescription');
const versionMeta = document.querySelector('#versionMeta');

let catalog = null;
let activeLoad = 0;

const number = new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 2 });

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function scoreTone(base) {
  if (base >= 90) return 'excellent';
  if (base >= 75) return 'good';
  if (base >= 60) return 'fair';
  return 'low';
}

function playResult(result, game, model) {
  const url = new URL(result.playPath, window.location.href).href;
  dialogTitle.textContent = game.titleZh;
  dialogMeta.textContent = `${model.label} · ${result.score.display}`;
  standalone.href = url;
  frame.src = url;
  dialog.showModal();
  frame.focus();
}

function closePlayer() {
  frame.src = 'about:blank';
  dialog.close();
}

function resultCard(result, game, model) {
  if (!result) {
    return `
      <article class="result-card pending-card">
        <div>
          <strong>尚无该版本结果</strong>
          <p>${escapeHtml(game.titleZh)} · ${escapeHtml(model.label)} 的评测结果尚未发布。</p>
        </div>
      </article>`;
  }
  if (result.status === 'failed') {
    return `
      <article class="result-card failed-card">
        <div class="failure-preview" role="img" aria-label="${escapeHtml(game.titleZh)} · ${escapeHtml(model.label)} 评测失败，不可试玩">
          <span>评测失败</span>
          <strong>不可试玩</strong>
          <small>${escapeHtml(result.stage)}</small>
        </div>
        <div class="failure-meta">
          <strong>未生成最终评分</strong>
          <span>${escapeHtml(result.runId)}</span>
        </div>
        <p class="issue-note"><strong>失败原因：</strong>${escapeHtml(result.issue)}</p>
      </article>`;
  }
  const note = result.issue
    ? `<p class="issue-note"><strong>运行提示：</strong>${escapeHtml(result.issue)}</p>`
    : '';

  return `
    <article class="result-card">
      <button class="preview-button" type="button" data-play="${escapeHtml(game.id)}|${escapeHtml(model.id)}" aria-label="试玩 ${escapeHtml(game.titleZh)}，由 ${escapeHtml(model.label)} 生成">
        <img src="${escapeHtml(result.previewPath)}" alt="${escapeHtml(game.titleZh)} · ${escapeHtml(model.label)} 游戏预览" loading="lazy" />
        <span class="play-badge"><span aria-hidden="true">▶</span> 开始试玩</span>
      </button>
      <div class="score-row">
        <div>
          <span class="score-label">基础分</span>
          <strong class="score-value ${scoreTone(result.score.base)}">${number.format(result.score.base)}</strong>
        </div>
        <div class="score-side">
          <span>${result.score.passed}/${result.score.denominator} 通过</span>
          <span>${result.traceCount} 条最终 Trace</span>
        </div>
      </div>
      <div class="score-breakdown">
        <span>Dynamic <strong>${result.score.dynamic}</strong></span>
        <span>动态加分 <strong>+${number.format(result.score.dynamicAddition)}</strong></span>
        <span>潜在总分 <strong>${number.format(result.score.potential)}</strong></span>
      </div>
      ${note}
    </article>`;
}

function unmetGroup(title, description, items, tone) {
  const content = items.length
    ? `<ol class="unmet-list">
        ${items.map((item) => `
          <li>
            <code>${escapeHtml(item.id.replace('target-', '#'))}</code>
            <span class="unmet-copy">
              <span>${escapeHtml(item.zh)}</span>
              ${item.cause ? `<small>${escapeHtml(item.cause)}</small>` : ''}
            </span>
          </li>`).join('')}
      </ol>`
    : '<p class="unmet-empty">此类没有未满足项</p>';

  return `
    <section class="unmet-group ${tone}">
      <div class="unmet-group-heading">
        <div>
          <strong>${escapeHtml(title)}</strong>
          <p>${escapeHtml(description)}</p>
        </div>
        <span>${items.length} 条</span>
      </div>
      ${content}
    </section>`;
}

function unmetCard(result) {
  if (!result) {
    return `
      <article class="unmet-card pending-card">
        <div>
          <strong>等待评测结果</strong>
          <p>版本快照发布该组合后，这里会显示未满足需求及原因分类。</p>
        </div>
      </article>`;
  }
  if (result.status === 'failed') {
    return `
      <article class="unmet-card failed-unmet-card">
        <div>
          <strong>没有可用的最终评审报告</strong>
          <p>流水线在 ${escapeHtml(result.stage)} 阶段失败，因此不伪造 VLM 或 Replay / Trace 未满足项。</p>
        </div>
      </article>`;
  }
  const vlmUnmet = result.unmet.vlm;
  const replayTraceUnmet = result.unmet.replayTrace;
  const totalUnmet = vlmUnmet.length + replayTraceUnmet.length;

  if (!totalUnmet) {
    return `
      <article class="unmet-card success-card">
        <div class="success-icon" aria-hidden="true">✓</div>
        <div>
          <strong>全部需求均已满足</strong>
          <p>最终评审没有发现未满足项。</p>
        </div>
      </article>`;
  }

  return `
    <article class="unmet-card">
      <div class="unmet-heading">
        <strong>未满足 ${totalUnmet} 条</strong>
        <span>共 ${result.score.denominator} 条需求</span>
      </div>
      <div class="unmet-sections">
        ${unmetGroup(
          'VLM 判断未满足',
          '已进入视频评审，但 VLM 没有观察到要求中的视觉结果。',
          vlmUnmet,
          'vlm-group',
        )}
        ${unmetGroup(
          'Replay / Trace 原因未满足',
          '未进入 VLM；由触发不可达、源码错误或证据链不足导致。',
          replayTraceUnmet,
          'trace-group',
        )}
      </div>
    </article>`;
}

function requirementsCard(game) {
  const requirements = game.requirements ?? [];
  return `
    <section class="game-requirements requirements-cell" style="grid-column: span 2" aria-label="${escapeHtml(game.titleZh)} 完整中文需求">
      <div class="requirements-heading">
        <div>
          <span>总体需求</span>
          <strong>${escapeHtml(game.titleZh)}</strong>
        </div>
        <b>${requirements.length} 条细项</b>
      </div>
      <p class="requirements-summary">${escapeHtml(game.summaryZh)}</p>
      <ol class="requirements-list" tabindex="0">
        ${requirements.map((item) => `
          <li>
            <code>${escapeHtml(item.id.replace('target-', '#'))}</code>
            <span>${escapeHtml(item.zh)}</span>
          </li>`).join('')}
      </ol>
    </section>`;
}

function renderMatrix(data) {
  const columns = `180px repeat(${data.games.length}, minmax(310px, 360px) minmax(310px, 390px))`;
  const cells = [];

  cells.push('<div class="corner header-cell">生成模型</div>');
  for (const game of data.games) {
    cells.push(`
      <div class="game-header header-cell" style="grid-column: span 2">
        <span>${escapeHtml(game.typeZh)}</span>
        <strong>${escapeHtml(game.titleZh)}</strong>
        <small>${game.targetCount} 条固定需求</small>
      </div>`);
  }

  cells.push('<div class="requirements-corner requirements-cell">总体与完整需求</div>');
  for (const game of data.games) {
    cells.push(requirementsCard(game));
  }

  cells.push('<div class="sub-corner subheader-cell">固定模型顺序</div>');
  for (const _game of data.games) {
    cells.push('<div class="subheader-cell">试玩与评分</div>');
    cells.push('<div class="subheader-cell unmet-subheader">中文未满足需求（按原因）</div>');
  }

  for (const model of data.models) {
    cells.push(`
      <aside class="model-cell">
        <span class="model-index">${String(model.order).padStart(2, '0')}</span>
        <strong>${escapeHtml(model.label)}</strong>
        <small>${escapeHtml(model.provider)}</small>
      </aside>`);
    for (const game of data.games) {
      const result = data.results[game.id]?.[model.id];
      cells.push(resultCard(result, game, model));
      cells.push(unmetCard(result));
    }
  }

  matrixShell.innerHTML = `<div class="matrix" style="grid-template-columns:${columns}">${cells.join('')}</div>`;
  matrixShell.querySelectorAll('[data-play]').forEach((button) => {
    button.addEventListener('click', () => {
      const [gameId, modelId] = button.dataset.play.split('|');
      const game = data.games.find((item) => item.id === gameId);
      const model = data.models.find((item) => item.id === modelId);
      playResult(data.results[gameId]?.[modelId], game, model);
    });
  });
}

function renderStats(data) {
  const totalCount = data.games.length * data.models.length;
  const resultList = Object.values(data.results)
    .flatMap((game) => Object.values(game))
    .filter(Boolean);
  const best = resultList
    .filter((result) => result.status !== 'failed' && result.score)
    .sort((a, b) => b.score.base - a.score.base)[0];
  const values = [
    [data.models.length, '生成模型'],
    [data.games.length, '基准游戏'],
    [`${resultList.length}/${totalCount}`, '已发布结果'],
    [best ? number.format(best.score.base) : '—', '最高基础分'],
  ];
  stats.innerHTML = values.map(([value, label]) => `<div><dt>${value}</dt><dd>${label}</dd></div>`).join('');
}

function renderVersionInfo(version, data) {
  const statusLabels = {
    complete: '已完成',
    running: '评测中',
    partial: '部分结果',
    archived: '历史版本',
  };
  versionTitle.textContent = version.label;
  versionStatus.textContent = statusLabels[version.status] ?? version.status;
  versionStatus.className = `version-status ${version.status ?? ''}`;
  versionDescription.textContent = version.description;
  const resultCount = Object.values(data.results).reduce(
    (sum, gameResults) => sum + Object.keys(gameResults).length,
    0,
  );
  const metadata = [
    ['Harness', version.harnessRevision ?? version.id],
    ['Judge', version.judgeModel ?? '—'],
    ['结果', `${resultCount}/${data.games.length * data.models.length}`],
    ['更新', version.updatedAt ?? data.updatedAt],
  ];
  versionMeta.innerHTML = metadata.map(([label, value]) => `
    <div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('');
  updatedAt.textContent = `当前版本：${version.label} · 数据更新：${version.updatedAt ?? data.updatedAt}`;
  document.title = `${version.label} · GameCraft Benchmark Demo`;
}

function updateVersionUrl(versionId) {
  const url = new URL(window.location.href);
  url.searchParams.set('version', versionId);
  window.history.replaceState({}, '', url);
  try {
    window.localStorage.setItem('gamecraft-benchmark-version', versionId);
  } catch {
    // Storage can be disabled; the URL still preserves the selected version.
  }
}

async function loadVersion(versionId, { updateUrl = true } = {}) {
  const version = catalog.versions.find((item) => item.id === versionId);
  if (!version) throw new Error(`未知评测版本：${versionId}`);
  const loadId = ++activeLoad;
  versionSelect.disabled = true;
  versionSelect.value = version.id;
  matrixShell.setAttribute('aria-busy', 'true');
  matrixShell.innerHTML = `<div class="loading">正在加载 ${escapeHtml(version.label)} 的评测结果…</div>`;

  try {
    const versionUrl = new URL(version.dataPath, window.location.href);
    versionUrl.searchParams.set('revision', version.dataRevision ?? version.updatedAt ?? version.id);
    const response = await fetch(versionUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (loadId !== activeLoad) return;
    if (data.id !== version.id) throw new Error(`版本文件不匹配：期望 ${version.id}，实际 ${data.id}`);
    renderStats(data);
    renderMatrix(data);
    renderVersionInfo(version, data);
    if (updateUrl) updateVersionUrl(version.id);
  } catch (error) {
    if (loadId !== activeLoad) return;
    matrixShell.innerHTML = `<div class="error-state">版本数据加载失败：${escapeHtml(error.message)}</div>`;
    updatedAt.textContent = `${version.label} 数据加载失败`;
  } finally {
    if (loadId === activeLoad) {
      versionSelect.disabled = false;
      matrixShell.removeAttribute('aria-busy');
    }
  }
}

function preferredVersionId() {
  const fromUrl = new URL(window.location.href).searchParams.get('version');
  if (catalog.versions.some((version) => version.id === fromUrl)) return fromUrl;
  try {
    const stored = window.localStorage.getItem('gamecraft-benchmark-version');
    if (catalog.versions.some((version) => version.id === stored)) return stored;
  } catch {
    // Fall back to the catalog default when storage is unavailable.
  }
  return catalog.defaultVersionId;
}

async function main() {
  try {
    const catalogUrl = new URL('data/results.json', window.location.href);
    catalogUrl.searchParams.set('request', Date.now());
    const response = await fetch(catalogUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    catalog = await response.json();
    if (!Array.isArray(catalog.versions) || !catalog.versions.length) {
      throw new Error('没有可用的评测版本');
    }
    versionSelect.innerHTML = catalog.versions.map((version) => `
      <option value="${escapeHtml(version.id)}">${escapeHtml(version.label)}</option>`).join('');
    versionSelect.addEventListener('change', () => loadVersion(versionSelect.value));
    await loadVersion(preferredVersionId(), { updateUrl: true });
  } catch (error) {
    matrixShell.innerHTML = `<div class="error-state">结果目录加载失败：${escapeHtml(error.message)}</div>`;
    updatedAt.textContent = '数据加载失败';
    versionTitle.textContent = '评测版本加载失败';
    versionStatus.textContent = '不可用';
    versionStatus.className = 'version-status failed';
    versionDescription.textContent = error.message;
  }
}

closeDialog.addEventListener('click', closePlayer);
dialog.addEventListener('cancel', (event) => {
  event.preventDefault();
  closePlayer();
});
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) closePlayer();
});

main();
