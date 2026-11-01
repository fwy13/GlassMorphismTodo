FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --no-fund --prefer-offline
COPY . .
RUN npm run build
FROM nginx:1.28-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ /usr/share/nginx/html/
# nginx:alpine starts a privileged master process and drops privileges for workers.
# With Compose read_only + tmpfs (/var/run and /var/cache/nginx), running
# the entire container as USER nginx fails because tmpfs mounts are root-owned.
# Keep the default image user; nginx workers still run as nginx.
EXPOSE 8080
