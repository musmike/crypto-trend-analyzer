# Wpływ wydarzeń na kursy kryptowalut

## Autorzy
Michał Muzyka i Mateusz Niedźwiedź

## Opis
Projekt ten umożliwia uruchomienie aplikacji internetowej za pomocą narzędzia Docker Compose.
Aplikacja ta ukazuje kształtowanie się wartości poszczególnych kryptowalut w czasie, z uwzględnieniem 
wydarzeń jakie miały miejsce, z podziałem na kategorie wydarzeń (np. gospodarka, 
popkultura itp.). Dzięki niej można analizować siłę oddziaływania poszczególnych wydarzeń i kategorii wydarzeń oraz różnice w trendach pomiędzy kryptowalutami. 


## Struktura projektu
Aplikacja składa się z 3 usług:
- frontendu powstałego przy użyciu szkieletu programistycznego React, udostępnionego na serwerze Nginx,
- rest-api powstałego przy użyciu ASP.NET Core,
- nierelacyjnej bazy danych MongoDB

Projekt zawiera katalogi frontendu (client), backendu (rest-api) i bazy danych (mongodb). 
W każdym z nich znajduje się plik Dockerfile potrzebny do utworzenia obrazu konkretnej usługi. 
W katalogu client znajduje się też plik konfiguracyjny serwera Nginx.
Jest też osobny katalog (db_dumps) używany jako wolumen na przechowywanie danych bazy nawet po wyłączeniu kontenera.
Całość projektu zwieńcza plik docker-compose.yml, który łączy kontenery w jedno środowisko aplikacji.

## Wymagania
Dla uruchomienia aplikacji wymagane jest zainstalowanie Docker Engine i Docker Compose na systemie operacyjnym oraz posiadanie stosunkowo nowej przeglądarki internetowej.

## Instrukcja
1. Pobierz całe repozytorium.
2. Przejdź do katalogu głównego projektu, gdzie znajduje się plik docker-compose.yml.
3. Uruchom polecenie docker compose up -d (lub docker compose up -d --build), aby zbudować i uruchomić wszystkie usługi aplikacji.
4. Otwórz przeglądarkę internetową i wejdź na adres http://localhost:3100 (w pliku docker-compose.yml możesz zmienić port)
5. W celu skorzystania z analizy danych dotyczących kryptowalut należy się zarejestrować i zalogować na konto.
6. Po zakończeniu pracy zatrzymaj aplikację poprzez polecenie docker-compose down

## Konfiguracja
Konfiguracja projektu jest zawarta w pliku docker-compose.yml. W tym pliku możesz dostosować ustawienia kontenerów takie jak porty, zmienne środowiskowe itp. według swoich potrzeb. Jest to szczególnie ważne, gdy jakiś port używany przez usługi aplikacji jest już zajęty.


