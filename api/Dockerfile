FROM node:16-alpine AS api-builder

# Create app directory
WORKDIR /app

# Copy the project into the api-builder
COPY package.json package.json
COPY core ./core
COPY api ./api

# Install dependencies and compile the files
RUN echo "Installing and building core"
RUN cd /app/core && npm install && npm run build
RUN echo "Installing and building core completed"

RUN echo "Installing and building api"
RUN cd /app/api && npm install --prefer-offline --no-audit && npm run build
RUN echo "Installing and building api completed"

EXPOSE 4000


