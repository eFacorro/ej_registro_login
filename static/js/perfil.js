import {
  creoTarjetaPublica,
  comunicandoServer,
  configurador } from "./helpers.js";

let html = document.querySelector(".lista-usuarios");
let usuario = JSON.parse(html.innerText);
html.innerText = "";
html.style.display = "flex";
console.log(usuario);
creoTarjetaPublica(usuario);
let token = localStorage.getItem('token');
let datos = {
  endpoint: "/" + usuario.user,
  tipoComunicacion: {method: "POST", body: {"user": usuario.user}, headers: {"authorization": token}}
};
let result = await comunicandoServer(datos);
configurador(result);