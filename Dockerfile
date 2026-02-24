FROM node:20

WORKDIR /app

RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=development

COPY package*.json ./

RUN npm install -g typescript
RUN npm install

COPY . .

RUN tsc

EXPOSE 3000

CMD ["npm", "start"]