# 新仓库设置步骤

## 步骤 1：在 GitHub 上创建新仓库

1. 访问：https://github.com/new
2. Repository name: `wsmdemo-public`（或您想要的其他名称）
3. 选择 Public 或 Private
4. **不要**勾选 "Initialize this repository with a README"
5. 点击 "Create repository"

## 步骤 2：推送代码到新仓库

创建仓库后，执行以下命令（将 `wsmdemo-public` 替换为您的实际仓库名）：

```bash
# 添加新仓库作为远程（命名为 public）
git remote add public https://github.com/fenglir002-lang/wsmdemo-public.git

# 推送当前分支到新仓库的 main 分支
git push public github-pages-default:main
```

## 步骤 3：配置 GitHub Pages

1. 进入新仓库的 Settings > Pages
2. Source 选择：**GitHub Actions**
3. **不要**设置自定义域名（保持 Custom domain 为空）
4. 访问地址将是：`https://fenglir002-lang.github.io/wsmdemo-public/`

## 注意事项

- 如果新仓库名不是 `wsmdemo-public`，需要修改 `vite.config.ts` 中的 `base` 路径
- 例如，如果仓库名是 `my-demo`，base 应该设置为 `/my-demo/`

