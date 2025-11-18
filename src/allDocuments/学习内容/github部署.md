在本地首次使用 `gh-pages` 部署项目，主要有两种清晰可靠的路径可选：一种是使用 `gh-pages` npm 包实现半自动化部署，另一种是通过 Git 命令进行手动部署。下面的表格汇总了它们的核心步骤，你可以根据偏好进行选择。

| 特性 | 使用 `gh-pages` npm 包 | 手动 Git 部署 |
| :--- | :--- | :--- |
| **核心逻辑** | 通过 npm 脚本自动构建项目并将产物推送到 `gh-pages` 分支 | 手动完成构建、创建分支、推送代码等一系列 Git 操作 |
| **自动化程度** | 高（一行命令完成部署） | 低（需逐步执行命令） |
| **所需工具** | Node.js, npm/pnpm/yarn, Git | Git |
| **适合场景** | **推荐大多数情况**，尤其是有构建步骤的前端项目 | 希望更细致控制流程，或项目无需构建过程 |

### 🛠️ 使用 `gh-pages` npm 包（推荐）

这种方法通过脚本自动化了部署流程，是大多数现代前端项目（如 Vue、React 项目）的首选。

1.  **安装依赖**：首先，在你的项目根目录下，通过包管理器安装 `gh-pages` 包作为开发依赖。
    ```bash
    # 使用 npm
    npm install --save-dev gh-pages
    # 或使用 pnpm
    pnpm add -D gh-pages
    ```
    

2.  **配置部署脚本**：打开项目根目录下的 `package.json` 文件，在 `"scripts"` 字段中添加一条部署命令。例如，如果你的构建产物目录是 `dist`：
    ```json
    "scripts": {
      "build": "你的构建命令，如 vite build",
      "deploy": "gh-pages -d dist"
    }
    ```
    如果需要指定特定的远程仓库或分支，可以使用 `-r` 和 `-b` 参数，例如：`"deploy": "gh-pages -d dist -r https://github.com/yourname/yourrepo.git -b gh-pages"` 

3.  **构建与部署**：在终端中依次运行构建命令和你刚配置的部署命令。
    ```bash
    # 先构建项目，生成静态文件（如到 dist 目录）
    npm run build
    # 执行部署，将构建产物推送到 gh-pages 分支
    npm run deploy
    ```
    

### 🔧 手动 Git 部署

如果你希望更深入地理解整个过程，或者你的项目只是一个简单的静态文件集合，可以按照以下步骤手动操作。

1.  **初始化并关联仓库**：在项目根目录下初始化 Git 仓库，并将其关联到你的远程 GitHub 仓库。
    ```bash
    git init
    git remote add origin https://github.com/yourname/yourrepo.git
    ```
    

2.  **提交代码到主分支**：将项目所有文件添加到暂存区并提交。通常主分支名为 `main` 或 `master`。
    ```bash
    git add .
    git commit -m "初始提交"
    # 首次推送时，可能需要使用 -u 参数设置上游分支
    git push -u origin main
    ```
    

3.  **创建并切换至 `gh-pages` 分支**：基于当前提交创建新的 `gh-pages` 分支并切换到该分支。
    ```bash
    git branch gh-pages
    git checkout gh-pages
    ```
    

4.  **推送分支**：将本地的 `gh-pages` 分支强制推送到远程仓库（`-f` 参数会覆盖远程分支的现有内容，适用于部署）。
    ```bash
    git push -f origin gh-pages
    ```
    

### ⚙️ 在 GitHub 上启用 Pages 服务

无论使用哪种部署方法，完成后都需要在 GitHub 仓库设置中开启 Pages 功能。

1.  进入你的 GitHub 仓库页面。
2.  点击 **Settings** 选项卡。
3.  在左侧边栏中找到 **Pages** 选项。
4.  在 **Source** 部分，选择 **Deploy from a branch**。
5.  在 **Branch** 下拉菜单中，选择 `gh-pages` 分支，并保持根目录 `/` 选项，然后点击 **Save** 。
6.  稍等片刻（通常几分钟），GitHub 会提供一个类似 `https://你的用户名.github.io/你的仓库名/` 的链接，这就是你网站的访问地址了 。

### 💡 注意事项与技巧

*   **静态资源路径问题**：对于使用前端框架（如 Vue、React）的项目，在构建为静态文件后，如果直接部署到子路径下（如 `username.github.io/repo-name`），很容易出现资源加载失败的问题。你需要在项目的构建配置中（例如 Vue CLI 的 `vue.config.js` 或 Vite 的 `vite.config.js`）将 `publicPath` 设置为相对路径 `'./'`，而不是绝对路径 `'/'` 。
*   **使用 `/docs` 文件夹**：除了推送到 `gh-pages` 分支，GitHub Pages 还支持从主分支（如 `main`）下的 `/docs` 文件夹读取静态文件。你可以在项目的构建设置中，将输出目录指定为 `docs`，然后在仓库的 Pages 设置里选择该源 。
*   **自定义域名**：如果你拥有自己的域名，可以在仓库根目录或 `gh-pages` 分支根目录下创建一个名为 `CNAME` 的文件，里面只写你的域名（例如 `www.example.com`）。然后在你的域名服务商处配置 DNS 解析记录即可 。

完成以上步骤后，你的网站就应该可以正常访问了。如果遇到页面空白、资源加载失败等问题，首先检查浏览器的开发者工具（Console 和 Network 面板）中的报错信息，并重点核对静态资源的路径配置 。
