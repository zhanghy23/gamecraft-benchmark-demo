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
  {
    id: 'radius-raid',
    titleZh: 'Radius Raid',
    typeZh: '俯视角射击',
    targetCount: 74,
    summaryZh: '生成一款可在 800×600 画框中直接游玩的太空俯视角射击游戏：包含完整菜单、暂停、关卡和结算流程，支持移动、自动或手动射击、多类敌人、道具增益、碰撞反馈、视差背景、小地图及持续更新的 HUD，并保证各类战斗状态和边界行为可被稳定触发与观察。',
  },
  {
    id: 'elematter',
    titleZh: 'Elematter',
    typeZh: '元素塔防',
    targetCount: 66,
    summaryZh: '生成一款完整的元素塔防游戏：玩家可在棋盘非路径格建造、选择、升级和出售土、水、风、火四类防御塔，控制暂停、倍速和提前发波；敌人及 Boss 按波次沿路径推进，并具备元素克制、减速、生命、资源、胜负结算和清晰 HUD 等可交互、可验证的状态。',
  },
  {
    id: 'highway-404',
    titleZh: 'Highway 404',
    typeZh: '公路赛车',
    targetCount: 51,
    summaryZh: '生成一款以 HTTP 状态码为主题的公路躲避赛车游戏：包含桌面与移动端的标题、操控、暂停和结算流程，角色可在滚动道路上转向、变道和收集茶壶，并与 103、200、301、404、418、429、501 等状态码事件及道路危险产生对应的视觉和玩法反馈。',
  },
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
    'target-001': '启动时应显示居中的 800×600 游戏画框，游戏区域裁切在深色边框容器内。',
    'target-002': '页面加载并完成初始化后，应显示带醒目“PLAY”按钮的主菜单。',
    'target-003': '主菜单应在深色太空背景上显示大型风格化游戏标题。',
    'target-004': '菜单画面背景应包含分层星空、细微网格、暗角与扫描线效果。',
    'target-005': '游戏画面背景应包含分层星空、细微网格、暗角与扫描线效果。',
    'target-006': '点击主菜单“PLAY”后，应进入可见游戏世界和玩家角色的正式游戏。',
    'target-007': '新游戏开始时，应在游戏画面上显示“LEVEL 01”关卡提示。',
    'target-008': '新游戏开始后的初始时段，应在画面上显示半透明操作说明。',
    'target-009': '游戏中触发暂停后，应显示居中的“PAUSED”暂停遮罩。',
    'target-010': '点击暂停页“RESUME”后，应关闭暂停遮罩并恢复游戏。',
    'target-011': '点击暂停页“MENU”后，应显示结束游戏并返回菜单的确认对话框。',
    'target-012': '确认从暂停页返回菜单后，应退出暂停游戏并重新显示主菜单。',
    'target-013': '按住向上移动时，英雄应加速并向上移动。',
    'target-014': '按住向下且未按向上时，英雄应加速并向下移动。',
    'target-016': '按住向右且未按向左时，英雄应加速并向右移动。',
    'target-017': '英雄到达世界右边界时，应被限制在可玩区域内。',
    'target-018': '游戏场景滚动时，相机应跟随英雄，背景各层以不同速度移动形成视差。',
    'target-019': '英雄靠近世界左边缘时，相机不应继续越过左侧边界滚动。',
    'target-020': '英雄正常显示时，应呈现为带圆形中心的小型多叉几何角色。',
    'target-021': '英雄受伤时，应以变化的灰度闪烁，并在游戏画面上显示半透明闪烁遮罩。',
    'target-022': '英雄仍有生命时，HUD 应显示 HEALTH 标签和按剩余生命比例填充的水平血条。',
    'target-023': '新关卡尚未击杀敌人时，PROGRESS 进度条应为空，SCORE 应显示补零后的零分。',
    'target-024': '已有击杀但未达到关卡要求时，PROGRESS 进度条应部分填充。',
    'target-026': '游戏中应显示带边框的深色小地图，并包含当前视口矩形和英雄位置点。',
    'target-027': '敌人在小地图范围内时，小地图应显示对应的彩色小点。',
    'target-029': '自动射击开启且武器冷却完成时，英雄应自动发射子弹。',
    'target-031': '三连发增益激活时开火，应同时以扇形发射三枚子弹。',
    'target-034': '活动中的玩家子弹应沿当前射击方向持续向前飞行。',
    'target-035': '玩家子弹在画面中时，应显示为短小明亮的线段或曳光。',
    'target-036': '非穿透子弹命中敌人时，应在碰撞处消失并显示命中特效粒子。',
    'target-038': '敌人出现在画面中时，应显示为彩色圆形目标。',
    'target-039': '水平移动敌人应沿直线横向穿过游戏区域。',
    'target-040': '斜向敌人应沿对角线路径穿过游戏区域。',
    'target-041': '直线追踪敌人应直接朝英雄移动。',
    'target-050': '敌人从世界顶部生成时，应出现在上边界外并向游戏区域内移动。',
    'target-052': '敌人受到非致命伤害时，应显示命中粒子和短暂闪烁，并在上方显示血条。',
    'target-053': '在本关击杀要求完成前消灭敌人时，敌人应消失并爆炸，HUD 分数增加且关卡进度推进。',
    'target-055': '敌人被消灭后生成道具时，应在原位置出现彩色方形可拾取道具。',
    'target-056': '道具出现在画面中时，应显示为带边框的深色方块，并标注名称或图标。',
    'target-059': '快速射击道具被英雄拾取后应消失，并激活 HUD 上的快速射击指示。',
    'target-062': '生命道具激活且英雄生命未满时，血条应逐渐恢复，同时生命道具指示保持激活。',
    'target-064': '道具计时器激活时，HUD 对应图标或文字应变亮，并显示白色倒计时条。',
    'target-065': '道具计时器未激活时，HUD 对应图标或文字应变暗，且不显示倒计时条。',
    'target-068': '英雄与敌人发生伤害碰撞且仍有生命时，应在英雄周围显示受伤特效并明显震动画面。',
    'target-069': '英雄生命耗尽并开始死亡爆炸时，应在其周围显示大型爆炸并强烈震动画面。',
    'target-071': '游戏结束画面应在冻结的游戏图像上显示大型红色“GAME OVER”标题。',
    'target-072': '游戏结束统计应显示 SCORE、LEVEL、KILLS、BULLETS、POWERUPS、TIME 及对应数值。',
    'target-073': '点击游戏结束页“PLAY AGAIN”后，应进入全新重置的游戏。',
    'target-074': '点击游戏结束页“MENU”后，应返回主菜单。',
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
    'target-001': '页面和游戏状态初始化完成后，应显示方形塔防棋盘、蜿蜒路径和 HUD 控件；建造与塔菜单隐藏，播放控件为未运行状态，波次显示 0 / 20，下一波预览为 11 个土系敌人。',
    'target-002': '首次点击播放且尚未开始波次时，HUD 应进入第一波、界面切换为运行状态，并开始在路径上生成敌人。',
    'target-003': '敌人移动时暂停游戏，敌人应停止移动，界面切换为未运行状态。',
    'target-005': '恢复暂停中的游戏后，敌人应继续移动，界面切换回运行状态。',
    'target-007': '较高速状态下选择 x1，x1 按钮应高亮，其他速度按钮取消高亮。',
    'target-009': '较低速状态下选择 x3，x3 按钮应高亮，其他速度按钮取消高亮。',
    'target-010': 'x3 速度下，活动敌人的移动速度应明显快于低速设置。',
    'target-013': '游戏运行且可获得提前发送奖励时点击发送波次，应增加元素碎片、发送下一波并推进波次 HUD。',
    'target-014': '最后一波已发送时，发送波次按钮应呈暗淡禁用状态。',
    'target-016': '活动波次的生成间隔到期且仍有敌人待部署时，应在路径起点生成下一个敌人。',
    'target-017': '发送第一波且第二波仍排队时，波次应显示 1 / 20，下一波预览应为 9 个土系和 2 个水系敌人。',
    'target-018': '发送第二波且第三波仍排队时，波次应显示 2 / 20，下一波预览应为 7 个土系、2 个水系和 2 个风系敌人。',
    'target-019': '发送第三波且第四波仍排队时，波次应显示 3 / 20，下一波预览应为 5 个土系、2 个水系、2 个风系和 2 个火系敌人。',
    'target-020': '悬停可建造的非路径格时，该格子应比普通地块明显变亮。',
    'target-022': '选择空的可建造格时，应在游戏区域上显示包含塔选择项的建造菜单。',
    'target-023': '关闭已打开的建造菜单后，菜单应从游戏区域中隐藏。',
    'target-026': '碎片足够时选择土塔，应关闭建造菜单、扣除碎片并在所选格生成绿色土塔。',
    'target-029': '碎片足够时选择火塔，应关闭建造菜单、扣除碎片并在所选格生成红色火塔。',
    'target-030': '碎片不足时选择土塔，不应生成土塔，建造菜单保持打开且碎片不减少。',
    'target-032': '选择已有土塔时，应显示带绿色土系高亮、属性信息和升级控件的塔菜单。',
    'target-035': '最高等级塔的菜单中，升级按钮应显示为禁用或已满级。',
    'target-047': '普通土系敌人部署后，应在路径上显示带绿色主体和血条样式的土系敌人。',
    'target-048': '普通水系敌人部署后，应在路径上显示带蓝色主体和血条样式的水系敌人。',
    'target-049': '普通风系敌人部署后，应在路径上显示带黄色主体和血条样式的风系敌人。',
    'target-050': '普通火系敌人部署后，应在路径上显示带红色主体和血条样式的火系敌人。',
    'target-055': '游戏运行且敌人位于两个路径点之间时，敌人应沿路径前进并朝当前移动方向转动。',
    'target-056': '敌人到达路径终点且剩余生命大于 1 时，敌人应消失、生命值减少，且不显示失败提示。',
    'target-057': '失去最后一点生命时，生命值应显示为零，随后弹出“You lost.”失败提示。',
    'target-064': '所有波次已发送且敌人全部清除时，应弹出以“You won!”开头并包含分数的胜利提示。',
    'target-065': '确认胜利提示后，页面应重新加载并回到初始游戏界面。',
    'target-066': '确认失败提示后，页面应重新加载并回到初始游戏界面。',
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

