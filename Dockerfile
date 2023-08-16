FROM node:18.14.1-alpine
WORKDIR /app
RUN apk update && apk upgrade && apk add --no-cache bash git tree
COPY package.json .
RUN yarn
COPY . .
EXPOSE 3003
RUN yarn build
ENTRYPOINT tree -I node_modules/
