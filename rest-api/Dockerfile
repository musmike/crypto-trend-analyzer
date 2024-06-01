# Użycie obrazu bazowego dla .NET SDK do kompilacji aplikacji
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env

# Ustawienie katalogu roboczego
WORKDIR /app

# Kopiowanie plików projektu
COPY *.csproj ./

# Przywrocenie zaleznosci projektu
RUN dotnet restore

# Kopiowanie pozostałych plikow
COPY . ./

# Kompilacja aplikacji
RUN dotnet publish -c Release -o out



# Użycie obrazu bazowego dla .NET Runtime do uruchomienia aplikacji
FROM mcr.microsoft.com/dotnet/aspnet:6.0

# Ustawienie katalogu roboczego
WORKDIR /app

# Skopiowanie skompilowanych plikow z etapu build-env
COPY --from=build-env /app/out .

# Wyksponowanie portu 80
EXPOSE 80

# Ustawienie punktu wejscia kontenera
# uruchamiajacego aplikacje poprzez polecenie dotnet 
ENTRYPOINT ["dotnet", "MyAspNetCoreApp.dll"]