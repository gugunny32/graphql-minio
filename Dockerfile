FROM node:19

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json package-lock.json /usr/src/app/

RUN npm install --production

COPY . .

EXPOSE 8000

ENV TZ Asia/Bangkok

CMD ["npm", "start"]