const nonVlmCauseLabels = {
  code_issue: '源码错误导致 Trace 不可达',
  skip_unmet: '源码分析确认未实现',
  replay_trace_issue: 'Replay / Trace 证据不足',
  excluded: '评测条件暂不支持',
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const results = {};
const requirementsByGame = {};
for (const game of games) {
  const sourceTargets = readJson(path.join(importRoot, 'targets', `${game.id}.json`));
  const targetList = Array.isArray(sourceTargets) ? sourceTargets : sourceTargets.targets;
  const knownIds = new Set(targetList.map((target) => target.targetId));
  if (targetList.length !== game.targetCount) {
    throw new Error(`${game.id}: expected ${game.targetCount} targets, found ${targetList.length}`);
  }
  requirementsByGame[game.id] = targetList.map((target) => {
    const zh = translations[game.id]?.[target.targetId];
    if (!zh) throw new Error(`${game.id}: missing Chinese translation for ${target.targetId}`);
    return { id: target.targetId, zh };
  });

  results[game.id] = {};
  for (const model of models) {
    const report = readJson(path.join(importRoot, 'reports', game.id, `${model.id}.json`));
    const failedIds = report.targets.failedTargetIds;
    const notVlmById = new Map(
      (report.targets.notVlmEvaluated ?? []).map((item) => [item.targetId, item]),
    );
    const vlmUnmet = [];
    const replayTraceUnmet = [];

    for (const id of failedIds) {
      if (!knownIds.has(id)) throw new Error(`${game.id}/${model.id}: unknown failed target ${id}`);
      const zh = translations[game.id]?.[id];
      if (!zh) throw new Error(`${game.id}/${model.id}: missing Chinese translation for ${id}`);
      const nonVlm = notVlmById.get(id);
      if (nonVlm) {
        replayTraceUnmet.push({
          id,
          zh,
          cause: nonVlmCauseLabels[nonVlm.status] ?? 'Replay / Trace 阶段未进入 VLM',
        });
      } else {
        vlmUnmet.push({ id, zh });
      }
    }

    if (vlmUnmet.length !== report.summary.vlmFailedTargets) {
      throw new Error(
        `${game.id}/${model.id}: expected ${report.summary.vlmFailedTargets} VLM failures, found ${vlmUnmet.length}`,
      );
    }
    if (vlmUnmet.length + replayTraceUnmet.length !== report.summary.failedTargets) {
      throw new Error(`${game.id}/${model.id}: unmet failure partition does not match report summary`);
    }

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
      unmet: {
        vlm: vlmUnmet,
        replayTrace: replayTraceUnmet,
      },
      issue: issueNotes[`${game.id}|${model.id}`] ?? null,
    };
  }
}

const publicData = {
  version: 3,
  updatedAt: '2026-08-16',
  models,
  games: games.map((game) => ({
    ...game,
    requirements: requirementsByGame[game.id],
  })),
  results,
};

const output = path.join(repoRoot, 'site', 'data', 'results.json');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(publicData, null, 2)}\n`);
console.log(`generated ${path.relative(repoRoot, output)} with ${games.length * models.length} results`);
