import {
  creoTarjetaPublica} from "./helpers.js";

let datos = document.querySelector(".lista-usuarios")
let usuario = JSON.parse(datos.innerText);
datos.innerText = "";
datos.style.display = "flex";
console.log(usuario)
creoTarjetaPublica(usuario);