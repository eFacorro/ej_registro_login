const {
  insertarUsuario,
  comprobarLogin,
  comprobarUser,
  leerTodo,
  actualizarUsuario,
  borrarUsuario } = require("./funciones/funcMongo.js")
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
    dato.msg = "Sin imagen personalizada";
  }
  else {
    sampleFile = req.files.usuario;
    img = doc.user + req.files.usuario.name.slice(req.files.usuario.name.indexOf("."));
    uploadPath = staticImg + img;
    sampleFile.mv(uploadPath, function (err) {
      if (err) return res.status(500).send(err);
      dato.msg = "Imagen guardada";
    });
  }
  doc.img = img;
  dato.user = await insertarUsuario(doc) //puede ser buena idea que la imgen se llame por la id
  res.status(200).send(dato);
};

const loginUser = (req, res, next) => {
  comprobarLogin({user: req.body.user, pwd: req.body.pwd}, req, res, next)
}

const updateUser = (req, res) => {
  console.log("funciones ", req.body);
  actualizarUsuario(estructurarDatos(req.body));
}

const deleteUser = (req, res) => {
  borrarUsuario(req.body._id)
}

const mostrarPagina = (req, res) => {
  // console.log(req.body);
  // if (req.body.user === "admin"){
    res.sendFile("admin.html", { root: carpetaStatic });
  // } else {
  //   res.sendFile("perfil.html", { root: carpetaStatic });
  // }
  
}

const checkUser = (req, res) => {
  comprobarUser({user: req.body.user}, res);
}

function estructurarDatos(datos){
  for (let key in datos){
    if (datos[key] == ""){
      delete datos[key];
    }
  }
  // console.log(datos);
  return datos;
}

const LeerUsers = async (req,res) => {
  let users = await leerTodo();
  let result = {
    datos: users
  }
  res.send(result)
}

module.exports = {
  RexistroUser,
  loginUser,
  checkUser,
  mostrarPagina,
  LeerUsers,
  updateUser,
  deleteUser
};
