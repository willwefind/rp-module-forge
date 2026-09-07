# R2 · 发布门禁（validate → build → deploy）

状态：**本地补丁已就绪，尚未在 GitHub 上生效。** 本次实施使用的 GitHub 连接没有修改 workflow 文件的权限（推送含 `.github/workflows/*` 的批次返回 403），因此这两个文件只能由仓库维护者从本机推送。下面是精确的剩余动作。

## 改了什么

`.github/workflows/ci.yml`

- 触发改为 `pull_request` + `workflow_call` + `workflow_dispatch`；不再单独监听 `push: main`（避免同一 SHA 跑两遍相同检查）。
- `validate` 作业内容不变：`pnpm install --frozen-lockfile` → `pnpm typecheck` → `pnpm test` → `pnpm build`，Node 20。

`.github/workflows/pages.yml`

- 新增 `validate` 作业：`uses: ./.github/workflows/ci.yml`（复用同一份验证，不依赖“最近一次绿色 CI”）。
- `build` 增加 `needs: validate`；`deploy` 保持 `needs: build`。同一个 SHA 必须先通过验证，才构建 Pages 产物，才部署。
- `workflow_dispatch` 走同一条链，手动发布不绕过验证。
- 保留 `github-pages` environment、最小权限（`contents: read`、`pages: write`、`id-token: write`）、`concurrency` 取消进行中、`--base=/rp-module-forge/` 与 `prototypes/` 递归复制。
- `actions/checkout` 统一为 v4；Node / pnpm 版本未变。

## 维护者要做的（在本机终端，交互式登录可用）

```bash
git fetch origin
git checkout a2-release-gate
git push -u origin a2-release-gate
```

然后在 GitHub 上从 `a2-release-gate` 向 `main` 开 PR（标题建议 `ci: gate Pages deployment on the same-commit validation`），等 PR 上的 `validate` 绿后 squash 合并。合并后 main 上应当只出现一条 `Deploy Web App to GitHub Pages` 运行，里面依次是 `validate / validate`、`build`、`deploy` 三个作业。

## 验收（合并后核对）

- [ ] main 的 Pages 运行里 `build` 的 `needs` 指向 `validate`，`deploy` 的 `needs` 指向 `build`（Actions 页面的作业图可见）。
- [ ] 验证 SHA、构建 SHA、部署产物 SHA 相同（同一次运行）。
- [ ] PR 只运行 `CI / validate`，不出现部署作业。
- [ ] `workflow_dispatch` 手动触发时同样先跑 `validate`。
- [ ] 根路径论坛、`/forge/`、`/prototypes/forum-first-concept-v3.html` 部署后仍可达。
- [ ] 失败路径不向 main 注入故障验证；以作业依赖关系为证据。若需要隔离证明，可在个人 fork 上故意让一个测试失败并观察 `build` / `deploy` 被跳过。
