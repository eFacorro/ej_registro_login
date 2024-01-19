import {
  cargarUsuario} from "./helpers.js";
  
import {
  checkNewUser,
  registroUser,
  eventoRecargar,
  checkPass} from "./eventos.js"

cargarUsuario();
registroUser();
checkNewUser();
eventoRecargar();
checkPass();
// console.log('estou na carga?')
// window.addEventListener("load", function (event) {
//   console.log("'Todos los recursos terminaron de cargar!");
// });
// function ready() {
//   console.log("está dende a función")
// }

// document.addEventListener("DOMContentLoaded", ready);