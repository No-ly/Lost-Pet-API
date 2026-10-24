# 1. Imagen base oficial de Node.js en versión ligera
FROM node:20-alpine

# 2. Carpeta de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar manifiestos de dependencias
COPY package*.json ./

# 4. Instalar las dependencias del proyecto
RUN npm install

# 5. Copiar todo el código fuente al contenedor
COPY . .

# 6. Compilar el código TypeScript a JavaScript (genera la carpeta dist)
RUN npm run build

# 7. Exponer el puerto interno de la API (por defecto 3000)
EXPOSE 3000

# 8. Comando para arrancar la aplicación en producción
CMD ["npm", "run", "start:prod"]