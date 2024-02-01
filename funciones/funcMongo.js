const {
  MongoClient,
  ObjectId,
  ServerApiVersion } = require("mongodb");

const { emailVerificacion } = require("./funcNodemailer.js");

let cooldown;
const time = 500;

const url = process.env.URLMONGO;
const database = process.env.BBDD;
const coleccion = process.env.COLECCION;
const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function insertarUsuario(usuario) {
  try {
    clearTimeout(cooldown);
    await client.connect();
    const db = client.db(database);
    const coll = db.collection(coleccion);
    const result = await coll.insertOne(usuario);
    let respuesta = usuario;
    respuesta._id = result.insertedId;
    return respuesta
  } finally {
    // await client.close();
    cooldown = setTimeout(timerClose,time);
  }
}

async function comprobarLogin(req, res, next) {
  try {
    clearTimeout(cooldown);
    await client.connect();
    const db = client.db(database);
    const coll = db.collection(coleccion);
    const result = coll.find(req.body);
    for await(const key of result){
      if (key.pwd === req.body.pwd){
        req.body = key;
        if (key.admin === true){
          next();
          return
        }
      }
      console.log("Usuario y contraseña correctos");
      next();
      return
    }
    console.log("usuario y/o contraseña incorrectos");
    res.send({status: false, msg: "Usuario y/o contraseña incorrectos"});
  } finally {
    // await client.close();
    cooldown = setTimeout(timerClose,time);
  }
}

async function comprobarUser(usuario, res, check){
  try {
    clearTimeout(cooldown);
    await client.connect();
    const db = client.db(database);
    const coll = db.collection(coleccion);
    const busqueda = {user: usuario};
    const result = coll.find(busqueda);
    for await(const key of result){
      if (key.user === usuario){
        console.log("ya existe");
        if(check){
          res.send({status: true, msg: "El usuario ya existe"});
          return
        } else {
          return key
        }
      }
    }
    if(check){
      res.send({status: false, msg: "El usuario es nuevo"});
    }
  } finally {
    // await client.close();
    cooldown = setTimeout(timerClose,time);
  }
}

async function comprobarMail(mail, res, check){
  try {
    clearTimeout(cooldown);
    await client.connect();
    const db = client.db(database);
    const coll = db.collection(coleccion);
    const busqueda = {mail: mail};
    const result = coll.find(busqueda);
    for await(const key of result){
      if (key.mail === mail){
        console.log("ya existe");
        if(check){
          res.send({status: true, msg: "El email ya esta rigistrado"});
          return
        } else {
          return key
        }
      }
    }
    if(check){
      res.send({status: false, msg: "El email es nuevo"});
    }
  } finally {
    // await client.close();
    cooldown = setTimeout(timerClose,time);
  }
}

async function leerTodo() {
  try {
    clearTimeout(cooldown);
    await client.connect();
    const db = client.db(database);
    const coll = db.collection(coleccion);
    const result = coll.find({})
    let datosUsers = []
    for await(const documento of result){
      datosUsers.push(documento);
    }
    return datosUsers
  } finally {
    // await client.close();
    cooldown = setTimeout(timerClose,time);
  }
}

async function actualizarUsuario(req, res, next, datos) {
  let old;
  try {
    clearTimeout(cooldown);
    await client.connect();
    const db = client.db(database);
    const coll = db.collection(coleccion);
    datos._id = new ObjectId(datos._id);
    const filtro ={
        _id: datos._id
    }
    old = await coll.findOne(filtro);
    delete datos.usuario;
    const dato = {$set: datos};
    const reset = {$unset: {nombre: "", primerApellido: "", segundoApellido: "", fechaNacimiento: ""}}
    const resultReset = await coll.updateOne(filtro,reset);
    console.log(resultReset);
    if(old.mail != datos.mail){
      datos.mailVerificado = false;
      emailVerificacion(datos.mail);
    }
    const result = await coll.updateOne(filtro,dato);
    console.log(result);
  } finally {
    // await client.close();
    cooldown = setTimeout(timerClose,time);
    req.body.img = old.img;
    next();
  }
}
 
async function borrarUsuario(req, res, next, id) {
  try {
    clearTimeout(cooldown);
    await client.connect();
    const db = client.db(database);
    const coll = db.collection(coleccion);
    const dato ={
        _id:new ObjectId(id)
    }
    let result = await coll.findOne(dato);
    req.body.img = result.img;
    result = await coll.deleteOne(dato);
  } finally {
    // await client.close();
    cooldown = setTimeout(timerClose,time);
    next();
  }
}

async function emailVerificado(mail){
  try {
    clearTimeout(cooldown);
    await client.connect();
    const db = client.db(database);
    const coll = db.collection(coleccion);
    const filtro ={
        mail: mail
    }
    const dato = {$set: {mailVerificado: true}};
    let result = await coll.updateOne(filtro, dato);
    console.log(result)
    result = await coll.findOne(filtro);
    return result
  } finally {
    // await client.close();
    cooldown = setTimeout(timerClose,time);
  }
}

async function saveNewPass(mail, pwd){
  try {
    clearTimeout(cooldown);
    await client.connect();
    const db = client.db(database);
    const coll = db.collection(coleccion);
    const filtro ={
        mail: mail
    }
    const dato = {$set: {pwd: pwd}};
    let result = await coll.updateOne(filtro, dato);
    console.log(result);
    result = await coll.findOne(filtro);
    return result
  } finally {
    // await client.close();
    cooldown = setTimeout(timerClose,time);
  }
}

async function timerClose(){
  await client.close();
  console.log("mongoCerrado", time)
}

module.exports = {
  insertarUsuario,
  comprobarLogin,
  comprobarUser,
  leerTodo,
  actualizarUsuario,
  borrarUsuario,
  emailVerificado,
  comprobarMail,
  saveNewPass
}