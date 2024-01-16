const {MongoClient} = require("mongodb")
const url = process.env.URLMONGO;
const database = 'proba1'
const client = new MongoClient(url)
const coleccion = "usuarios";

async function insertarUsuario(usuario) {
  try {
    await client.connect();
      const db = client.db(database);
      const coll = db.collection(coleccion);
      const result = await coll.insertOne(usuario);
      console.log('en insertar datos: ',result);
  } finally {
    await client.close();
  }
}

async function buscarUsuario(usuario) {
  try {
    await client.connect();
    const db = client.db(database);
    const coll = db.collection(coleccion);
    
    const result = coll.find(usuario);//(usuario);

    for await(const key of result){
      if (key.user === usuario.user && key.pwd === usuario.pwd){
        if (key.admin === true){
          console.log("admin");
        }
        console.log("match");
      }
    }
  
  } finally {
    await client.close();
  }
}

module.exports = {
  insertarUsuario,
  buscarUsuario
}