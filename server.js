const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importe o pacote 'cors'

const app = express();
const port = 3000;

// Configuração do CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Permitir apenas requisições deste endereço
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type'] // Cabeçalhos permitidos
}));

app.use(bodyParser.json());

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Se você não tem senha configurada, deixe vazio
    database: 'lochs', // Nome do seu banco de dados
    port: 3306
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Rota para registrar um usuário
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            return res.status(500).send('Erro ao registrar usuário');
        }
        res.send('Usuário registrado com sucesso');
    });
});

// Rota para login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao fazer login');
        }
        if (results.length > 0) {
            res.send('Login bem-sucedido');
        } else {
            res.status(401).send('Usuário ou senha incorretos');
        }
    });
});

app.post('/logout', (req, res) => {
    res.send('Logout bem-sucedido');
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
