FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY entrypoint.sh /

# RUN npm install
# RUN npm install --os=linux --libc=musl --cpu=x64 sharp
RUN npm install --include=optional sharp

COPY . .

EXPOSE 3000

ENV NODE_ENV=development
ENV PORT=3000
ENV DB_HOST=db

ENTRYPOINT ["/entrypoint.sh"]