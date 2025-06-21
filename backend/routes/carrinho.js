const url = require('url');
const {
    adicionarItensAoCarrinho,
    listarCarrinho,
    removerItem,
    alterarQuantidade,
    limparCarrinho
} = require('../controllers/carrinhoController');

async function carrinhoRoute(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const partes = path.split('/').filter(Boolean);

    // Adicionar ou atualizar vários itens
    if (path === '/api/carrinho' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk });
        req.on('end', async () => {
            const { codigoCliente, itens } = JSON.parse(body);
            await adicionarItensAoCarrinho(codigoCliente, itens);
            res.writeHead(200);
            res.end('Carrinho atualizado');
        });
        return;
    }

    // Listar carrinho
    if (partes[0] === 'api' && partes[1] === 'carrinho' && partes.length === 3 && req.method === 'GET') {
        const codigoCliente = parseInt(partes[2]);
        const carrinho = await listarCarrinho(codigoCliente);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(carrinho));
        return;
    }

    // Remover item específico
    if (path === '/api/carrinho/item' && req.method === 'DELETE') {
        let body = '';
        req.on('data', chunk => { body += chunk });
        req.on('end', async () => {
            const { codigoCliente, codigoLivro } = JSON.parse(body);
            await removerItem(codigoCliente, codigoLivro);
            res.writeHead(200);
            res.end('Item removido');
        });
        return;
    }

    // Alterar quantidade de um item
    if (path === '/api/carrinho/quantidade' && req.method === 'PUT') {
        let body = '';
        req.on('data', chunk => { body += chunk });
        req.on('end', async () => {
            const { codigoCliente, codigoLivro, novaQtd } = JSON.parse(body);
            await alterarQuantidade(codigoCliente, codigoLivro, novaQtd);
            res.writeHead(200);
            res.end('Quantidade alterada');
        });
        return;
    }

    // Limpar carrinho inteiro
    if (partes[0] === 'api' && partes[1] === 'carrinho' && partes.length === 3 && req.method === 'DELETE') {
        const codigoCliente = parseInt(partes[2]);
        await limparCarrinho(codigoCliente);
        res.writeHead(200);
        res.end('Carrinho limpo');
        return;
    }
}

module.exports = carrinhoRoute;
