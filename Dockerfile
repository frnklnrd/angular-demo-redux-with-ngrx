#stage 1

FROM node:latest as build-node

RUN mkdir -p /app

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build --prod

#stage 2

FROM nginx:alpine

COPY --from=build-node /app/dist/app /usr/share/nginx/html