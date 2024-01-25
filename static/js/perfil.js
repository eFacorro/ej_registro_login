import {
  creoTarjetaPublica,
  comunicandoServer,
  configurador } from "./helpers.js";

let insertHtml = document.querySelector(".lista-usuarios");
let usuario = JSON.parse(insertHtml.innerText);
insertHtml.innerText = "";
console.log(usuario);
creoTarjetaPublica(usuario);
let token = localStorage.getItem('token');
let datos = {
  endpoint: "/" + usuario.user,
  tipoComunicacion: {method: "POST", body: {"user": usuario.user}, headers: {"authorization": token}}
};
let result = await comunicandoServer(datos);
console.log("flex ", result)
configurador(result);
