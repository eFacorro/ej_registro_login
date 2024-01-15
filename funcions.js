const {insertarUsuario} = require("./funciones/funcMongo.js")
const path = require("path");
const staticRoute2 = path.join(__dirname, "static\\imgs\\");// sistema en windows

const RexistroUser = (req, res) => {
  let sampleFile;
  let uploadPath;

  const doc = estructurarDatos(req.body)
  insertarUsuario(doc)
  
  if (!req.files || Object.keys(req.files).length === 0) {
    // return res.status(400).send("O ficheiro non foi actualizado.");
    let dato = {
      mensaxe: "Sin imagen personalizada"
    }
    res.status(200).send(dato);
  }
  else {
    sampleFile = req.files.usuario;
    uploadPath = staticRoute2 + doc.user + sampleFile.name.slice(sampleFile.name.indexOf("."));
    sampleFile.mv(uploadPath, function (err) {
      if (err) return res.status(500).send(err);
      let dato = {
        mensaxe: "Imagen guardada"
      }
      res.status(200).send(dato);
    });
  }
};

function estructurarDatos(datos){
  for (let key in datos){
    if (datos[key] == ""){
      delete datos[key];
    }
  }
  // console.log(datos);
  return datos;
}

module.exports = {
  RexistroUser,
  loginUser,
};
