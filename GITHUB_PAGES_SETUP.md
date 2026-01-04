# GitHub Pages 双版本部署说明

现在项目有两个版本：

## 版本 1：自定义域名版本（main 分支）
- **分支**：`main`
- **访问地址**：`https://fengdedemo.online`
- **配置**：
  - `base: '/'` (vite.config.ts)
  - 包含 `public/CNAME` 文件
  - 使用 `.github/workflows/deploy.yml`

## 版本 2：GitHub Pages 默认域名版本（github-pages-default 分支）
- **分支**：`github-pages-default`
- **访问地址**：`https://fenglir002-lang.github.io/wsmdemo/`
- **配置**：
  - `base: '/wsmdemo/'` (vite.config.ts)
  - 不包含 CNAME 文件
  - 使用 `.github/workflows/deploy-github-pages-default.yml`

## 配置 GitHub Pages 使用默认域名版本

如果您想使用 GitHub Pages 默认域名版本：

### 方法 1：在同一个仓库中切换分支（不推荐，会覆盖自定义域名设置）

1. 进入仓库设置：https://github.com/fenglir002-lang/wsmdemo/settings/pages
2. 在 Source 中选择 `github-pages-default` 分支
3. **注意**：这会覆盖自定义域名设置

### 方法 2：创建新仓库（推荐）

如果您想同时保留两个版本，最好的方法是创建一个新仓库：

1. 在 GitHub 上创建新仓库（例如：`wsmdemo-public`）
2. 将 `github-pages-default` 分支推送到这个新仓库：
```bash
# 添加新仓库作为远程
git remote add public https://github.com/fenglir002-lang/wsmdemo-public.git

# 推送 github-pages-default 分支到新仓库
git push public github-pages-default:main
```

3. 在新仓库的 Settings > Pages 中：
   - Source: 选择 "GitHub Actions"
   - 不设置自定义域名
   - 访问地址：`https://fenglir002-lang.github.io/wsmdemo-public/`

### 方法 3：使用当前分支（最简单）

如果您只是想通过 GitHub 默认地址访问，可以直接使用当前推送的 `github-pages-default` 分支：

1. 进入仓库设置：https://github.com/fenglir002-lang/wsmdemo/settings/pages
2. 在 Source 中选择：
   - **GitHub Actions**（推荐，会自动使用对应分支的 workflow）
   - 或者选择分支 `github-pages-default`
3. 如果设置了自定义域名，请**移除自定义域名设置**（清空 Custom domain 输入框）
4. 访问地址将是：`https://fenglir002-lang.github.io/wsmdemo/`

## 更新代码

- **更新自定义域名版本**：在 `main` 分支提交并推送
- **更新默认域名版本**：切换到 `github-pages-default` 分支，修改代码，提交并推送

## 注意事项

- 两个分支可以独立维护
- 自定义域名版本和默认域名版本可以同时存在（在不同仓库或使用不同 Pages 配置）
- GitHub Pages 的默认地址格式：`https://用户名.github.io/仓库名/`

