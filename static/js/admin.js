import {
  cargarUsuario} from "./helpers.js";
  
import {
  checkNewUser,
  registroUser,
  eventoRecargar} from "./eventos.js"

cargarUsuario();
registroUser();
checkNewUser();
eventoRecargar();