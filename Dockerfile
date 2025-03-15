# Dockerfile
FROM oven/bun

WORKDIR /app

CMD ["bun", "src/server.ts"]
