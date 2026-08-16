import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const importRoot = path.join(repoRoot, '.import');

const models = [
  { id: 'gpt-5.5', label: 'GPT-5.5', provider: 'OpenAI', order: 1 },
  { id: 'seed-2.0-pro', label: 'Seed-2.0-Pro', provider: 'ByteDance', order: 2 },
  { id: 'minimax-m2.7', label: 'MiniMax-M2.7', provider: 'MiniMax', order: 3 },
  { id: 'gpt-5.4', label: 'GPT-5.4', provider: 'OpenAI', order: 4 },
];

const games = [
  { id: 'radius-raid', titleZh: 'Radius Raid', typeZh: '俯视角射击', targetCount: 74 },
  { id: 'elematter', titleZh: 'Elematter', typeZh: '元素塔防', targetCount: 66 },
  { id: 'highway-404', titleZh: 'Highway 404', typeZh: '公路赛车', targetCount: 51 },
];

const translations = {
  'radius-raid': {
    'target-015': '按住向左移动时，英雄应加速并向左移动。',
    'target-025': '击杀进度达到关卡要求时，等级进度条应完全填满。',
    'target-028': '玩家子弹位于小地图范围内时，小地图应显示微小的子弹标记。',
    'target-030': '关闭自动射击且按住开火键、武器冷却完成时，英雄应发射子弹。',
    'target-032': '快速射击增益期间开火时，子弹应变色且射速明显提升。',
    'target-033': '穿透射击增益期间开火时，子弹应使用穿透增益配色。',
    'target-037': '穿透子弹未达到命中上限时，击中敌人后应继续飞行并显示命中特效。',
    'target-042': '游荡敌人应在场地内改变方向，而不是始终沿固定直线移动。',
    'target-043': '隐身敌人移动时应呈半透明、难以辨认的视觉效果。',
    'target-044': '大型慢速敌人应明显更大，并以较慢速度移动。',
    'target-045': '小型高速敌人应体型更小，并以较快速度移动。',
    'target-046': '成长型敌人接近英雄时，体型应持续变大。',
    'target-047': '环绕型敌人应沿曲线路径绕英雄移动并逐渐接近。',
    'target-048': '快速随机方向敌人应沿随机直线高速移动，而不是追踪英雄。',
    'target-049': '摆动追踪敌人应沿左右摇摆的路径接近英雄。',
    'target-051': '可生成敌人的计时器达到阈值时，应在其附近生成新敌人。',
    'target-054': '可分裂敌人被消灭时，应在原位置周围生成四个小敌人。',
    'target-057': '生命道具被英雄拾取后应消失，并激活 HUD 上的生命指示。',
    'target-058': '减速敌人道具被拾取后应消失、激活 HUD，并显示淡蓝色遮罩。',
    'target-060': '三连发道具被英雄拾取后应消失，并激活 HUD 上的三连发指示。',
    'target-061': '穿透射击道具被英雄拾取后应消失，并激活 HUD 上的穿透指示。',
    'target-063': '减速效果激活时，敌人应覆盖半透明蓝色效果并降低移动速度。',
    'target-066': '尚有预设关卡且击杀数达标时，应显示进入下一关的升级提示。',
    'target-067': '达到最后一个预设关卡后再次完成击杀要求时，应继续显示更高等级提示。',
    'target-070': '英雄死亡延迟结束后，应显示含“重新开始”和“菜单”按钮的游戏结束画面。',
  },
  elematter: {
    'target-004': '暂停游戏时，移动中的投射物应停止，界面应切换到暂停状态。',
    'target-006': '恢复游戏时，暂停的投射物应继续移动，界面应回到游戏状态。',
    'target-008': '选择 x2 速度时，x2 按钮应高亮，其他速度按钮应取消高亮。',
    'target-011': 'x3 速度下，活动投射物应明显快于低速设置。',
    'target-012': '暂停状态点击发送波次时，不应开始新波次、推进 HUD 或生成敌人。',
    'target-015': '清空当前波且仍有排队波次时，应自动开始下一波。',
    'target-021': '点击不可建造的路径格时，不应弹出建造菜单或改变棋盘。',
    'target-024': '碎片不足时，土塔建造选项应呈禁用或淡化状态。',
    'target-025': '悬停土塔建造选项时，信息面板应显示土塔主题、详情与属性。',
    'target-027': '资金足够时选择水塔，应扣除碎片并在所选格子生成蓝色水塔。',
    'target-028': '资金足够时选择风塔，应扣除碎片并在所选格子生成黄色风塔。',
    'target-031': '悬停未选中的塔时，应显示圆形攻击范围。',
    'target-033': '关闭塔菜单时，菜单和塔的选中高亮都应消失。',
    'target-034': '塔当前不可升级时，升级按钮应呈禁用或淡化状态。',
    'target-036': '悬停升级按钮时，应显示下一等级、升级费用与属性预览。',
    'target-037': '塔变得可升级时，应在地图上显示可升级高亮。',
    'target-038': '塔不再可升级时，应移除地图上的可升级高亮。',
    'target-039': '升级可支付的土塔后，应扣除碎片并显示提升后的等级与属性。',
    'target-040': '点击当前不可升级的塔时，不应升级或扣除碎片，菜单应保持不变。',
    'target-041': '出售土塔后，菜单应关闭、碎片应增加，土塔应从格子中消失。',
    'target-042': '塔锁定射程内敌人时，应朝向目标并显示脉冲或瞄准动画。',
    'target-043': '土塔射程内有敌人且冷却完成时，应发射绿色土系投射物。',
    'target-044': '水塔射程内有敌人且冷却完成时，应发射蓝色水系投射物。',
    'target-045': '风塔射程内有敌人且冷却完成时，应发射黄色风系投射物。',
    'target-046': '火塔射程内有敌人且冷却完成时，应发射红色火系投射物。',
    'target-051': '部署土系 Boss 时，路径上应出现大型绿色土系 Boss 造型。',
    'target-052': '部署水系 Boss 时，路径上应出现大型蓝色水系 Boss 造型。',
    'target-053': '部署风系 Boss 时，路径上应出现大型黄色风系 Boss 造型。',
    'target-054': '部署火系 Boss 时，路径上应出现大型红色火系 Boss 造型。',
    'target-058': '非致命投射物命中时，敌人应显示受击反馈且血条缩短。',
    'target-059': '属性克制的投射物命中时，应显示受击反馈且血条大幅下降。',
    'target-060': '水系投射物施加减速后，敌人应显示减速样式并短暂变慢。',
    'target-061': '减速结束后，应移除蓝色透明样式，并恢复正常移动速度。',
    'target-062': '普通敌人生命归零后，应从路径消失并增加元素碎片。',
    'target-063': 'Boss 生命归零后，应从路径消失并增加元素碎片。',
  },
  'highway-404': {
    'target-001': '游戏启动后应显示高速公路主题标题页、角色、路边元素及指定标题文字。',
    'target-002': '桌面标题页应显示以“to steer”结尾的键盘操控说明。',
    'target-003': '移动端标题页应显示“swipe to steer”操控说明。',
    'target-004': '标题页收到开始游戏的键盘松开事件后，应进入正式游戏画面。',
    'target-005': '标题页收到触摸或指针松开事件后，应进入正式游戏画面。',
    'target-006': '关卡起点应显示分车道公路物体，并在起始区域放置茶壶收集物。',
    'target-007': '正常游戏时 HUD 应同时显示分数、倒计时和茶壶数量。',
    'target-008': '游戏循环运行时，公路应持续滚动，HUD 倒计时应持续减少。',
    'target-009': '按向上操控键时，玩家角色应向上移动。',
    'target-010': '按向下操控键时，玩家角色应向下移动。',
    'target-011': '按向左操控键时，玩家角色应向左移动。',
    'target-012': '按向右操控键时，玩家角色应向右移动。',
    'target-013': '同时处于向上和向左移动状态时，角色应斜向左上方移动。',
    'target-014': '角色向右移动时，精灵应明显向右转方向倾斜。',
    'target-015': '角色向左移动时，精灵应明显向左转方向倾斜。',
    'target-016': '游戏运行时按暂停键，应冻结公路滚动、动画和倒计时。',
    'target-017': '游戏暂停时再次按暂停键，应恢复公路滚动、动画和倒计时。',
    'target-018': '角色试图越过左侧路肩时，应被限制在可驾驶道路内。',
    'target-019': '角色试图越过视口顶部时，应被限制在可见游戏区域内。',
    'target-020': '角色越过横向相机窗口左侧且仍可滚动时，相机应向左移动跟随。',
    'target-021': '103 状态码物体出现在视口中时，应显示可见文字“103”。',
    'target-022': '200 状态码物体出现在视口中时，应显示可见文字“200”。',
    'target-023': '301 状态码物体出现在视口中时，应显示可见文字“301”。',
    'target-024': '302 状态码物体出现在视口中时，应显示可见文字“302”。',
    'target-025': '404 状态码物体出现在视口中时，应显示可见文字“404”。',
    'target-026': '418 茶壶状态码物体出现在视口中时，应显示可见文字“418”。',
    'target-027': '429 状态码物体出现在视口中时，应显示可见文字“429”。',
    'target-028': '501 状态码物体出现在视口中时，应显示可见文字“501”。',
    'target-029': '503 状态码物体出现在视口中时，应显示可见文字“503”。',
    'target-030': '角色碰撞未触发的 103 提示物体时，应在画面中央显示提示信息。',
    'target-031': '角色碰撞未触发的 301 变道物体时，应自动横向滑入另一车道。',
    'target-032': '自动变道结束后，角色应停止横移并在新车道恢复直立。',
    'target-033': '角色碰撞未触发的 404 物体时，应在附近生成坠落道路危险。',
    'target-034': '坠落道路生成器达到间隔时，应在公路车道生成新的道路危险。',
    'target-035': '新道路危险与 200 安全道路重叠时，不应在该位置生成危险。',
    'target-036': '角色与早期帧道路危险重叠时，应呈现掉入道路的缩小效果。',
    'target-037': '角色与后期帧道路危险重叠时，应开始旋转并缩小的死亡动画。',
    'target-038': '角色碰撞缺失道路缝隙时，应旋转缩小并掉入缝隙。',
    'target-039': '死亡角色缩小到零后，应消失并进入失败结算页。',
    'target-040': '加载带正缺失道路长度的 501 物体时，应在车道中生成连续道路缺口。',
    'target-041': '角色碰撞未触发的 418 茶壶物体时，HUD 茶壶计数应增加。',
    'target-042': '角色碰撞未触发的 429 限速物体时，应显示秒数倒计时并降低滚动速度。',
    'target-043': '限速效果结束时，倒计时应消失，公路滚动应恢复正常速度。',
    'target-044': '游戏达到胜利状态时，应切换到带重新开始提示的结算页。',
    'target-045': '胜利结算页应显示“you arrived!”、分数和最高分。',
    'target-046': '失败结算页应显示“you got lost!”、分数和最高分。',
    'target-047': '桌面端结算页应显示“[space] to restart”提示。',
    'target-048': '移动端结算页应显示“tap to restart”提示。',
    'target-049': '结算页收到返回标题页的键盘输入后，应回到标题页而不是直接重开。',
    'target-050': '结算页收到触摸或指针松开事件后，应回到标题页。',
    'target-051': '最终画面应以模糊全屏背景承托清晰的中央游戏带，并在上层清晰绘制文字。',
  },
};

