const url = require('url');
const {
    listarClientes,
    buscarCliente,
    criarCliente,
    atualizarCliente,
    deletarCliente
} = require('../controllers/clientesController');

async function clientesRoute(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathParts = parsedUrl.pathname.split('/').filter(p => p);

    // GET /api/clientes
    if (req.method === 'GET' && pathParts.length === 2) {
        const clientes = await listarClientes();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(clientes));
        return;
    }

    // GET /api/clientes/:codigo
    if (req.method === 'GET' && pathParts.length === 3) {
        const codigo = parseInt(pathParts[2]);
        const cliente = await buscarCliente(codigo);
        if (cliente) {
            const resposta = {
                codigo: cliente.codigo,
                nome: cliente.nome,
                cpf: cliente.cpf,
                regiao: cliente.regiao
            };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(resposta));
        } else {
            res.writeHead(404);
            res.end('Cliente não encontrado');
        }
        return;
    }

    // POST /api/clientes
    if (req.method === 'POST' && pathParts.length === 2) {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            const dados = JSON.parse(body);
            await criarCliente(dados);
            res.writeHead(201);
            res.end('Cliente cadastrado');
        });
        return;
    }

    // PUT /api/clientes/:codigo
    if (req.method === 'PUT' && pathParts.length === 3) {
        const codigo = parseInt(pathParts[2]);
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            const dados = JSON.parse(body);
            await atualizarCliente(codigo, dados);
            res.writeHead(200);
            res.end('Cliente atualizado');
        });
        return;
    }

    // DELETE /api/clientes/:codigo
    if (req.method === 'DELETE' && pathParts.length === 3) {
        const codigo = parseInt(pathParts[2]);
        await deletarCliente(codigo);
        res.writeHead(200);
        res.end('Cliente deletado');
        return;
    }
}

module.exports = clientesRoute;
