FROM node:latest
ENV port 5000

COPY . /src
WORKDIR /src

RUN yarn 
RUN yarn build
EXPOSE ${port}

CMD npm start serve
