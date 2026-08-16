const matrixShell = document.querySelector('#matrixShell');
const stats = document.querySelector('#stats');
const updatedAt = document.querySelector('#updatedAt');
const dialog = document.querySelector('#playDialog');
const frame = document.querySelector('#gameFrame');
const dialogTitle = document.querySelector('#dialogTitle');
const dialogMeta = document.querySelector('#dialogMeta');
const standalone = document.querySelector('#openStandalone');
const closeDialog = document.querySelector('#closeDialog');

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

function unmetCard(result) {
  if (!result.unmet.length) {
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
        <strong>未满足 ${result.unmet.length} 条</strong>
        <span>共 ${result.score.denominator} 条需求</span>
      </div>
      <ol class="unmet-list">
        ${result.unmet.map((item) => `
          <li>
            <code>${escapeHtml(item.id.replace('target-', '#'))}</code>
            <span>${escapeHtml(item.zh)}</span>
          </li>`).join('')}
      </ol>
    </article>`;
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

  cells.push('<div class="sub-corner subheader-cell">固定模型顺序</div>');
  for (const _game of data.games) {
    cells.push('<div class="subheader-cell">试玩与评分</div>');
    cells.push('<div class="subheader-cell unmet-subheader">中文未满足需求</div>');
  }

  for (const model of data.models) {
    cells.push(`
      <aside class="model-cell">
        <span class="model-index">${String(model.order).padStart(2, '0')}</span>
        <strong>${escapeHtml(model.label)}</strong>
        <small>${escapeHtml(model.provider)}</small>
      </aside>`);
    for (const game of data.games) {
      const result = data.results[game.id][model.id];
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
      playResult(data.results[gameId][modelId], game, model);
    });
  });
}

function renderStats(data) {
  const testCount = data.games.length * data.models.length;
  const best = Object.values(data.results)
    .flatMap((game) => Object.values(game))
    .sort((a, b) => b.score.base - a.score.base)[0];
  const values = [
    [data.models.length, '生成模型'],
    [data.games.length, '基准游戏'],
    [testCount, '完整评测'],
    [number.format(best.score.base), '最高基础分'],
  ];
  stats.innerHTML = values.map(([value, label]) => `<div><dt>${value}</dt><dd>${label}</dd></div>`).join('');
}

async function main() {
  try {
    const response = await fetch('data/results.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    renderStats(data);
    renderMatrix(data);
    updatedAt.textContent = `数据更新：${data.updatedAt}`;
  } catch (error) {
    matrixShell.innerHTML = `<div class="error-state">结果数据加载失败：${escapeHtml(error.message)}</div>`;
    updatedAt.textContent = '数据加载失败';
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

