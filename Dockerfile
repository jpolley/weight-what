# Use Playwright's official image as the base
FROM mcr.microsoft.com/playwright:v1.45.3-jammy

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install dependencies
# Note: The base image already includes Playwright and its dependencies
RUN npm install

# Command to run tests
CMD ["npx", "playwright", "test"]