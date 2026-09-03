# RP Module Forge

**面向 AIRP 与文本 RP 的可视化辅助系统装配器：可移植、不全知、由身份权限约束。**

[English](README.en.md) · [🌐 在线预览](https://willwefind.github.io/rp-module-forge/) · [📜 穿越者老乡维护组日志](docs/MAINTAINER_LOG.md) · [产品定义](docs/PRODUCT_V0.md) · [架构](docs/ARCHITECTURE.md) · [中国古代包](docs/ANCIENT_CHINA_PACK_V0.md)

RP Module Forge 用一组可复用部件，为一场 RP 装配“世界内辅助系统”：

> 【天道降维互助论坛 · 维护组公告】
> 有位老乡提交了一条新的血泪批注。
> 本次事故已被整理成可复用模块，愿后来者不必再踩同一个坑。

这不是单纯的 lore 彩蛋：**开源协作本身就是项目世界观的一部分。** 现实中的 issue、PR、review 与修复，可以在产品里对应成老乡提问、回帖、勘误和维护记录；工程事实仍然保留标准 Git 记录。

- **世界包**：提供符合设定的内容、命名与呈现；
- **身份与权限档案**：限制宿主能够知道、接触和执行的事；
- **能力模块**：负责证据、后勤、关系、红队推演等不同任务；
- **专家认知镜头**：提供思考方法，不覆盖角色人格；
- **Traveler Forum / 老乡论坛层**：保存经验、争论、失败记录与整理后的知识；
- **Runtime 规则**：告诉外部模型何时、如何调用已启用的系统。

Web App 是产品本体。**Ancient China / 中国古代**是首个官方 world pack，**SillyTavern** 是首个第一方 Runtime 集成方向。

> 核心原则：系统不全知。它可以整理证据、发现矛盾、指出缺失信息并推演后果；它不能凭空知道当前世界的隐秘事实、私人关系、暗账或真实动机。

## 它是什么，也不是什么

RP Module Forge 不只是角色卡生成器或漂亮 Prompt 生成器。一份 canonical config（规范配置）同时描述宿主身份、权限、已启用能力、专家镜头、论坛策略、运行行为与本局补丁，再由同一套 Prompt Engine 输出不同格式。

系统不会接管宿主。专家不是附身、人格扮演或角色覆盖，而是可开启、可比较、可撤回的认知镜头。系统提供建议和推演，最终裁决始终属于宿主。

V0.1 阶段，Web App 负责装配规则并导出给外部 RP 客户端或模型使用。它不自动读取私人聊天，不中转 API Key，不代理模型请求，也不内置模型服务。

## 产品模型

```text
世界包
  + 身份 / 权限档案
  + 能力模块
  + 专家认知镜头
  + 老乡论坛策略
  + Runtime 规则
  + 本局补丁
             ↓
        Canonical Config
             ↓
         Prompt Engine
      ↙       ↓       ↘
  一句话版   Prompt   Manifest
```

所有产品入口必须复用同一套 core。集成层只消费 canonical config 与 Prompt Engine，不另造一套长期分叉的规则。

## 首个 world pack：中国古代

Ancient China Pack 将八个跨世界通用能力包装成世界内系统：

| 中国古代名称 | 通用 Core 能力 | 职责 |
| --- | --- | --- |
| 【考成台】 | Accountability & Execution | 追踪责任、承诺、拖延、甩锅路径与执行断点。 |
| 【知行镜】 | Claim–Action Consistency | 对比公开表态与可观察行动，识别言行差。 |
| 【鱼鳞算盘】 | Ledger & Evidence Cross-check | 交叉核验财政、田亩、人口、仓储与贸易数据。 |
| 【朋党谱】 | Multiplex Relationship Graph | 表达师生、姻亲、同乡、利益、理念、临时联盟与私怨等重叠关系，而不是一个“党派值”。 |
| 【烽燧图】 | Readiness & Logistics | 区分名义规模、实际可调动能力、战斗力、补给、时间与路线约束。 |
| 【民声池】 | Plural Stakeholder Signals | 保留互相冲突的群体声音和样本偏差，不生成虚假的“总民心值”。 |
| 【御前反对席】 | Red Team Engine | 从对手、执行层、市场或意外激励的角度攻击方案。 |
| 【老乡遗言库】 | Curated Practitioner Knowledge | 注入从 Traveler Forum 旧帖中审校、提炼出的可复用经验。 |

这些古代名称属于 world pack 的显示与 lore。底层能力契约属于通用 core，未来的欧洲、修仙、星际等世界包可以为同一能力提供完全不同的名称、例子和视觉语言。

## Traveler Forum / 老乡论坛层

老乡论坛是正式子系统，不是随机吐槽生成器。它包含两层：

1. **论坛原帖层**：保留口吻、争论、回复链、失败过程与来源。
2. **整理知识层**：把通过审校的经验压缩为稳定、可复用、适合 Prompt 注入的知识条目；在 Ancient China Pack 中，它以【老乡遗言库】呈现于**天道降维互助论坛**。

开源协作本身也进入世界观：现实中的一次贡献，可以在产品里显示为“有位老乡提交了一条新的血泪批注”。但 lore 不能替代标准 Git 记录、代码审查、归属说明和工程变更信息。

详见 [Traveler Forum 规格](docs/TRAVELER_FORUM_SPEC.md)。

## 四种输出

所有输出都来自同一份 canonical config：

1. **一句话调用版**：当前会话已经了解系统时使用的最短提醒。
2. **简版注入 Prompt**：包含身份权限、启用模块、证据规则和裁决边界。
3. **完整设定 + 注入 Prompt**：包含 lore、运行协议、模块契约、禁止行为与本局补丁。
4. **Manifest**：供 Web App 与集成层导入、导出和迁移的机器可读配置。

## 仓库结构

```text
apps/web/                    Web 可视化装配台（主产品）
packages/core/               类型、校验、规范化与 Prompt Engine
packages/pack-ancient-china/ 首个第一方 world pack
integrations/sillytavern/    规划中的第一方 Runtime 适配器
docs/                        产品与系统规格
```

建议按以下顺序阅读：

- [V0.1 产品定义](docs/PRODUCT_V0.md)
- [V0.1 架构](docs/ARCHITECTURE.md)
- [中国古代包 V0.1](docs/ANCIENT_CHINA_PACK_V0.md)
- [Traveler Forum 规格](docs/TRAVELER_FORUM_SPEC.md)
- [Runtime System 规格](docs/RUNTIME_SYSTEM_SPEC.md)
- [Prompt 输出规格](docs/PROMPT_OUTPUT_SPEC.md)
- [维护组日志](docs/MAINTAINER_LOG.md)
- [当前实现状态](docs/CURRENT_IMPLEMENTATION_STATUS.md)
- [路线图](docs/ROADMAP.md)

## 本地开发

需要 Node.js 20+ 与 pnpm 10.15.0。

```bash
pnpm install
pnpm dev
```

如果 Windows PowerShell 的脚本执行策略拦截 `pnpm.ps1`，直接使用 `.cmd`：

```powershell
pnpm.cmd install
pnpm.cmd dev
```

验证：

```bash
pnpm typecheck
pnpm build
```

## 当前状态

**Public V0.1：正在锁定架构与数据契约。**

仓库目前包含早期 Web App 与共享包骨架。本文档描述的是 V0.1 目标契约；一项能力只有在代码和验证中出现后，才应被视作已经实现。

## 参与维护

贡献可以增加身份、能力、专家镜头、老乡论坛内容、Runtime 行为或新的 world pack，但必须保留：

- 不全知与明确的不确定性；
- 身份决定权限；
- 专家只提供认知镜头；
- 宿主最终裁决；
- 通用 core 与世界包命名/呈现分离；
- lore 日志与标准工程事实同时存在、互不替代。

当前协作流程见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## License

MIT
