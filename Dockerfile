
FROM node:24-alpine

ENV HOME=/home
WORKDIR $HOME

RUN npm install -g nodemon

COPY serve_backend/package*.json ./

RUN npm install

COPY serve_backend/. .

EXPOSE 3000

CMD ["npm", "run", "dev"]
