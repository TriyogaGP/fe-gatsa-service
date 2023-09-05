FROM node:14

WORKDIR /app

COPY package*.json .

RUN npm install --force

COPY . .

RUN npm run-script build

EXPOSE 4002

CMD ["npm", "run", "stg"]