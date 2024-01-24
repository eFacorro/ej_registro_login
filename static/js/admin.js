import {
  cargarUsuario} from "./helpers.js";
  
import {
  checkNewUser,
  registroUser,
  eventoRecargar,
  checkPass,
  salir} from "./eventos.js"

cargarUsuario();
registroUser();
checkNewUser();
eventoRecargar();
checkPass();
salir();