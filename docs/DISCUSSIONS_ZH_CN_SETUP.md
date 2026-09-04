# GitHub Discussions 简中分类设置 V0

Status: **manual repository setup guide**  
Last updated: 2026-09-04

GitHub Discussions 已启用。下一步把默认英文分类整理成简中即可；GitHub 支持自定义分类标题、emoji、说明和讨论格式，也支持 section 分组。

## 建议分类

| Emoji | 分类名 | 格式 | 说明 |
| --- | --- | --- | --- |
| 📣 | 天道公告 | Announcement | 维护组公告、版本更新、重要迁移 |
| 💡 | 反馈与点子 | Open-ended | 产品反馈、Bug 体验、功能与 UI 想法 |
| 🎭 | RP 实战回报 | Open-ended | 开局复盘、血泪史、成功/失败案例 |
| 🧩 | 模块投稿 | Open-ended | 新模块、模块改版、兼容性发现 |
| 🌌 | 世界包提案 | Open-ended | 新世界域 / 世界包、身份、专家、内容提案 |
| 🧪 | 经验复现与勘误 | Open-ended | 对已有档案帖和经验的复现、反例与补充 |
| 🙋 | 求助与问答 | Q&A | 使用、贡献、开发和设计问题 |

可选 section 名：**📡 天道外部通信口**。

现阶段不要按“架空王朝 / 武侠 / 修仙 / 星际……”给真人社区各建一个分类。先用标题、表单字段和内容本身标世界；真实流量证明需要拆分时再拆。

## 手动设置路径

```text
仓库 → Discussions
→ 左侧 Categories 旁的编辑按钮
→ 新建 / 编辑分类
→ 设置 emoji、中文标题、中文说明、格式
```

公告类建议使用 Announcement；求助与问答使用 Q&A；其余先用 Open-ended。

## 下一步：Discussion forms

GitHub 支持在：

```text
.github/DISCUSSION_TEMPLATE/<category-slug>.yml
```

为分类配置结构化发帖表单。

分类中文名整理完后，先确认 GitHub 实际生成的 category slug，再提交对应 YAML；不要猜 slug。

建议共享字段：

- 关联世界域 / 世界包;
- RP 开局身份 / 路线（如适用）;
- 帖子类型;
- 是否愿意被整理进产品论坛;
- 署名方式：预设 / 自定义 / GitHub handle;
- 自定义署名;
- 是否允许保留原文措辞;
- 其他上下文.

真实 Discussion 始终是来源记录；表单不会自动把内容放进 【老乡经验库】。
