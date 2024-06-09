# Ustawienie obrazu bazowego z .NET ASP.NET Core Runtime 8.0
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base

# Ustawienie użytkownika na "app"
USER app

# Ustawienie katalogu roboczego na /app
WORKDIR /app

# Ekspozycja portu 8080
EXPOSE 8080

# Ustawienie obrazu z .NET SDK 8.0 do budowy aplikacji
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Argument dla konfiguracji budowy (Release)
ARG BUILD_CONFIGURATION=Release

# Ustawienie katalogu roboczego na /src
WORKDIR /src

# Kopiowanie pliku projektu do katalogu roboczego
COPY ["server.csproj", "."]

# Przywracanie zależności NuGet
RUN dotnet restore "./server.csproj"

# Kopiowanie pozostałych plików do katalogu roboczego
COPY . .

# Zmiana katalogu roboczego na /src
WORKDIR "/src/."

# Budowa projektu w zadanej konfiguracji i umieszczenie wyników w /app/build
RUN dotnet build "./server.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Ustawienie obrazu pośredniego do publikacji aplikacji
FROM build AS publish

# Argument dla konfiguracji budowy
ARG BUILD_CONFIGURATION=Release

# Publikacja aplikacji w zadanej konfiguracji i umieszczenie wyników w /app/publish
RUN dotnet publish "./server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false


# Ustawienie finalnego obrazu na bazowy obraz ASP.NET Core Runtime
FROM base AS final

# Ustawienie katalogu roboczego na /app
WORKDIR /app

# Kopiowanie opublikowanej aplikacji z obrazu publikacyjnego do katalogu roboczego
COPY --from=publish /app/publish .

# Ustawienie punktu wejściowego dla kontenera
ENTRYPOINT ["dotnet", "server.dll", "--server.urls", "http://+:8080"]