---
title: Dify 平台配置 https
date: 2025-07-04
tags: [Dify, https]
description: 记录如何配置 Dify 平台的 https
---

# Dify 平台配置 https

## 生成 SSL 证书

```bash
# 进入 nginx/ssl
cd /opt/dify/dify/docker
cd nginx/ssl
# 生成证书
openssl genpkey -algorithm RSA -out dify.key
openssl req -new -key dify.key -out dify.csr
openssl x509 -req -in dify.csr -signkey dify.key -out dify.crt -days 365
```

## 修改 Dify 配置文件

```bash
cd /opt/dify/dify/docker
vi .env
```

修改以下配置

```dotenv
NGINX_SERVER_NAME=106.15.201.186
NGINX_HTTPS_ENABLED=true
NGINX_ENABLE_CERTBOT_CHALLENGE=true
CERTBOT_EMAIL=1365127529@qq.com
CERTBOT_DOMAIN=106.15.201.186
```

## 重启 Dify

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```