const issueNotes = {
  'highway-404|minimax-m2.7': '生成源码存在 shoulderWidth 未定义错误，游戏会在运行时中断；0 分来自源码问题而非评审转码。',
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const results = {};
for (const game of games) {
  const sourceTargets = readJson(path.join(importRoot, 'targets', `${game.id}.json`));
  const targetList = Array.isArray(sourceTargets) ? sourceTargets : sourceTargets.targets;
  const knownIds = new Set(targetList.map((target) => target.targetId));
  if (targetList.length !== game.targetCount) {
    throw new Error(`${game.id}: expected ${game.targetCount} targets, found ${targetList.length}`);
  }

  results[game.id] = {};
  for (const model of models) {
    const report = readJson(path.join(importRoot, 'reports', game.id, `${model.id}.json`));
    const failedIds = report.targets.failedTargetIds;
    const unmet = failedIds.map((id) => {
      if (!knownIds.has(id)) throw new Error(`${game.id}/${model.id}: unknown failed target ${id}`);
      const zh = translations[game.id]?.[id];
      if (!zh) throw new Error(`${game.id}/${model.id}: missing Chinese translation for ${id}`);
      return { id, zh };
    });

    results[game.id][model.id] = {
      score: {
        display: report.score.display,
        base: report.score.base,
        passed: report.score.passed,
        denominator: report.score.denominator,
        dynamic: report.score.dynamic,
        dynamicAddition: report.score.dynamicAddition,
        potential: report.score.potential,
      },
      traceCount: report.videos.length,
      playPath: `games/${game.id}/${model.id}/index.html`,
      previewPath: `previews/${game.id}/${model.id}.png`,
      unmet,
      issue: issueNotes[`${game.id}|${model.id}`] ?? null,
    };
  }
}

const publicData = {
  version: 1,
  updatedAt: '2026-08-16',
  models,
  games,
  results,
};

const output = path.join(repoRoot, 'site', 'data', 'results.json');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(publicData, null, 2)}\n`);
console.log(`generated ${path.relative(repoRoot, output)} with ${games.length * models.length} results`);

