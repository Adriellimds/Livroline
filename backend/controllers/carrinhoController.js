const { conectar } = require('../db/conexao');

// Adicionar ou atualizar vários itens no carrinho
async function adicionarItensAoCarrinho(codigoCliente, itensNovos) {
    const { db, client } = await conectar();

    const carrinho = await db.collection('carrinhos').findOne({ codigoCliente });

    if (!carrinho) {
        await db.collection('carrinhos').insertOne({
            codigoCliente,
            itens: itensNovos
        });
    } else {
        const itensAtualizados = [...carrinho.itens];

        itensNovos.forEach(itemNovo => {
            const existente = itensAtualizados.find(i => i.codigoLivro === itemNovo.codigoLivro);

            if (existente) {
                existente.quantidade += itemNovo.quantidade;
            } else {
                itensAtualizados.push(itemNovo);
            }
        });

        await db.collection('carrinhos').updateOne(
            { codigoCliente },
            { $set: { itens: itensAtualizados } }
        );
    }

    client.close();
}

// Listar itens do carrinho
async function listarCarrinho(codigoCliente) {
    const { db, client } = await conectar();
    const carrinho = await db.collection('carrinhos').findOne({ codigoCliente });
    client.close();
    return carrinho;
}

// Remover um item específico
async function removerItem(codigoCliente, codigoLivro) {
    const { db, client } = await conectar();

    await db.collection('carrinhos').updateOne(
        { codigoCliente },
        { $pull: { itens: { codigoLivro } } }
    );

    client.close();
}

// Alterar quantidade de um item
async function alterarQuantidade(codigoCliente, codigoLivro, novaQtd) {
    const { db, client } = await conectar();

    await db.collection('carrinhos').updateOne(
        { codigoCliente, "itens.codigoLivro": codigoLivro },
        { $set: { "itens.$.quantidade": novaQtd } }
    );

    client.close();
}

// Limpar carrinho inteiro
async function limparCarrinho(codigoCliente) {
    const { db, client } = await conectar();
    await db.collection('carrinhos').deleteOne({ codigoCliente });
    client.close();
}

module.exports = {
    adicionarItensAoCarrinho,
    listarCarrinho,
    removerItem,
    alterarQuantidade,
    limparCarrinho
};
