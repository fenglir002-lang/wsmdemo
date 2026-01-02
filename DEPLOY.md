# 部署指南

本指南将帮助您将项目部署到 GitHub Pages 并使用自定义域名 `fengdedemo.online`。

## 第一步：创建 GitHub 仓库并推送代码

### 1. 在 GitHub 上创建新仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角的 "+" 号，选择 "New repository"
3. 填写仓库信息：
   - Repository name: 输入您的仓库名称（例如：`wsmdemo`）
   - 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"（因为我们已经有了代码）
4. 点击 "Create repository"

### 2. 推送代码到 GitHub

在终端中执行以下命令（将 `YOUR_USERNAME` 和 `YOUR_REPO_NAME` 替换为您的实际信息）：

```bash
# 添加远程仓库（替换为您的仓库地址）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 推送代码到 GitHub
git branch -M main
git push -u origin main
```

或者如果您使用 SSH：

```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## 第二步：配置 GitHub Pages

### 方法一：使用 GitHub Actions（推荐）

项目已包含 GitHub Actions workflow 配置文件，使用此方法更简单。

#### 1. 推送代码到 GitHub（包含 workflow 文件）

确保您已经推送了包含 `.github/workflows/deploy.yml` 的代码：

```bash
git add .
git commit -m "Add GitHub Actions deployment workflow"
git push origin main
```

#### 2. 启用 GitHub Pages

1. 在 GitHub 仓库页面，点击 "Settings"（设置）
2. 在左侧菜单中找到 "Pages"（页面）
3. 在 "Source"（源）部分：
   - 选择 **"GitHub Actions"**
   - GitHub 会自动检测到 workflow 文件并开始部署

#### 3. 等待自动部署

- 推送代码后，GitHub Actions 会自动运行
- 您可以在仓库的 "Actions" 标签页查看部署进度
- 首次部署完成后，网站会自动发布

### 方法二：使用 gh-pages 分支（备选方案）

如果您想使用传统的 gh-pages 分支方式：

1. 先在本地执行一次部署创建 gh-pages 分支：
```bash
npm run deploy
```

2. 然后在 GitHub Pages 设置中选择：
   - Source: **Deploy from a branch**
   - Branch: `gh-pages`
   - Folder: `/ (root)`

3. 后续每次更新都需要运行：
```bash
npm run deploy
```

## 第三步：配置自定义域名

### 1. 在域名提供商处配置 DNS

在您的域名 `fengdedemo.online` 的 DNS 设置中添加以下记录：

**选项 A：使用 A 记录（推荐）**
```
类型: A
名称: @
值: 185.199.108.153
      185.199.109.153
      185.199.110.153
      185.199.111.153
```

**选项 B：使用 CNAME 记录**
```
类型: CNAME
名称: @
值: YOUR_USERNAME.github.io
```

或者如果您想使用 www 子域名：
```
类型: CNAME
名称: www
值: YOUR_USERNAME.github.io
```

### 2. 在 GitHub 中配置自定义域名

1. 在 GitHub 仓库的 Settings > Pages 页面
2. 在 "Custom domain"（自定义域名）输入框中输入：`fengdedemo.online`
3. 勾选 "Enforce HTTPS"（强制 HTTPS）
4. 点击 "Save"

**注意：** DNS 记录可能需要几分钟到几小时才能生效。您可以使用 `dig` 或 `nslookup` 命令检查 DNS 是否已生效。

## 第四步：验证部署

1. 等待 DNS 生效后（通常 5-60 分钟），访问 `https://fengdedemo.online`
2. 如果看到您的应用，说明部署成功！

## 后续更新部署

每次代码更新后，只需运行：

```bash
git add .
git commit -m "您的提交信息"
git push origin main
npm run deploy
```

## 故障排除

### DNS 未生效
- 使用 `dig fengdedemo.online` 或在线 DNS 查询工具检查
- 确认 DNS 记录的 TTL 值

### 404 错误
- 确认 GitHub Pages 的 Source 设置为 `gh-pages` 分支
- 检查 `public/CNAME` 文件是否存在且内容正确

### HTTPS 证书问题
- 在 GitHub Pages 设置中勾选 "Enforce HTTPS"
- 等待 GitHub 自动生成 SSL 证书（可能需要几分钟）

### 环境变量问题
如果应用需要 API Key（如 GEMINI_API_KEY），您需要：
- 在客户端代码中使用环境变量（注意：GitHub Pages 是静态托管，不能使用服务端环境变量）
- 或者考虑使用其他部署方案（如 Vercel、Netlify 等支持环境变量的平台）

