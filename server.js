const express = require('express');
const cors = require('cors');
// Importa o módulo de conexão com o MySQL
const db = require('./config/database'); 

const app = express();
const port = 3000;

// 1. MIDDLEWARES
// Middleware para parsear o corpo das requisições JSON
app.use(express.json());

// Middleware para habilitar o CORS
app.use(cors());

// 2. ROTAS
// Rota de teste
app.get('/', (req, res) => {
    res.send('Servidor Node.js rodando e pronto para autenticação!');
});

// Rota de LOGIN (agora usando o MySQL)
app.post('/login', (req, res) => {
    // Usamos 'email' pois a query SQL busca por 'email'
    const { email, password } = req.body; 
    
    // Verifica se o campo email foi fornecido (segurança básica)
    if (!email || !password) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    // Query SQL para buscar o usuário por email no banco de dados
    const sql = 'SELECT * FROM USUARIOS WHERE email = ?';

    // Executa a query no banco de dados
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error('Erro na query:', err);
            // Retorna erro 500 para falha interna do servidor
            return res.status(500).json({ message: 'Erro interno no servidor.' });
        }

        // Se nenhum usuário for encontrado com o email fornecido
        if (results.length === 0) {
            return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
        }

        // Obtém o primeiro usuário encontrado
        const user = results[0];

        if (user.senha === password) { 
            return res.status(200).json({ message: 'Login bem-sucedido!', user: { id: user.id, email: user.email } });
        } else {
            return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
        }
    });
});

// 3. INICIALIZAÇÃO
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
