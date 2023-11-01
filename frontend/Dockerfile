###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:16-alpine as development
WORKDIR /app

COPY package*.json ./
COPY frontend ./frontend
COPY core ./core


# Install dependencies and compile the files
RUN echo "Installing and building core"
RUN cd /app/core && npm install && npm run build
RUN echo "Installing and building core completed"

RUN echo "Installing and building frontend "
RUN cd /app/frontend && npm install && npm run build
RUN echo "Installing and building frontend completed"

EXPOSE 8080
###################
# BUILD FOR PRODUCTION
###################

FROM node:16-alpine AS build

# Create app directory
WORKDIR /app

ARG VUE_APP_BASE_APP_URL
ENV VUE_APP_BASE_APP_URL=$VUE_APP_BASE_APP_URL

COPY package*.json ./
COPY frontend ./frontend
COPY core ./core

RUN cd /app/core && npm i && npm run build && npm prune --production
RUN cd /app/frontend && npm i --prefer-offline --no-audit && npm run build && npm prune --production

###################
# PRODUCTION
###################

FROM nginx:alpine as production

## Remove default nginx index page
RUN rm -rf /var/www/html/*
RUN nginx -V


#COPY --from=frontend-builder /usr/src/app/index.html /var/www/html/index.html
COPY --from=build /app/frontend/dist /var/www/html

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]