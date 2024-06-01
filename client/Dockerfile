# Obraz zawierajacy srodowisko Node.js
FROM node:alpine

# Ustawienie katalogu roboczego w kontenerze
WORKDIR /app

# Skopiowanie plików z zależnościami
COPY package.json .
COPY package-lock.json .

# Instalacja zależności
RUN npm install

# Skopiowanie reszty plików
COPY . .

# Uruchomienie