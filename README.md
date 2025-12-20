# Impact of Events on Cryptocurrency Prices

## Authors
Michał Muzyka and Mateusz Niedźwiedź

## Description  
This project enables running a web application using Docker Compose. The application presents the evolution of individual cryptocurrency values over time, taking into account events that have occurred, divided into event categories (e.g., economy, pop culture, etc.). It allows users to analyze the strength of the impact of specific events and event categories, as well as differences in trends between cryptocurrencies.

## Project Structure  
The application consists of three services:
- a frontend built using the React framework, served via an Nginx server,
- a REST API built using ASP.NET Core,
- a non-relational MongoDB database.

The project contains directories for the frontend (client), backend (rest-api), and database (mongodb).  
Each of them includes a Dockerfile required to build the image for a specific service.

The `client` directory also contains the Nginx server configuration file. There is also a separate directory (`db_dumps`) used as a volume to store database data even after the container is stopped.

The entire project is tied together by the `docker-compose.yml` file, which connects the containers into a single application environment.

## Requirements  
To run the application, Docker Engine and Docker Compose must be installed on the operating system, and a relatively modern web browser is required.

## Instructions  
1. Download the entire repository.  
2. Navigate to the main project directory where the `docker-compose.yml` file is located.  
3. Run the command `docker compose up -d` (or `docker compose up -d --build`) to build and start all application services.  
4. Open a web browser and go to `http://localhost:3100` (you can change the port in the `docker-compose.yml` file).  
5. To use the cryptocurrency data analysis features, you need to register and log in to an account.  
6. After finishing your work, stop the application using the command `docker-compose down`.

## Configuration  
The project configuration is contained in the `docker-compose.yml` file. In this file, you can customize container settings such as ports, environment variables, etc., according to your needs. This is especially important if a port used by one of the application services is already in use.


