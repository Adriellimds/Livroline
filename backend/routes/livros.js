const url = require('url');
const {
    listarLivros,
    buscarLivro,
    criarLivro,
    atualizarLivro,
    deletarLivro
} = require('../controllers/livrosController');

async function livrosRoute(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathParts = parsedUrl.pathname.split('/').filter(p => p);

    // Rota GET /api/livros (listar todos)
    if (req.method === 'GET' && pathParts.length === 2) {
        const livros = await listarLivros();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(livros));
        return;
    }

    // Rota GET /api/livros/:codigo (buscar por código)
    if (req.method === 'GET' && pathParts.length === 3) {
        const livro = await buscarLivro(pathParts[2]);
        if (livro) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(livro));
        } else {
            res.writeHead(404);
            res.end('Livro não encontrado');
        }
        return;
    }

    // Rota POST /api/livros (criar livro)
    if (req.method === 'POST' && pathParts.length === 2) {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            const dados = JSON.parse(body);
            try {
                await criarLivro(dados);
                res.writeHead(201);
                res.end('Livro cadastrado com sucesso');
            } catch (error) {
                res.writeHead(400);
                res.end('Erro ao cadastrar livro');
            }
        });
        return;
    }

    // Rota PUT /api/livros/:codigo (atualizar)
    if (req.method === 'PUT' && pathParts.length === 3) {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            const dados = JSON.parse(body);
            await atualizarLivro(pathParts[2], dados);
            res.writeHead(200);
            res.end('Livro atualizado com sucesso');
        });
        return;
    }

    // Rota DELETE /api/livros/:codigo (excluir)
    if (req.method === 'DELETE' && pathParts.length === 3) {
        await deletarLivro(pathParts[2]);
        res.writeHead(200);
        res.end('Livro deletado com sucesso');
        return;
    }
}

module.exports = livrosRoute;
