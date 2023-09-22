FROM node:14

WORKDIR /app

COPY package*.json .

RUN npm install --force

COPY . .

RUN npm run-script stg-build

EXPOSE 4002

CMD ["npm", "run", "stg-serve"]