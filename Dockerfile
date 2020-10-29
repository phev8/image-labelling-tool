# Base Image with apline linux and golang preinstalled
FROM golang:1.15.3-alpine3.12

# Copy files and create empty directories
COPY /server /server
COPY /image_tagging_app /image_tagging_app
COPY /start_all.sh /start_all.sh
RUN mkdir /server/mongodb

# MongoDB - Attention this is a workaround, there is no longer an up to date version of mongodb for alpine. (mb switch to ubuntu base?)
# Current version should be fine for the purpose of this system though
# Taken from https://unix.stackexchange.com/questions/568530/installing-mongodb-on-alpine-3-9
# Last, install yarn
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.9/main' >> /etc/apk/repositories && \
  echo 'http://dl-cdn.alpinelinux.org/alpine/v3.9/community' >> /etc/apk/repositories && \
  apk update && \
  apk add mongodb yaml-cpp=0.6.2-r2 && \
  apk add --update yarn

# Install dependencies
WORKDIR /image_tagging_app
RUN yarn install
WORKDIR /server
RUN go get ./...
WORKDIR /

#Port for node, mongoDB and Go server
EXPOSE 3000 27017 3500

CMD [ "sh","start_all.sh" ]

# Build command (cd to this file first), name tag can be anything.
# docker build -t janiselfert/ilt .

# Run command 
# -it is necessary, otherwise node server will terminate immediately after startup
# -v is for the volume of the mongodb folder
# docker run -p 8080:3000 -it -v /Users/janiselfert/Lokal/ilt_mongo_test:/server/mongodb janiselfert/ilt 