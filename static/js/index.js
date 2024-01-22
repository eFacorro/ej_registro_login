import {
  botonRegistro,
  botonLogin,
  loginUser,
  registroUser,
  checkNewUser,
  checkPass} from "./eventos.js";

formRexistro.style.display = "none";
registroSpan.style.opacity = 0.5;

botonLogin();
botonRegistro();
registroUser();
loginUser();
checkNewUser();
checkPass(); 