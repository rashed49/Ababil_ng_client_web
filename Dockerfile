# Stage 1

#FROM node:8.9.4 as node

#WORKDIR /app

#COPY package.json /app/

#RUN npm cache clean --force

#RUN rm -rf ~/.npm

#RUN rm -rf node_modules

#RUN npm install npm@5.6.0 -g

#RUN rm -f package-lock.json

#RUN npm install

#COPY ./ /app/

#ARG env=prod

#RUN npm run docker-build -- --prod --environment $env


# Stage 2
FROM nginx:1.13

COPY dist /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
