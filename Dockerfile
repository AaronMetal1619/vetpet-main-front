# Etapa 1: build
FROM node:18-alpine as build

# Directorio de trabajo
WORKDIR /app

# Copiamos archivos necesarios
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Copiar el resto del código
COPY . .

# Compilamos la aplicación para producción
RUN npm run build

# Etapa 2: nginx para servir
FROM nginx:stable-alpine

# Copiar el build de React a nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuración personalizada si la tuvieras
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
