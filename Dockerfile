FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# El panel de administración vive fuera de public/ para que NO acabe en el
# build estático que se publica en internet: no tiene autenticación. Aquí se
# copia a propósito, porque esta imagen es la del entorno privado con el API.
COPY admin-ui /usr/share/nginx/html/admin
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
