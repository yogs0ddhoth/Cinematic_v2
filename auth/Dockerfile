FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /auth
COPY ["package.json", "package-lock.json*", "./"]
USER node
RUN npm install
COPY . .
RUN npx prisma migrate deploy init