FROM node:24-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund --prefer-offline && npm cache clean --force
COPY --chown=node:node server.js ./
RUN mkdir /data && chown node:node /data
USER node
EXPOSE 3000
CMD ["node", "server.js"]
