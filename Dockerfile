FROM node:lts-alpine3.10 as base-builder

WORKDIR /app

FROM base-builder as build_fe

COPY ./frontend/package.json ./frontend/package-lock.json* /app/frontend/
RUN cd ./frontend && npm i
ADD ./frontend ./frontend
RUN cd ./frontend && npm run generate

FROM base-builder as build_be

COPY ./backend/package.json ./backend/package-lock.json* /app/backend/
RUN cd ./backend && npm i
ADD ./backend ./backend
RUN cd ./backend && npm run build

FROM node:lts-alpine3.10

WORKDIR /app
COPY --from=build_be /app/backend /app
COPY --from=build_fe /app/frontend/dist /app/static

CMD cd /app && npm start