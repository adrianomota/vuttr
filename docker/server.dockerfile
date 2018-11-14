FROM node 
LABEL author="Fabio Cruz"
COPY . /var/www
ENV PORT=3000
WORKDIR /var/www
RUN npm install
ENTRYPOINT npm start
EXPOSE $PORT 