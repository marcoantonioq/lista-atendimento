FROM node:20

RUN apt update && apt install git -y 

RUN git clone --depth=1 https://github.com/marcoantonioq/lista-atendimento.git /app

WORKDIR /app/client
COPY client .
RUN npm install && npm run build

WORKDIR /app/server
COPY server .
RUN npm install && npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]
