require('dotenv').config()
const { 
  RexistroUser,
  loginUser,
  checkUser,
  mostrarPagina,
  LeerUsers,
  updateUser,
  deleteUser,
  checkPerfil,
  recibirToken,
  enviarToken,
  borrarImg } = require("./funcions.js");
const express = require("express");
const path = require("path");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());

const carpetaStatic = path.join(__dirname, "static");

app.use(express.static(carpetaStatic));

app.post("/rexistro", enviarToken, RexistroUser);
app.post("/login", loginUser, enviarToken, mostrarPagina);
app.post("/check", checkUser);
app.post("/update", updateUser, borrarImg);
app.post("/delete", deleteUser, borrarImg);
app.get("/leerTodo", LeerUsers);
app.get("/:user", checkPerfil);
app.post("/:user", recibirToken);

app.listen(3000, function () {
  console.log("Server running");
});
