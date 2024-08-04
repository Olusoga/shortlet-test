FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install 

RUN npm install -g @nestjs/cli

COPY . .

COPY .env ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
