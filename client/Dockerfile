# Build stage with Node.js
FROM node:alpine AS build
WORKDIR /app

# Copy dependency definitions and install
COPY package.json package-lock.json ./
RUN npm install

# Copy source code and build production bundle
COPY . .
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

# Copy compiled assets to Nginx web root
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]