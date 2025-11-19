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
# Recibe arg para la variable (opcional si usas .env)
ARG VITE_CHATBOT_URL
ENV VITE_CHATBOT_URL=$VITE_CHATBOT_URL

COPY package*.json ./
RUN npm install

COPY . .

# Debug: mostrar variable
RUN echo "VITE_CHATBOT_URL en build: $VITE_CHATBOT_URL"

RUN npm run build

# Etapa producción con nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
