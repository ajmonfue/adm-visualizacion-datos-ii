FROM node:12.14.0-alpine as builder
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build:prod -- --base-href /adm-2/ 


FROM nginx:1.19.1-alpine
COPY ./etc/nginx-proxy.conf /etc/nginx/conf.d/proxy.conf
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80