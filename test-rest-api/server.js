const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 8089;

app.use(cors());

// Przykładowa baza danych użytkowników
const users = [];

app.use(bodyParser.json());

// Funkcja middleware do autoryzacji tokenem
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, 'secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Endpoint rejestracji
app.post('/app/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Sprawdź, czy użytkownik już istnieje
    if (users.some(user => user.username === username || user.email === email)) {
        return res.status(400).json({ message: 'Nazwa użytkownika lub adres email już istnieje' });
    }

    // Zaszyfruj hasło
    const hashedPassword = await bcrypt.hash(password, 10);

    // Dodaj użytkownika do bazy danych 
    users.push({ username, email, password: hashedPassword });

    res.json({ message: 'Rejestracja zakończona pomyślnie' });
});

// Endpoint logowania
app.post('/app/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Sprawdź, czy użytkownik istnieje
        const user = users.find(user => user.username === username);
        if (!user) {
            return res.status(400).json({ message: 'Nieprawidłowe dane logowania' });
        }

        // Sprawdź poprawność hasła
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send({ message: "Invalid Email or Password" });
        }
        const token = jwt.sign({ username: user.username }, 'secret');
        res.status(200).send({ data: token, message: "logged in successfully" })
    } 
    catch (error) {
        res.status(500).send({ message: "Internal Server Error" })
    }
});

const filePath = 'data.json';

// Obsługa żądania GET dla trasy /app/data
app.get('/app/data', authenticateToken, (req, res) => {
    // Odczytaj dane z pliku JSON
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Błąd odczytu pliku:', err);
            res.status(500).send('Wystąpił błąd podczas odczytu danych.');
            return;
        }

        try {
            // Parsuj dane JSON
            const jsonData = JSON.parse(data);
            // Wyślij dane jako odpowiedź
            res.json(jsonData);
        } catch (parseError) {
            console.error('Błąd parsowania danych JSON:', parseError);
            res.status(500).send('Wystąpił błąd podczas parsowania danych.');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
