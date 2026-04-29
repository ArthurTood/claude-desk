#!/bin/zsh

# 项目根目录。写死绝对路径，避免从外部输入拼接命令带来的注入风险。
PROJECT_DIR="/Users/arthur/Downloads/clawd-on-desk-main"

# 切换到项目目录；失败时立即退出，避免在错误目录执行 npm 命令。
cd "$PROJECT_DIR" || {
  echo "无法进入项目目录: $PROJECT_DIR"
  exit 1
}

# 检查 npm 是否可用。这个项目通过 package.json 中的 start 脚本启动。
if ! command -v npm >/dev/null 2>&1; then
  echo "未检测到 npm，请先安装 Node.js 和 npm。"
  exit 1
fi

# 如果依赖目录不存在，则自动安装依赖，方便首次双击直接运行。
if [ ! -d "node_modules" ]; then
  echo "未检测到 node_modules，正在执行 npm install ..."
  npm install || {
    echo "依赖安装失败，请检查网络或 npm 配置。"
    exit 1
  }
fi

echo "正在启动 Clawd on Desk ..."
echo "项目目录: $PROJECT_DIR"

# 按仓库定义的启动方式运行项目。
npm start
