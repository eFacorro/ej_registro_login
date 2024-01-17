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