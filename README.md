# 🤖 极简全栈聊天机器人 (React + NestJS + Supabase)

这是一个功能完备、代码简洁的全栈 Web 聊天机器人项目。旨在作为学习现代 Web 开发技术的入门范例，涵盖了从前端交互、后端逻辑到数据库持久化的完整流程。

项目前端使用 **React (TypeScript)** 构建，后端使用 **NestJS** 搭建，数据库采用云服务 **Supabase (PostgreSQL)**。

## ✨ 项目特色

- **现代技术栈**: 前端采用 React Hooks 和 TypeScript，后端采用结构化的 NestJS 框架，体验现代全栈开发流程。
- **类型安全**: 从前端到后端，全程使用 TypeScript，保证了代码的健壮性和可维护性。
- **分层架构**: 后端采用清晰的 Controller-Service-DTO 模式，逻辑分离，易于扩展。
- **持久化存储**: 集成 Supabase 云数据库，聊天记录可以被永久保存和读取。
- **配置安全**: 使用 `.env` 文件和 NestJS 的 `ConfigModule` 管理敏感密钥，遵循生产环境最佳实践。
- **代码简洁**: 项目力求以最少的代码实现核心功能，非常适合初学者学习和理解。

## 🛠️ 技术栈

- **前端**:
  - [React](https://reactjs.org/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Axios](https://axios-http.com/) (用于 HTTP 请求)
- **后端**:
  - [NestJS](https://nestjs.com/) (基于 Node.js 和 TypeScript)
  - [OpenAI-compatible SDK](https://github.com/openai/openai-node) (用于调用大语言模型)
  - [Supabase](https://supabase.com/) (PostgreSQL 数据库 & 客户端)
- **开发工具**:
  - [Vite](https://vitejs.dev/) (前端开发服务器，由 Create React App 提供)
  - [Nest CLI](https://docs.nestjs.com/cli/overview) (后端脚手架)
- **生产部署 (推荐)**:
  - [PM2](https://pm2.keymetrics.io/) (Node.js 进程管理器)
  - [Nginx](https://www.nginx.com/) (反向代理服务器)

## 🚀 快速开始

你需要同时运行前端和后端两个部分。请确保你的电脑上已安装 [Node.js](https://nodejs.org/) (v16 或更高版本)。

### 1. 克隆项目

```bash
git clone <your-repository-url>
cd <project-folder>
```

### 2. 配置后端

后端负责处理所有业务逻辑和数据库交互。

1.  **进入后端目录**:
    ```bash
    cd nestjs-chatbot-backend
    ```

2.  **安装依赖**:
    ```bash
    npm install
    ```

3.  **创建并配置环境变量文件**:
    在 `nestjs-chatbot-backend` 目录下创建一个名为 `.env` 的文件，并填入以下内容。请将占位符替换为你自己的真实密钥。

    ```env
    # .env

    # 你的魔塔大语言模型 API Key (例如 ModelScope)
    MODEL_SCOPE_API_KEY=sk-your-llm-api-key

    # 从你的 Supabase 项目设置中获取
    SUPABASE_URL=https://<your-project-ref>.supabase.co
    SUPABASE_SERVICE_KEY=<your-super-long-service-role-key>
    ```

4.  **启动后端开发服务器**:
    ```bash
    npm run start:dev
    ```
    后端将运行在 `http://localhost:5000`。请保持此终端窗口运行。

### 3. 配置前端

前端是用户与之交互的界面。

1.  **打开一个新的终端**，进入前端目录:
    ```bash
    cd frontend
    ```

2.  **安装依赖**:
    ```bash
    npm install
    ```

3.  **启动前端开发服务器**:
    ```bash
    npm start
    ```
    应用通常会自动在你的浏览器中打开 `http://localhost:3000`。请保持此终端窗口运行。

### 4. 开始聊天！

现在，你可以在浏览器中与你的聊天机器人进行对话了！所有的聊天记录都会被自动保存到你的 Supabase 数据库中，刷新页面后依然存在。

## 📁 项目结构

项目分为两个主要部分：`frontend` 和 `nestjs-chatbot-backend`。

```
.
├── frontend/             # React 前端应用
│   ├── public/
│   └── src/
│       ├── App.tsx       # 核心应用组件 (UI 和 API 调用)
│       └── index.tsx     # 应用入口
│
└── nestjs-chatbot-backend/ # NestJS 后端应用
    └── src/
        ├── app.module.ts   # 应用根模块 (组装所有模块)
        ├── main.ts         # 应用入口 (启动服务器和配置管道)
        └── chat/           # 聊天功能模块
            ├── dto/
            │   └── create-chat.dto.ts # 数据传输对象 (API 合约)
            ├── chat.controller.ts     # 控制器 (处理 HTTP 请求)
            └── chat.service.ts        # 服务 (核心业务逻辑)
```

## 下一步可以做什么？

- [ ] **用户认证**: 使用 Supabase Auth 实现用户登录/注册功能。
- [ ] **多用户隔离**: 在 `messages` 表中增加 `user_id` 字段，并使用 Supabase 的行级安全 (RLS) 策略，让每个用户只能看到自己的聊天记录。
- [ ] **流式响应**: 将后端的 LLM API 调用改为流式 (Streaming) 模式，让前端可以像 ChatGPT 一样逐字显示回复。
- [ ] **美化 UI**: 使用 [Chakra UI](https://chakra-ui.com/) 或 [MUI](https://mui.com/) 等组件库来构建更精美的界面。
- [ ] **生产部署**: 按照 [NestJS](https://docs.nestjs.com/deployment) 和 [Create React App](https://create-react-app.dev/docs/deployment/) 的官方文档，将应用部署到云服务器上。

---

希望这个项目能帮助你更好地学习和理解全栈开发！