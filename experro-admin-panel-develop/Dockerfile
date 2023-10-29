FROM node:16.16.0-alpine AS builder
#ENV NODE_ENV production
# Add a work directory
WORKDIR /app
RUN apk add git python3 make g++
# Cache and Install dependencies
COPY package.json .
#COPY yarn.lock .
RUN npm install
# Copy app files
COPY . .
# Build the app
RUN npm run build

# Bundle static assets with nginx
FROM nginx:1.21.0-alpine as production
ENV NODE_ENV production
# Copy built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html
# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 8080
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
