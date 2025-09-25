# Etapa 1: build
FROM node:18-alpine as build

WORKDIR /app

# Copiar dependencias
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Copiar el resto del código
COPY . .

# Para evitar que Render falle con warnings en build de React
ENV CI=false

# Compilar
RUN npm run build

# Etapa 2: nginx
FROM nginx:stable-alpine

# Copiar archivos build a nginx
COPY --from=build /app/build /usr/share/nginx/html

# Configuración nginx personalizada opcional
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
