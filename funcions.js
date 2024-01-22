
const {
  insertarUsuario,
  comprobarLogin,
  comprobarUser,
  leerTodo,
  actualizarUsuario,
  borrarUsuario } = require("./funciones/funcMongo.js");
  const {
    crearToken,
    comprobarToken } = require("./funciones/funcJWT.js")
const path = require("path");
const staticImg = path.join(__dirname, "static\\imgs\\");// sistema en windows
const carpetaStatic = path.join(__dirname, "static\\");

const RexistroUser = async (req, res) => {
  let sampleFile;
  let img = "default.png";
  let uploadPath;
  let dato;

  const doc = estructurarDatos(req.body)
  
  if (!req.files || Object.keys(req.files).length === 0) {
    // return res.status(400).send("O ficheiro non foi actualizado.");
    dato = {
      msg : "Sin imagen personalizada"
    }
  }
  else {
    sampleFile = req.files.usuario;
    img = doc.user + req.files.usuario.name.slice(req.files.usuario.name.indexOf("."));
    uploadPath = staticImg + img;
    sampleFile.mv(uploadPath, function (err) {
      if (err) return res.status(500).send(err);
      dato = {
        msg : "Imagen guardada"
      }
    });
  }
  doc.img = img;
  dato.user = await insertarUsuario(doc) //puede ser buena idea que la imgen se llame por la id
  dato.token = req.token;
  res.status(200).send(dato);
};

const loginUser = (req, res, next) => {
  console.log("loginUser ",req.headers.authorization)
  if(req.headers.authorization != "null"){
    console.log(comprobarToken(req, res));/// devuelte nombre de usuario o undefined si no coincide
  }
  comprobarLogin(req, res, next)
}

const updateUser = (req, res) => {
  actualizarUsuario(estructurarDatos(req.body));
}

const deleteUser = (req, res) => {
  borrarUsuario(req.body._id)
}

const mostrarPagina = async (req, res) => {
  const fs = require('node:fs/promises');
  if (req.body.admin){
    const userFile = await fs.readFile(carpetaStatic + "\admin.html", 'utf8');
    res.send({status: true, html: userFile, user: req.body, token: req.token, msg: "Admin"});
  } else {
    const userFile = await fs.readFile(carpetaStatic + "\perfil.html", 'utf8');
    res.send({status: true, html: userFile, user: req.body, token: req.token, msg: "Usuario contraseña incorrectos"});
  } 
}

const checkUser = (req, res) => {
  comprobarUser({user: req.body.user}, res, true);
}

function estructurarDatos(datos){
  for (let key in datos){
    if (datos[key] == ""){
      delete datos[key];
    }
  }
  return datos;
}

const LeerUsers = async (req,res) => {
  let users = await leerTodo();
  let result = {
    datos: users
  }
  res.send(result)
}

const checkPerfil = async (req, res) => {
  if(req.params.user != "favicon.ico"){
    const fs = require('node:fs/promises');
    const perfil = await comprobarUser({user: req.params.user}, res, false);
    if (perfil != undefined){
      delete perfil.pwd
      let userFile = await fs.readFile(carpetaStatic + "\\buscador.html", 'utf8');
      // userFile = userFile.replace("USER", perfil.user);
      userFile = userFile.replace("USER", JSON.stringify(perfil));
      userFile = userFile.replace("Buscador", perfil.user);
      res.send(userFile);
    } else {
      console.log("El usuario no existe");
      res.send("El usuario no existe");
    }
  }
}

const enviarToken = (req, res, next) => {
  crearToken(req, res, next)
}

const recibirToken = async (req, res) => {
  console.log("recibirToken", req.params);
  if(req.headers.authorization != "null"){
    let tokenInfo = comprobarToken(req, res);/// devuelte nombre de usuario o undefined si no coincide
    console.log("tokenInfo", tokenInfo);
    if (req.params.user == tokenInfo){
      console.log("tokenInfo", tokenInfo);
      const perfil = await comprobarUser({user: tokenInfo}, res, false);
      req.body = perfil;
      mostrarPagina(req, res);
    }
  }
}
 
module.exports = {
  RexistroUser,
  loginUser,
  checkUser,
  mostrarPagina,
  LeerUsers,
  updateUser,
  deleteUser,
  checkPerfil,
  enviarToken,
  recibirToken
};
