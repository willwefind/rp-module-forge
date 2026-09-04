# RP Module Forge / 天道降维互助论坛

**面向 AIRP 与文本 RP 的穿越者互助论坛 + 可移植辅助模块体系。**

[English（待简中术语冻结后同步）](README.en.md) · [🌐 当前模块工坊预览](https://willwefind.github.io/rp-module-forge/) · [🏮 Forum-first 概念原型](https://willwefind.github.io/rp-module-forge/prototypes/forum-first-concept-v0.html) · [📜 穿越者老乡维护组日志](docs/MAINTAINER_LOG.md)

> 【天道降维互助论坛 · 维护组公告】  
> 有位老乡又留下了一条血泪帖。  
> 有人回帖纠错，有人把事故整理成模块，有人负责把真正能复用的东西塞进【老乡遗言库】。  
> 后来的老乡可以围观、抄作业、拆模块，也可以继续把前人的坑填平。

## 产品本体是什么

**天道降维互助论坛是产品世界本体。**

它不是套在配置器外面的 lore 皮肤，而是真正承载主题、回复、血泪帖、勘误、模块发布、维护公告和可审核知识的数据与交互层。

`RP Module Forge` 是论坛维护组做出来的一件第一方工具：**模块工坊 / 装配器**。老乡在论坛里看到一个模块发布帖，可以查看模块附件，再用 Forge 按当前身份、发展路线、能力和专家镜头重新适配、装配与导出。

```text
天道降维互助论坛
├── 普通主题 / 回复 / 勘误 / 血泪帖
├── 模块发布主题
│   └── 模块附件
│       └── RP Module Forge 模块工坊
├── 老乡遗言库（审核后的可复用经验）
└── 维护组公告 / 维护记录
```

当前生产预览仍是我们已经实现的 canonical 模块工坊；forum-first 首页正在通过独立概念原型验证，确认信息架构后再正式重排 Web。

## 三套界面主题

Forum-first 产品固定支持三种阅读主题，并共用同一套语义 token：

- **日间｜纸白档案**：暖纸白、深墨、克制朱砂；
- **夜间｜夜档**：漆黑结构、暖暗阅读面、提亮朱砂；
- **护眼｜青笺**：灰绿低眩光纸面、墨绿黑文字、暗朱砂。

主题只改变呈现，不进入 RP 的 canonical manifest，也不改变任何权限、路线、可靠度或状态语义。

详见 [Theme System V0](docs/THEME_SYSTEM_V0.md)。

## 核心原则

- **不全知**：系统不能凭空获得当前世界隐藏事实；
- **身份决定当前权限**：能用一个分析工具，不代表自动有权拿到它想看的材料；
- **人生路线不是权限预付款**：奴婢想称帝仍然先按奴婢权限行动，皇帝想归隐也不会瞬间失去现有责任与风险；
- **专家只是认知镜头**：提供方法、问题、代价和盲点，不覆盖宿主人格；
- **论坛浏览属于 meta 层**：奴婢可以逛皇帝专区，但看帖子不等于本局能调户部账；
- **宿主最终裁决**：系统可以分析、比较、红队推演，不能替角色做不可逆决定；
- **Core 与世界包分离**：稳定能力 ID 属于通用 Core，世界包负责名称、内容、例子和审美；
- **开源维护进入世界观，但不取代工程事实**：lore 日志与 Git 记录并行存在。

## Forum-first 信息架构

建议主导航：

```text
首页 / 最新 / 精华 / 模块仓 / 老乡遗言库 / 维护组
```

中国古代包的主要分区可包括：

```text
天道公告
皇帝专区
官场与地方
军旅与边关
商贾与行旅
士林与文艺
普通人生
低权限求生
宫廷与家宅
世界包 / 模块开发
```

一个主题只有一个主要分区；身份、路线、能力、情境等横向信息用标签连接。

详见 [Forum-first Information Architecture V0](docs/FORUM_FIRST_INFORMATION_ARCHITECTURE_V0.md)。

## 一个模块发布帖会是什么样

模块仍然首先是一篇论坛帖子：有标题、作者留言、回复、勘误、版本、标签和维护历史。

例如：

> 【模块发布】  
> 【张居正和王阳明取长补短二合一皇帝身份开局专用辅助模块（第108次优化重置版）】  
> #政务 #知行合一 #账目核验 #党争 #防背刺

帖子下面挂一份结构化 **模块附件**：

- 原始适配身份与路线；
- 能力组合；
- 专家镜头；
- 论坛经验注入策略；
- 权限 / 风险说明；
- 版本与规范配置；
- “原样安装 / 按当前身份适配 / 只取部分能力 / 打开模块工坊”。

论坛讨论和模块附件共享同一份产品世界，不再拆成“社区”和“配置器”两套互不认识的 UI。

## 当前模块工坊的四层装配模型

现在已经实现的 Forge 把角色辅助拆成四个彼此独立的轴：

1. **Identity / 当前身份**：你现在是谁，以及当前权限边界；
2. **Identity Playbook / 身份处境方案**：同一批 Core 工具在这个身份手里应该怎么理解和使用；
3. **Agenda / 人生志向与发展路线**：你想往哪里走；
4. **Current Event / 当前事件**：未来 Runtime 用于临时激活专家和能力的即时层。

所以同一个皇帝可以走明君、铁腕、享乐、诗画或归隐；同一个奴婢也可以求生、入仕、从军、经商、宫斗、从艺甚至夺权称帝。路线改变推荐，不改变当前权限。

## 中国古代包的八个稳定能力

| 中国古代名称 | 通用 Core 能力 | 职责 |
| --- | --- | --- |
| 【考成台】 | `accountability-execution` | 追踪责任、承诺、拖延、甩锅路径与执行断点。 |
| 【知行镜】 | `claim-action-consistency` | 对比公开表态与可观察行动，识别言行差。 |
| 【鱼鳞算盘】 | `ledger-evidence-crosscheck` | 交叉核验财政、田亩、人口、仓储与贸易数据。 |
| 【朋党谱】 | `multiplex-relationship-graph` | 表达师生、姻亲、同乡、利益、理念、临时联盟与私怨等重叠关系。 |
| 【烽燧图】 | `readiness-logistics` | 区分名义规模、实际可调动能力、战斗力、补给、时间与路线约束。 |
| 【民声池】 | `plural-stakeholder-signals` | 保留互相冲突的群体声音和样本偏差。 |
| 【御前反对席】 | `red-team` | 从对手、执行层、市场或意外激励角度攻击方案。 |
| 【老乡遗言库】 | `curated-practitioner-knowledge` | 注入从论坛旧帖中审校、提炼出的可复用经验。 |

这些古代名称属于 world pack 的呈现。稳定 Core ID 继续保持语言和世界中立。

## 老乡论坛不是 AI 现场编的

Traveler Forum 已经有真实的仓库数据层：原帖、回复、可靠度、审核状态、来源、冲突关系和 curated note 都是正式对象。

- **论坛原帖层**：可以有偏见、争论、失败和馊主意；
- **老乡遗言库**：只有通过审核、可靠度和适用性筛选的条目才有资格自动进入 Runtime；
- **未来 AI 临场弹幕**：必须明确标成 session-only / synthetic，不能冒充历史贡献。

## 语言策略

V0.1 先把**简体中文产品面**做稳定。

繁体中文与英文等身份、路线、专家、论坛和运行术语稳定后，再从同一语义源同步。机器字段、稳定 ID 和 JSON key 不翻译。

详见 [Localization Strategy V0](docs/LOCALIZATION_STRATEGY_V0.md)。

## 仓库结构

```text
apps/web/                    当前 canonical 模块工坊实现
prototypes/                  历史与新信息架构概念原型
packages/core/               类型、校验、规范化、权限与 Prompt Engine
packages/pack-ancient-china/ 首个第一方 world pack + 论坛 seed
integrations/sillytavern/    规划中的第一方 Runtime 适配器
docs/                        产品、论坛、主题与系统规格
```

建议从这里读：

- [V0.1 产品定义](docs/PRODUCT_V0.md)
- [Forum-first 信息架构](docs/FORUM_FIRST_INFORMATION_ARCHITECTURE_V0.md)
- [三主题系统](docs/THEME_SYSTEM_V0.md)
- [V0.1 架构](docs/ARCHITECTURE.md)
- [中国古代包 V0.1](docs/ANCIENT_CHINA_PACK_V0.md)
- [Traveler Forum 规格](docs/TRAVELER_FORUM_SPEC.md)
- [Runtime System 规格](docs/RUNTIME_SYSTEM_SPEC.md)
- [维护组日志](docs/MAINTAINER_LOG.md)
- [当前实现状态](docs/CURRENT_IMPLEMENTATION_STATUS.md)
- [路线图](docs/ROADMAP.md)

## 本地开发

需要 Node.js 20+ 与 pnpm 10.15.0。

```bash
pnpm install
pnpm dev
```

验证：

```bash
pnpm typecheck
pnpm test
pnpm build
```

## 当前状态

**Public V0.1：正在锁定 forum-first 信息架构、canonical 契约与中国古代包体验。**

当前正式 Pages 首页仍是已实现的模块工坊；新的 forum-first shell 是独立概念原型，只有在桌面 / 手机、模块帖、维护日志、身份边界和三套主题都验证通过后才会取代现有首页。

## License

MIT
