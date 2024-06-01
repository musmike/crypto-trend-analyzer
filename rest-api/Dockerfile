# Obraz bazowy ASP.NET Core Runtime w wersji 6.0
# do uruchomienia aplikacji
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base

# Ustawienie katalogu roboczego
WORKDIR /app

# Ekspozycja portu 80
EXPOSE 80


# Obraz bazowy .NET SDK w wersji 6.0
# do kompilacji aplikacji
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

# Ustawienie katalogu roboczego
WORKDIR /src

# Skopiowanie pliku projektu
COPY ["YourApi/YourApi.csproj", "YourApi/"]

# Przywrocenie zaleznosci projektu na podstawie pliku projektu
RUN dotnet restore "YourApi/YourApi.csproj"

# Kopiowanie pozostałych plikow zrodlowych
COPY . .

# Ustawienie katalogu roboczego na głowny plik projektu
WORKDIR "/src/YourApi"



RUN dotnet build "YourApi.csproj" -c Release -o /app/build


FROM build AS publish


RUN dotnet publish "YourApi.csproj" -c Release -o /app/publish


FROM base AS final


WORKDIR /app


COPY --from=publish /app/publish .


ENTRYPOINT ["dotnet", "YourApi.dll"]