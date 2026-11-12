
# Single-stage build: Node and Nginx in the same image
FROM node:22-alpine

WORKDIR /app

# Install Nginx
RUN apk add --no-cache nginx

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source code
COPY . .

# Build production frontend
RUN npm run build

# Copy production build to Nginx
RUN mkdir -p /usr/share/nginx/html
RUN cp -r dist/. /usr/share/nginx/html/

# Configure Nginx reverse proxy
COPY nginx.conf /etc/nginx/http.d/default.conf

# Create Nginx runtime directory
RUN mkdir -p /run/nginx

# Expose frontend port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
