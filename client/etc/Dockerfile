FROM node:12.14.0-alpine as builder
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build:prod


FROM nginx:1.19.1-alpine
COPY ./docker/nginx-proxy.conf /etc/nginx/conf.d/proxy.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80