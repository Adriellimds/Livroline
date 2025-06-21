const http = require('http');
const carrinhoRoute = require('./backend/routes/carrinho');
const clientesRoute = require('./backend/routes/clientes');
const livrosRoute = require('./backend/routes/livros');
const fs = require('fs');
const path = require('path');

function serveFile(res, filePath, contentType) {
    const resolvedPath = path.join(__dirname, 'frontend', filePath);
    fs.readFile(resolvedPath, (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('Erro interno');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
}

function getContentType(url) {
    if (url.endsWith('.css')) return 'text/css';
    if (url.endsWith('.js')) return 'application/javascript';
    if (url.endsWith('.png')) return 'image/png';
    if (url.endsWith('.jpg') || url.endsWith('.jpeg')) return 'image/jpeg';
    if (url.endsWith('.gif')) return 'image/gif';
    if (url.endsWith('.svg')) return 'image/svg+xml';
    if (url.endsWith('.html')) return 'text/html';
    return 'text/plain';
}

const server = http.createServer(async (req, res) => {
    // 🔗 Rotas de API
    if (req.url.startsWith('/api/carrinho')) return carrinhoRoute(req, res);
    if (req.url.startsWith('/api/clientes')) return clientesRoute(req, res);
    if (req.url.startsWith('/api/livros')) return livrosRoute(req, res);

    // 🔗 Rotas de arquivos estáticos
    if (req.url === '/' || req.url === '/index.html') {
        return serveFile(res, 'index.html', 'text/html');
    }

    if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|svg|html)$/)) {
        const filePath = req.url.startsWith('/') ? req.url.slice(1) : req.url;
        return serveFile(res, filePath, getContentType(req.url));
    }

    // Rota não encontrada
    res.writeHead(404);
    res.end('Rota não encontrada');
});

// Inicia o servidor
server.listen(3000, () => {
    console.log('🚀 Servidor rodando em http://localhost:3000');
});
