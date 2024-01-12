const {insertarUsuario} = require("./funcMongo.js")
const path = require("path");
const staticRoute2 = path.join(__dirname, "static\\imags\\");// sistema en windows

const RexistroUser = (req, res) => {
  let sampleFile;
  let uploadPath;
  console.log('req.body: ',req.body)
  const doc ={name: req.body.user, pwd: req.body.pwd};
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("O ficheiro non foi actualizado.");
  }
  insertarUsuario(doc)
  sampleFile = req.files.usuario;
  uploadPath = staticRoute2 + sampleFile.name;
  
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);
    let dato = {
      mensaxe: "Usuario rexistrado!"
    }
    res.send(dato);
  });
};

module.exports = {
  RexistroUser,
};
