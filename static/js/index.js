import {
  botonRegistro,
  botonLogin,
  loginUser,
  registroUser,
  checkNewUser} from "./eventos.js";

formRexistro.style.display = "none";
registroSpan.style.opacity = 0.5;
// formLogin.style.display = "none";

botonLogin();

botonRegistro();

registroUser();

loginUser();

checkNewUser();