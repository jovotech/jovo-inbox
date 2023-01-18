###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:16-alpine AS development

# Create app directory
WORKDIR /app

# Copy the project into production
COPY package*.json ./
COPY core ./core
COPY api ./api

# Install dependencies and compile the files
RUN echo "Installing and building core (development)"
RUN cd /app/core && npm ci && npm run build
RUN echo "Installing and building core (development) completed"

RUN echo "Installing and building api  (development)"
RUN cd /app/api && npm ci --prefer-offline --no-audit && npm run build
RUN echo "Installing and building api  (development) completed"

EXPOSE 4000


###################
# BUILD FOR PRODUCTION
###################

FROM node:16-alpine AS build

# Create app directory
WORKDIR /app

# Copy the project into production
COPY package*.json ./
COPY core ./core
COPY api ./api

ENV NODE_ENV production

# Install dependencies and compile the files
RUN echo "Installing and building core (production)"
RUN cd /app/core && npm ci --only=production && npm cache clean --force && npm run build
RUN echo "Installing and building core (production) completed"

RUN echo "Installing and building api (production)"
RUN cd /app/api && npm ci --prefer-offline --no-audit --only=production && npm cache clean --force && npm run build
RUN echo "Installing and building api (production) completed"


###################
# PRODUCTION
###################

FROM node:16-alpine As production

# Copy the bundled code from the build stage to the production image
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Start the server using the production build
CMD [ "node", "dist/main.js" ]