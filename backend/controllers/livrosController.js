const { conectar } = require('../db/conexao');

// Criar livro com código
async function criarLivro(livro) {
    const { db } = await conectar();

    const codigo = await gerarProximoCodigo();
    livro.codigo = codigo;

    await db.collection('livros').insertOne(livro);
}

// Gerar próximo código de livro automaticamente
async function gerarProximoCodigo() {
    const { db } = await conectar();
    const ultimo = await db.collection('livros')
        .find()
        .sort({ codigo: -1 })
        .limit(1)
        .toArray();
    return ultimo.length > 0 ? ultimo[0].codigo + 1 : 1;
}

// Atualizar livro pelo código
async function atualizarLivro(codigo, dados) {
    const { db } = await conectar();
    await db.collection('livros').updateOne(
        { codigo: parseInt(codigo) },
        { $set: dados }
    );
}

// Deletar livro pelo código
async function deletarLivro(codigo) {
    const { db } = await conectar();
    await db.collection('livros').deleteOne({ codigo: parseInt(codigo) });
}

// Listar todos os livros
async function listarLivros() {
    const { db } = await conectar();
    return await db.collection('livros').find().toArray();
}

// Buscar livro pelo código
async function buscarLivro(codigo) {
    const { db } = await conectar();
    return await db.collection('livros').findOne({ codigo: parseInt(codigo) });
}

// Exportando todas as funções
module.exports = {
    listarLivros,
    buscarLivro,
    criarLivro,
    atualizarLivro,
    deletarLivro
};
