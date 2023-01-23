###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:16-alpine AS development

# Create app directory
WORKDIR /app

# Copy the project into production
COPY package*.json ./
COPY core ./core
COPY backend ./backend

# Install dependencies and compile the files
RUN echo "Installing and building core (development)"
RUN cd /app/core && npm ci && npm run build
RUN echo "Installing and building core (development) completed"

RUN echo "Installing and building backend  (development)"
RUN cd /app/backend && npm ci --prefer-offline --no-audit && npm run build
RUN echo "Installing and building backend  (development) completed"

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
COPY backend ./backend


# Install dependencies and compile the files
RUN echo "Installing and building core (production)"
RUN cd /app/core && npm i && npm run build:commonjs && npm prune --production
RUN echo "Installing and building core (production) completed"

RUN echo "Installing and building backend (production)"
RUN cd /app/backend && npm i --prefer-offline --no-audit && npm run build && npm prune --production
RUN echo "Installing and building backend (production) completed"


###################
# PRODUCTION
###################

FROM node:16-alpine As production

# Create app directory
WORKDIR /app

# Copy the bundled code from the build stage to the production image
COPY --from=build /. /.
