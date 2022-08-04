FROM node:14.18.0 AS compile-front-poswebx

WORKDIR /opt/ng
COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build-prod

FROM nginx AS nginx-poswebx

COPY --from=compile-front-poswebx /opt/ng/dist/fuse /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
