FROM node:16-alpine
WORKDIR /app

COPY package*.json ./
COPY frontend ./frontend
COPY core ./core
RUN npm install

# Install dependencies and compile the files
RUN echo "Installing and building core"
RUN cd /app/core && npm install && npm run build
RUN echo "Installing and building core completed"

RUN echo "Installing and building frontend "
RUN cd /app/frontend && npm install
RUN echo "Installing and building frontend completed"

#COPY . .