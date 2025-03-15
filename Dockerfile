# Dockerfile
FROM oven/bun:latest

WORKDIR /app

COPY . .

CMD ["bun", "run", "dev"]
