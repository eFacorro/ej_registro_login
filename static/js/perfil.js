import {
  creoTarjetaPublica,
  comunicandoServer,
  configurador } from "./helpers.js";

async function perfil(){
  let insertHtml = document.querySelector(".lista-usuarios");
  let usuario = JSON.parse(insertHtml.innerText);
  insertHtml.innerText = "";
  creoTarjetaPublica(usuario);
  let token = localStorage.getItem('token');
  let datos = {
    endpoint: "/" + usuario.user,
    tipoComunicacion: {method: "POST", body: {"user": usuario.user}, headers: {"authorization": token}}
  };
  let result = await comunicandoServer(datos);
  configurador(result);
}

setTimeout(perfil, 10);
