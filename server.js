require('dotenv').config()
const { 
  RexistroUser,
  loginUser,
  checkUser,
  mostrarPagina,
  LeerUsers,
  updateUsuario } = require("./funcions.js");
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

app.post("/rexistro", RexistroUser);
app.post("/login", loginUser, mostrarPagina);
app.post("/check", checkUser);
app.post("/update", updateUsuario);
app.get("/leerTodo", LeerUsers);
app.get("/admin", mostrarPagina);
app.get("/perfil");

app.listen(3000, function () {
  console.log("Server running");
});
