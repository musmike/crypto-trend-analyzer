# Runtime base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080

# SDK build image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy project file and restore NuGet packages
COPY ["server.csproj", "."]
RUN dotnet restore "./server.csproj"

# Copy remaining source code and build
COPY . .
WORKDIR "/src/."
RUN dotnet build "./server.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final production image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "server.dll", "--server.urls", "http://+:8080"]