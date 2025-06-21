const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'livronline';
const client = new MongoClient(url);

async function conectar() {
    if (!client.topology?.isConnected()) {
        await client.connect();
        console.log('✅ Conectado ao MongoDB');
    }
    const db = client.db(dbName);
    return { db, client };
}

module.exports = { conectar };