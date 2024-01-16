import {
  comunicandoServer,
  creoTarjeta} from "./helpers.js";
  
import {
  checkNewUser,
  registroUser} from "./eventos.js"

let datos = {
  endpoint: '/leerTodo'
}
let usuarios = await comunicandoServer(datos);
console.log(usuarios);
for(let usuario of usuarios.datos){
  creoTarjeta(usuario);
}

registroUser();
checkNewUser();