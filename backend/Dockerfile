# Requires node:18-alpine as the base image for Dockerizing the Node.js application
FROM node:18-alpine

# It installs the nodemon package for monitoring the Express server
RUN npm install -g nodemon

# Creating the working directory
WORKDIR /app

# Copying the dependancies in the package.json file
COPY package.json .

#Installing all the dependancies
RUN npm install

#Copying all the files to the working directory
COPY . .

#Container will run on this port
EXPOSE 4000

#Command to start the Docker container Node.js application
CMD ["npm", "run", "dev"]