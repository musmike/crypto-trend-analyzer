# Obraz bazowy zawierajacy srodowisko Node.js
FROM node:alpine as build

# Ustawienie katalogu roboczego w kontenerze
WORKDIR /app

# Skopiowanie plików z zależnościami
COPY package.json .
COPY package-lock.json .

# Instalacja zależności
RUN npm install

# Skopiowanie pozostałych plików
COPY . .

# Zbudowanie aplikacji React
RUN npm run build

# Obraz produkcyjny nginx
FROM nginx:alpine

# Skopiowanie plikow zbudowanego projektu 
# do katalogu publicznego serwera Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Wyksponowanie portu 80
EXPOSE 80

# Uuchomienie serwera Nginx w tle
CMD ["nginx", "-g", "daemon off;"]


