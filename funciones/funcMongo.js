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

async function comprobarLogin(usuario, req, res, next) {
  try {
    await client.connect();
    const db = client.db(database);
    const coll = db.collection(coleccion);
    
    const result = coll.find(usuario);//(usuario);

    for await(const key of result){
      if (key.user === usuario.user && key.pwd === usuario.pwd){
        if (key.admin === true){
          console.log("admin");
          res.send({status: true, msg: "Admin"});
          next();
          return
        }
        console.log("usuario y contraseña correctos");
        res.send({status: true, msg: "Usuario y contraseña correctos"});
        next();
        return
      }
    }
    
    console.log("usuario y/o contraseña incorrectos");
    res.send({status: false, msg: "Usuario y/o contraseña incorrectos"});
  
  } finally {
    await client.close();
  }
}

async function comprobarUser(usuario, res){
  try {
    await client.connect();
    const db = client.db(database);
    const coll = db.collection(coleccion);
    const busqueda = {user: usuario.user}
    const result = coll.find(busqueda);//(usuario);

    for await(const key of result){
      if (key.user === usuario.user){
        console.log("ya existe");
        res.send({status: true, msg: "El usuario ya existe"});
        return
      }
    }
    
    res.send({status: false, msg: "El usuario es nuevo"});
  
  } finally {
    await client.close();
  }
}

async function leerTodo() {
  try {
    await client.connect();
    const db = client.db(database);
    const coll = db.collection(coleccion);
    const result = coll.find({})
    
    let datosUsers = []
    
    for await(const documento of result){
      datosUsers.push(documento)      
    }
    return datosUsers
  } finally {
    await client.close();
  }
}


module.exports = {
  insertarUsuario,
  comprobarLogin,
  comprobarUser,
  leerTodo
}