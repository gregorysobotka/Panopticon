FROM node:22
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 3300
CMD [ "npm", "run", "nmon"]