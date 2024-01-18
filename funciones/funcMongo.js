const {
  MongoClient,
  ObjectId} = require("mongodb")
const url = process.env.URLMONGO;
const database = process.env.BBDD;
const coleccion = process.env.COLECCION;
const client = new MongoClient(url);

async function insertarUsuario(usuario) {
  try {
    await client.connect();
      const db = client.db(database);
      const coll = db.collection(coleccion);
      const result = await coll.insertOne(usuario);
      console.log('en insertar datos: ',result);
      let respuesta = usuario;
      respuesta._id = result.insertedId;
      return respuesta
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
          req.body.admin = key.admin;
          next();
          return
        }
        console.log("usuario y contraseña correctos");
        res.status(401).send({status: true, msg: "Usuario y contraseña correctos"});
        // next();
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

async function actualizarUsuario(datos) {
  try {
    console.log('Estou en actualizarUsuario: ', datos)
    await client.connect();
    const db = client.db(database);
    const coll = db.collection(coleccion);
    datos._id = new ObjectId(datos._id);
    console.log(datos._id);
    const filtro ={
        _id: datos._id
    }
    const dato = {$set: datos};
    const reset = {$unset: {user:"", pwd: "", nombre: "", primerApellido: "", segundoApellido: "", fechaNacimiento: ""}}
    const resultReset = await coll.updateOne(filtro,reset);
    console.log(resultReset);
    const result = await coll.updateOne(filtro,dato);
    console.log(result);
  } finally {
    await client.close();
  }
}

async function borrarUsuario(id) {
  try {
    console.log('Estou en BorrarUsuario: ',id)
    await client.connect();
      const db = client.db(database);
      const coll = db.collection(coleccion);
      const dato ={
          _id:new ObjectId(id)
      }
      const result = await coll.deleteOne(dato);
    console.log(result)
  } finally {
    await client.close();
   
  }
}

module.exports = {
  insertarUsuario,
  comprobarLogin,
  comprobarUser,
  leerTodo,
  actualizarUsuario,
  borrarUsuario
}