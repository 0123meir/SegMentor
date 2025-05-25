# Use Node.js 23 as the base image
FROM node:23-alpine

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3004

# Command to run the application
CMD ["npm", "run", "start:prod"]