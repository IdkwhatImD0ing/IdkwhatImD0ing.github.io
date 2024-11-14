# Use the official Node.js LTS image
FROM node:18-alpine

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

ENV PORT=8080

# Expose the port the app runs on
EXPOSE 8080

# Define the command to run the app
CMD ["npm", "start"]
