FROM node:20

RUN apt update \
    && apt install git \
    && git clone https://github.com/marcoantonioq/lista-atendimento.git /app

WORKDIR /app/client
COPY client .
RUN npm install && npm run build

WORKDIR /app/server
COPY server .
RUN npm install

EXPOSE 3000
CMD [ "npm", "run", "start" ]
