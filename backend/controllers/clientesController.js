const { conectar } = require('../db/conexao');

// Criar cliente
async function criarCliente(cliente) {
    const { db, client } = await conectar();
    const codigo = await gerarProximoCodigo();
    cliente.codigo = codigo;

    await db.collection('clientes').insertOne(cliente);
    client.close();
}

// Gerar próximo código automático
async function gerarProximoCodigo() {
    const { db, client } = await conectar();
    const ultimo = await db.collection('clientes')
        .find()
        .sort({ codigo: -1 })
        .limit(1)
        .toArray();
    client.close();
    return ultimo.length > 0 ? ultimo[0].codigo + 1 : 1;
}

// Atualizar cliente
async function atualizarCliente(codigo, dados) {
    const { db, client } = await conectar();
    await db.collection('clientes').updateOne(
        { codigo: parseInt(codigo) },
        { $set: dados }
    );
    client.close();
}

// Deletar cliente
async function deletarCliente(codigo) {
    const { db, client } = await conectar();
    await db.collection('clientes').deleteOne({ codigo: parseInt(codigo) });
    client.close();
}

// Listar todos os clientes
async function listarClientes() {
    const { db, client } = await conectar();
    const clientes = await db.collection('clientes').find().toArray();
    client.close();
    return clientes;
}

// Buscar cliente por código
async function buscarCliente(codigo) {
    const { db, client } = await conectar();
    const cliente = await db.collection('clientes').findOne({ codigo: parseInt(codigo) });
    client.close();
    return cliente;
}

// Exportando as funções
module.exports = {
    listarClientes,
    buscarCliente,
    criarCliente,
    atualizarCliente,
    deletarCliente
};
