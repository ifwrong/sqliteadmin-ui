# 参数设置
ARG DOCKER_REGISTRY=m.daocloud.io/docker.io/library

# 构建阶段
FROM ${DOCKER_REGISTRY}/node:20-alpine AS builder

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package.json pnpm-lock.yaml ./

# 设置 pnpm 镜像源
RUN pnpm config set registry https://registry.npmmirror.com
# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm run build

# 生产阶段
FROM ${DOCKER_REGISTRY}/nginx:alpine

# 从构建阶段复制静态文件
COPY --from=builder /app/build /usr/share/nginx/html

# 确保正确的文件权限
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# 暴露 80 端口
EXPOSE 80

# 使用 nginx 默认配置启动
CMD ["nginx", "-g", "daemon off;"]