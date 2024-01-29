import {
  botonRegistro,
  botonLogin,
  loginUser,
  registroUser,
  checkNewUser,
  checkPass,
  checkMail} from "./eventos.js";

import {
  enviarToken} from "./helpers.js";

formRexistro.style.display = "none";
registroSpan.style.opacity = 0.5;

botonLogin();
botonRegistro();
registroUser();
loginUser();
checkNewUser();
checkPass();
checkMail();
enviarToken();