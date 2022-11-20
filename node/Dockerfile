# It uses node:18-alpine as the base image for the Node.js application
FROM node:18-alpine

# It installs the nodemon package globally for monitoring and watching the backend Express server
RUN npm install -g nodemon

# Creating the working directory named `app`
WORKDIR /app

# Copying all the tools and dependancies in the package.json file to the working directory
COPY package.json .

#Installing all the tools and dependancies
RUN npm install

#Copying all the application files to the working directory
COPY . .

#Exposing the container to run on this port
EXPOSE 4000

#Command to start the Docker container for the Node.js application
CMD ["npm", "run", "dev"]