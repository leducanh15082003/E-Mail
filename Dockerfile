# Use Node.js as the base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your app listens on
EXPOSE 8000

# Start the application
CMD ["node", "index.js"]
