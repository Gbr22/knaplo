FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

COPY build.sh ./
COPY frontend/ ./frontend/
RUN apt-get update && apt-get install -y tor
RUN ["bash","build.sh"]

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000
ENTRYPOINT [ "node", "server.js" ]