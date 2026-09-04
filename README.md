# RP Module Forge / 天道降维互助论坛

**面向 AIRP 与文本 RP 的穿越者互助论坛 + 可移植辅助模块体系。**

[English（待简中术语冻结后同步）](README.en.md) · [🏮 Forum-first V3 试玩版](https://willwefind.github.io/rp-module-forge/prototypes/forum-first-concept-v3.html) · [🌐 模块工坊](https://willwefind.github.io/rp-module-forge/) · [📡 天道外部通信口](https://github.com/willwefind/rp-module-forge/discussions) · [📜 维护组日志](docs/MAINTAINER_LOG.md)

> 【天道降维互助论坛 · 维护组公告】  
> 有位老乡又留下了一条血泪帖。  
> 有人回帖纠错，有人把事故整理成模块，有人负责把真正能复用的东西塞进【老乡经验库】。
> 后来的老乡可以围观、抄作业、拆模块，也可以从【天道外部通信口】进来真的说两句。

## 产品本体

**天道降维互助论坛是产品世界本体。**

`RP Module Forge` 是论坛维护组做出来的一件第一方工具：**模块工坊 / 装配器**。老乡在论坛里看到模块发布帖，可以查看模块附件，再用 Forge 按当前身份、发展路线、能力与专家镜头重新适配、装配和导出。

```text
天道降维互助论坛
├── 天道总坛
│   ├── 维护组 / 公告
│   ├── 世界包开发
│   └── 天道外部通信口（真实 GitHub Discussions）
├── 世界域 / Realm
│   └── 世界包 / World Pack
│       ├── 普通主题 / 回复 / 勘误 / 血泪帖
│       ├── 模块发布主题 + 模块附件
│       └── 老乡经验库
└── RP Module Forge 模块工坊
```

## 世界不会只剩一个“古代”

论坛采用三级世界导航：

```text
天道总坛
└── 世界域
    └── 世界包
        └── 分区
```

第一条正式开放路径现在是：

```text
东方古代
└── 架空王朝   ← 当前首个 World Pack
```

未来同一个 **东方古代** Realm 下，`武侠江湖`、`修仙宗门`、`志怪异闻` 都应该是独立 World Pack，而不是硬塞进架空王朝的标签。它们可以共享文化亲缘，却不默认共享身份、权限、资源结构或专家体系。

其他未来 Realm 可以包括：

- 西方幻想;
- 未来科幻;
- 工业幻想;
- 原始世界;
- 以及以后真正有需要时再开的其他世界族群。

未开放就保持未开放，不为了显得热闹而提前伪造整个宇宙。

详见 [Multiworld Forum Architecture V0](docs/MULTIWORLD_FORUM_ARCHITECTURE_V0.md)。

## 第一世界包：架空王朝

当前第一方 Pack 的**产品显示名**是：

**东方古代 → 架空王朝**

当前仓库仍保留历史工程命名：

```text
packages/pack-ancient-china/
worldPack.id = ancient-china
permission profiles = ancient-china:...
```

这是暂时的机器兼容状态，不是现行产品牌匾。

主 canonical pack 的 UI label 已经覆盖成 **架空王朝适配包**。未来如果要迁移稳定 ID，会单独写 migration，把 manifest、permission profile、forum data 和旧导入一起迁，不在 UI 改名时偷偷换户籍。

详见 [架空王朝 Pack V0.1](docs/FICTIONAL_DYNASTY_PACK_V0.md)。

## 三套界面主题

Forum-first 产品固定支持：

- **日间｜纸白档案**：暖纸白、深墨、克制朱砂；
- **夜间｜夜档**：漆黑结构、暖暗阅读面、提亮朱砂；
- **护眼｜青笺**：灰绿低眩光纸面、墨绿黑文字、暗朱砂。

主题只改变呈现，不进入 canonical manifest，也不改变权限、路线、可靠度或状态语义。

详见 [Theme System V0](docs/THEME_SYSTEM_V0.md)。

## 论坛里的老乡不是一种人

论坛作者允许欢快、惊恐、迷茫、刻薄、温柔、野心勃勃、学究、话痨、惜字如金，也允许帖子写到一半就再也没有回来。

语气和可靠度分开：一个笑得满地打滚的帖子可能是救命经验，一篇写得像论文的帖子也可能错得很完整。

详见 [Forum Authoring Style V0](docs/FORUM_AUTHORING_STYLE_V0.md)。

## 天道外部通信口：真人老乡已经能进来了

GitHub Discussions 已启用：

**[进入天道外部通信口 → GitHub Discussions](https://github.com/willwefind/rp-module-forge/discussions)**

这里用于真实的人：反馈 Bug、分享 RP 实战、投稿模块、提议新世界包、提问题。

但现实社区和世界观档案不会互相冒充：

```text
真实 Discussion
→ 确认来源 / 署名方式 / 授权
→ 维护组 review
→ 可选进入论坛档案
→ 如果确有可复用知识，再单独 review
→ 老乡经验库
```

真人贡献可以选择 GitHub handle、Lore alias 或匿名老乡编号。不会擅自把现实账号变成世界观角色。

详见 [Community Bridge V0](docs/COMMUNITY_BRIDGE_V0.md)。

## 核心原则

- **不全知**：系统不能凭空获得当前世界隐藏事实；
- **身份决定当前权限**：能用分析工具，不代表有权拿到它想看的材料；
- **人生路线不是权限预付款**：奴婢想称帝仍先按奴婢权限行动；
- **专家只是认知镜头**：提供方法和盲点，不覆盖宿主人格；
- **论坛浏览属于 meta 层**：奴婢可以逛皇帝专区，但看帖不等于能调户部账；
- **宿主最终裁决**：系统可以分析和红队推演，不能替角色做不可逆决定；
- **Core 与世界包分离**：稳定能力 ID 属于通用 Core，Pack 负责名称、内容、例子和审美；
- **开源维护进入世界观，但不取代工程事实**；
- **真人社区内容不会自动成为 Runtime 真理**；
- **能免费解决的阶段不先养服务器**。

## 当前模块工坊的四层装配模型

1. **Identity / 当前身份**：你现在是谁，以及当前权限边界；
2. **Identity Playbook / 身份处境方案**：同一批 Core 工具在这个身份手里怎么理解和使用；
3. **Agenda / 人生志向与发展路线**：你想往哪里走；
4. **Current Event / 当前事件**：未来 Runtime 临时激活专家和能力的即时层。

所以皇帝可以走明君、铁腕、享乐、诗画或归隐；奴婢也可以求生、入仕、从军、经商、宫斗、从艺甚至夺权称帝。路线改变推荐，不改变当前权限。

## 架空王朝当前八个稳定能力

| 架空王朝名称 | Core ID |
| --- | --- |
| 【考成台】 | `accountability-execution` |
| 【知行镜】 | `claim-action-consistency` |
| 【鱼鳞算盘】 | `ledger-evidence-crosscheck` |
| 【朋党谱】 | `multiplex-relationship-graph` |
| 【烽燧图】 | `readiness-logistics` |
| 【民声池】 | `plural-stakeholder-signals` |
| 【御前反对席】 | `red-team` |
| 【老乡经验库】 | `curated-practitioner-knowledge` |

这些名称属于架空王朝 Pack 的呈现。其他 World Pack 可以给同一个 Core 完全不同的名字和用法。

## 老乡论坛不是 AIRP 时现编的

Traveler Forum 已有正式仓库数据层：原帖、回复、可靠度、审核状态、来源、冲突关系和 curated note 都是对象。

- **论坛原帖层**：允许偏见、争论、失败和馊主意；
- **老乡经验库**：只有通过审核和适用性筛选的条目才可能自动进入 Runtime；
- **未来 AI 临场弹幕**：必须明确标成 session-only / synthetic，不能冒充历史贡献；
- **真人 Discussion**：必须经过授权和 review 才能进入仓库论坛数据。

## 语言策略

V0.1 先把**简体中文产品面**做稳定。繁中与英文等术语稳定后从同一语义源同步。机器字段、稳定 ID 和 JSON key 不翻译。

## 仓库结构

```text
apps/web/                    当前 canonical 模块工坊实现
prototypes/                  forum-first 与历史概念原型
packages/core/               类型、校验、规范化、权限与 Prompt Engine
packages/pack-ancient-china/ 架空王朝首包的当前历史工程路径
integrations/sillytavern/    规划中的第一方 Runtime 适配器
docs/                        产品、论坛、主题与系统规格
```

建议从这里读：

- [V0.1 产品定义](docs/PRODUCT_V0.md)
- [多世界论坛架构](docs/MULTIWORLD_FORUM_ARCHITECTURE_V0.md)
- [Forum-first 信息架构](docs/FORUM_FIRST_INFORMATION_ARCHITECTURE_V0.md)
- [架空王朝 Pack V0.1](docs/FICTIONAL_DYNASTY_PACK_V0.md)
- [真人社区桥](docs/COMMUNITY_BRIDGE_V0.md)
- [论坛作者风格](docs/FORUM_AUTHORING_STYLE_V0.md)
- [三主题系统](docs/THEME_SYSTEM_V0.md)
- [V0.1 架构](docs/ARCHITECTURE.md)
- [Traveler Forum 规格](docs/TRAVELER_FORUM_SPEC.md)
- [Runtime System 规格](docs/RUNTIME_SYSTEM_SPEC.md)
- [维护组日志](docs/MAINTAINER_LOG.md)

## 当前状态

**Public V0.1：正在锁定 forum-first 信息架构、世界域 / 世界包分类、canonical 契约与架空王朝首包体验。**

当前 Pages 根路径仍是模块工坊；[Forum-first V3 试玩版](https://willwefind.github.io/rp-module-forge/prototypes/forum-first-concept-v3.html) 已可直接审看：站内七分类发帖入口、本地多档案管理、22 篇独立档案与 82 条收录回复、正文和楼层搜索、日间 / 夜间 / 护眼配色。工坊与论坛有双向入口。

真人交流在 GitHub Discussions，当前没有导入真人投稿或同步实时互动数。模块仍需在工坊手动配置，未开放世界包只接受提案。详见 [V3 试玩验收与维护说明](docs/FORUM_V3_REVIEW.md)。

## License

MIT
