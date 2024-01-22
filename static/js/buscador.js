import {
    creoTarjetaPublica,
    cargarUsuario } from "./helpers.js";
  
  import {
    registroUser,
    checkNewUser,
    eventoRecargar, 
    checkPass } from "./eventos.js";
  
  let datos = document.querySelector(".lista-usuarios");
  let usuario = JSON.parse(datos.innerText);
  datos.innerText = "";
  datos.style.display = "flex";
  console.log(usuario);
  creoTarjetaPublica(usuario);
  let token = localStorage.getItem('token');
  let response = await fetch("/" + usuario.user, {method: "POST", body: {"user": usuario.user}, headers: {"authorization": token} });
  let result = await response.json();
  if (result.status){
    if(result.user.admin){
      document.querySelector("html").innerHTML = result.html;
      cargarUsuario();
      registroUser();
      checkNewUser();
      eventoRecargar();
      checkPass();
    } else {
      document.querySelector("html").innerHTML = result.html;
      creoTarjeta(result.user);
    }
  } else{
    let ref = document.querySelector("#formLogin > span");
    ref.innerText = result.msg;
    ref.style.display = "block";
  }