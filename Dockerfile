# Stage 1: Build the React application
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
# For create-react-app, use: RUN npm run build
# For Vite, ensure your build command is correct (e.g., npm run build) and it creates a 'dist' folder:
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the built React app from the builder stage
# Changed 'build' to 'dist' as it's common for Vite projects
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration (if you created one in Step 3 of previous instructions)
# If you created nginx.conf in your project root and uncommented it in previous Dockerfile:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
