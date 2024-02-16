const {
  insertarUsuario,
  comprobarLogin,
  comprobarUser,
  leerTodo,
  actualizarUsuario,
  borrarUsuario,
  emailVerificado,
  comprobarMail,
  saveNewPass } = require("./funciones/funcMongo.js");

const {
  crearToken,
  comprobarToken,
  jwtToken } = require("./funciones/funcJWT.js");
    
const {
  emailVerificacion,
  emailPass } = require("./funciones/funcNodemailer.js");

const fs = require('fs');

const path = require("path");
const staticImg = path.join(__dirname, "static/imgs/");
const carpetaStatic = path.join(__dirname, "static/");

const RexistroUser = async (req, res) => {
  let sampleFile;
  let img = "default.png";
  let uploadPath; 
  let dato;

  const doc = estructurarDatos(req.body);
  
  if (!req.files || Object.keys(req.files).length === 0) {
    dato = {
      msg : "Sin imagen personalizada"
    }
  }
  else {
    sampleFile = req.files.usuario;
    img = doc.user + req.files.usuario.name.slice(req.files.usuario.name.indexOf("."));
    uploadPath = staticImg + img;
    sampleFile.mv(uploadPath, function (err) {
      if (err) {
        return res.status(500).send(err);
      } else {
        console.log("Imagen guardada")
        dato = {
          msg : "Imagen guardada"
        }
      }
    });
  }
  doc.img = img;
  let user = await insertarUsuario(doc);
  // dato.user = await insertarUsuario(doc); //puede ser buena idea que la imgen se llame por la id
  dato.user = user;
  dato.token = req.token;    // si hay que añadir el token a la bbdd hay que modificar esto
  const fs = require('node:fs/promises');
  const userFile = await fs.readFile(carpetaStatic + "/verifica.html", 'utf8');
  dato.html = userFile;
  console.log("mail", dato.user.mail);
  emailVerificacion(dato.user.mail);
  res.status(200).send(dato);
};

function borrarImg(req, res){
  if (req.body.img!= "default.png"){
    let imgPath = staticImg + req.body.img;
    fs.unlink(imgPath, (err) => {
      if (err) {
        console.log("borrar imagen",err)
      }
      console.log(`imgen ${req.body.img} borrada`);
    });
  }
  res.send({msg: "hecho"})
}

const loginUser = async (req, res, next) => {
  console.log("loginUser ",req.headers.authorization);
  await comprobarLogin(req, res, next);
}

const updateUser = async (req, res, next) => {
  let sampleFile;
  let img = "default.png";
  let uploadPath; 
  let dato;
  
  if (!req.files || Object.keys(req.files).length === 0) {
    dato = {
      msg : "Sin imagen personalizada"
    }
  }
  else {
    sampleFile = req.files.usuario;
    img = req.body.user + req.files.usuario.name.slice(req.files.usuario.name.indexOf("."));
    uploadPath = staticImg + img;
    sampleFile.mv(uploadPath, function (err) {
      if (err) {
        return res.status(500).send(err);
      } else {
        console.log("Imagen guardada");
        dato = {
          msg : "Imagen guardada"
        }
      }
    });
  }
  req.body.img = img;
  await actualizarUsuario(req, res, next, estructurarDatos(req.body));
}

const deleteUser = async (req, res, next) => {
  await borrarUsuario(req, res, next, req.body._id)
}

const mostrarPagina = async (req, res) => {
  const fs = require('node:fs/promises');
  if (req.body.admin){
    const userFile = await fs.readFile(carpetaStatic + "/admin.html", 'utf8');
    res.send({status: true, html: userFile, user: req.body, token: req.token, msg: "Admin"});
  } else {
    const userFile = await fs.readFile(carpetaStatic + "/perfil.html", 'utf8');
    res.send({status: true, html: userFile, user: req.body, token: req.token, msg: "Usuario y contraseña correctos"});
  }
}

const checkUser = async (req, res) => {
  await comprobarUser(req.body.user, res, true);
}

const checkMail = async (req, res) => {
  await comprobarMail(req.body.mail, res, true);
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
    const perfil = await comprobarUser(req.params.user, res, false);
      if (perfil != undefined){
        delete perfil.pwd
        delete perfil.mail
        if(perfil.mailVerificado){
          let userFile = await fs.readFile(carpetaStatic + "/buscador.html", 'utf8');
          userFile = userFile.replace("USER", JSON.stringify(perfil));
          userFile = userFile.replace("Buscador", perfil.user);
          res.send(userFile);
        } else{
          const userFile = await fs.readFile(carpetaStatic + "/noverficado.html", 'utf8');
          res.send(userFile);
        }
      } else {
        console.log("El usuario no existe");
        let userFile = await fs.readFile(carpetaStatic + "/nouser.html", 'utf8');
        res.send(userFile);
      }
  }
}

const enviarToken = async (req, res, next) => {
  let datos = {user: req.body.user, pwd: req.body.pwd};
  await crearToken(req, res, next, datos);
}

const recibirToken = async (req, res) => {
  console.log("recibirToken", req.params);
  if(req.headers.authorization != "null"){
    let tokenInfo = await comprobarToken(req.headers.authorization).user;
    if (req.params.user == tokenInfo){
      const perfil = await comprobarUser(tokenInfo, res, false);
      req.body = perfil;
      await mostrarPagina(req, res);
    } else{
      res.send({status: true, user:{user: req.params}, public: true});
    }
  } else{
    res.send({status: true, user:{user: req.params}, public: true});
  }
}

const checkToken = async (req, res) => {
  console.log("checkToken", req.headers.authorization);
  if(req.headers.authorization != "null"){
    let tokenInfo = await comprobarToken(req.headers.authorization).user;
    res.send({user: tokenInfo}); 
  }
}

async function verifiMail(req, res){
  let mail = await comprobarToken(req.params.token).mail;
  console.log("verifiMail", mail);
  if(mail != ""){
    let result = await emailVerificado(mail);
    let datos = {user: result.user, pwd: result.pwd};
    result = jwtToken(datos);
    console.log("jwt")
    res.send(`<script>localStorage.setItem("token", "${result}");location.replace("../");</script>`)
  }
}

async function verifiPass(req, res){
  const fs = require('node:fs/promises');
  let mail = await comprobarToken(req.params.token).mail;
  console.log("verifiPass", mail);
  if(mail != ""){
    await emailVerificado(mail);
    let userFile = await fs.readFile(carpetaStatic + "/newpass.html", 'utf8');
    userFile = userFile.replace("token", req.params.token);
    res.send(userFile);
  }
}


async function changePass(req, res){
  let mail = await comprobarToken(req.headers.authorization).mail;
  console.log("changePass", req.body.pwd);
  if(mail != ""){
    let result = await saveNewPass(mail, req.body.pwd);
    let datos = {user: result.user, pwd: result.pwd};
    result = jwtToken(datos);
    res.status(200).send({token: result})
  }
}

async function resetPass(req, res){
  const fs = require('node:fs/promises');
  const userFile = await fs.readFile(carpetaStatic + "/recuperar.html", 'utf8');
  res.send(userFile);
}

async function resetMail(req, res){
  console.log(req.body.mail)
  emailPass(req.body.mail);
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
  checkToken,
  verifiMail,
  checkMail,
  resetPass,
  resetMail,
  verifiPass,
  changePass,
  ip
};
