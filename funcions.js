const {
  insertarUsuario,
  comprobarLogin,
  comprobarUser,
  leerTodo,
  actualizarUsuario,
  borrarUsuario } = require("./funciones/funcMongo.js");

const {
  crearToken,
  comprobarToken } = require("./funciones/funcJWT.js");

const fs = require('fs');

const path = require("path");
const staticImg = path.join(__dirname, "static\\imgs\\");// sistema en windows
const carpetaStatic = path.join(__dirname, "static\\");

const RexistroUser = async (req, res) => {
  let sampleFile;
  let img = "default.png";
  let uploadPath; 
  let dato;

  const doc = estructurarDatos(req.body);
  
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
  let user = await insertarUsuario(doc);
  // dato.user = await insertarUsuario(doc); //puede ser buena idea que la imgen se llame por la id
  dato.user = user;
  dato.token = req.token;    // si hay que añadir el token a la bbdd hay que modificar esto
  res.status(200).send(dato);
};

function borrarImg(req, res){
  if (req.body.img!= "default.png"){
    let imgPath = staticImg + req.body.img;
    fs.unlink(imgPath, (err) => {
      if (err) {
        throw err;
      }
      console.log(`imgen ${req.body.img} borrada`);
    });
  }
  res.send({msg: "hecho"})
}

const loginUser = (req, res, next) => {
  console.log("loginUser ",req.headers.authorization)
  // if(req.headers.authorization != "null"){
  //   console.log(comprobarToken(req, res));/// devuelte nombre de usuario o undefined si no coincide
  // }
  comprobarLogin(req, res, next)
}

const updateUser = (req, res, next) => {
  let sampleFile;
  let img = "default.png";
  let uploadPath; 
  let dato;
  
  if (!req.files || Object.keys(req.files).length === 0) {
    // return res.status(400).send("O ficheiro non foi actualizado.");
    dato = {
      msg : "Sin imagen personalizada"
    }
  }
  else {
    sampleFile = req.files.usuario;
    img = req.body.user + req.files.usuario.name.slice(req.files.usuario.name.indexOf("."));
    uploadPath = staticImg + img;
    sampleFile.mv(uploadPath, function (err) {
      if (err) return res.status(500).send(err);
      dato = {
        msg : "Imagen guardada"
      }
    });
  }
  req.body.img = img;
  actualizarUsuario(req, res, next, estructurarDatos(req.body));
}

const deleteUser = (req, res, next) => {
  console.log(req.body)
  borrarUsuario(req, res, next, req.body._id)
}

const mostrarPagina = async (req, res) => {
  const fs = require('node:fs/promises');
  if (req.body.admin){
    const userFile = await fs.readFile(carpetaStatic + "\admin.html", 'utf8');
    res.send({status: true, html: userFile, user: req.body, token: req.token, msg: "Admin"});
  } else {
    const userFile = await fs.readFile(carpetaStatic + "\perfil.html", 'utf8');
    res.send({status: true, html: userFile, user: req.body, token: req.token, msg: "Usuario y contraseña correctos"});
  } 
}

const checkUser = async (req, res) => {
  await comprobarUser({user: req.body.user}, res, true);
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
      // res.send("El usuario no existe");
      let userFile = await fs.readFile(carpetaStatic + "\\nouser.html", 'utf8');
      res.send(userFile);
    }
  }
}

const enviarToken = (req, res, next) => {
  crearToken(req, res, next);
}

const recibirToken = async (req, res) => {
  console.log("recibirToken", req.params);
  if(req.headers.authorization != "null"){
    let tokenInfo = comprobarToken(req, res);/// devuelte nombre de usuario o undefined si no coincide
    console.log("tokenInfo", tokenInfo);
    if (req.params.user == tokenInfo){
      console.log("tokenInfo recibirToken", tokenInfo);
      const perfil = await comprobarUser({user: tokenInfo}, res, false);
      req.body = perfil;
      mostrarPagina(req, res);
    } else{
      res.send({status: true, user:{user: req.params}, public: true});
    }
  } else{
    // res.send({status: false, user:{user: req.params}, public: true}); // asi solo puedes ver perfiles si estas registrado
    res.send({status: true, user:{user: req.params}, public: true});
  }
}

const checkToken = async (req, res) => {
  console.log("checkToken", req.headers.authorization);
  if(req.headers.authorization != "null"){
    console.log("dentro")
    let tokenInfo = await comprobarToken(req, res);/// devuelte nombre de usuario o undefined si no coincide
    console.log("tokenInfo checkToken", tokenInfo);
    res.send({user: tokenInfo}); 
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
  recibirToken,
  borrarImg,
  checkToken
};
