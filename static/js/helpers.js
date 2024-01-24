// import { enviarToken } from "../../funcions.js";
import { 
  eventoEditar,
  eventoGuardar,
  eventoBorrar } from "./eventos.js"

const comunicandoServer = async (datos)=>{
  let response;
  if(datos.tipoComunicacion !== undefined){
      console.log('entra en POST',datos.tipoComunicacion)
      response = await fetch(datos.endpoint,datos.tipoComunicacion);//'POST'
  }else{
      response = await fetch(datos.endpoint);// 'GET'
  }
  let resposta = await response.json();
  return resposta
}

function creoTarjeta(usuario){
  let id = "id" + usuario._id.toString()
  let ref = document.querySelector(".lista-usuarios");
  let form = document.createElement("form");
  form.setAttribute("id", id);

  let file = document.createElement("input");
  file.setAttribute("name", "usuario");
  file.setAttribute("type", "file");
  file.setAttribute("hidden", true);
  file.setAttribute("id", id + "img");

  let img = document.createElement("img");
  img.setAttribute("src", "./imgs/" + usuario.img)
  
  let user = document.createElement("input");
  user.setAttribute("name", "user");
  user.setAttribute("type", "text");
  user.setAttribute("placeholder", "Usuario");
  user.disabled = "true";
  user.value = usuario.user;

  let pwd = document.createElement("input");
  pwd.setAttribute("name", "pwd");
  pwd.setAttribute("type", "password");
  pwd.setAttribute("placeholder", "Contraseña");
  pwd.disabled = "true";
  pwd.value = usuario.pwd;

  let nombre = document.createElement("input");
  nombre.setAttribute("name", "nombre");
  nombre.setAttribute("type", "text");
  nombre.setAttribute("placeholder", "Nombre");
  nombre.disabled = "true";
  if(usuario.nombre != undefined){
    nombre.value = usuario.nombre;
  }
  
  let primerApellido = document.createElement("input");
  primerApellido.setAttribute("name", "primerApellido");
  primerApellido.setAttribute("type", "text");
  primerApellido.setAttribute("placeholder", "Primer Apellido");
  primerApellido.disabled = "true";
  if(usuario.primerApellido != undefined){
    primerApellido.value = usuario.primerApellido;
  }

  let segundoApellido = document.createElement("input");
  segundoApellido.setAttribute("name", "segundoApellido");
  segundoApellido.setAttribute("type", "text");
  segundoApellido.setAttribute("placeholder", "Segundo Apellido");
  segundoApellido.disabled = "true";
  if(usuario.segundoApellido != undefined){
    segundoApellido.value = usuario.segundoApellido;
  }

  let fechaNacimiento = document.createElement("input");
  fechaNacimiento.setAttribute("name", "fechaNacimiento");
  fechaNacimiento.setAttribute("type", "date");
  fechaNacimiento.disabled = "true";
  if(usuario.fechaNacimiento != undefined){
    fechaNacimiento.value = usuario.fechaNacimiento;
  }

  ref.appendChild(form)
  form.appendChild(file);
  form.appendChild(img);
  form.appendChild(user);
  form.appendChild(pwd);
  form.appendChild(nombre);
  form.appendChild(primerApellido);
  form.appendChild(segundoApellido);
  form.appendChild(fechaNacimiento);
  
  let div = document.createElement("div");

  let edit = document.createElement("input");
  edit.setAttribute("type", "button");
  edit.value = "Editar";

  let save = document.createElement("input");
  save.setAttribute("type", "button");
  save.value = "Guardar";

  let del = document.createElement("input");
  del.setAttribute("type", "button");
  del.value = "Borrar";
  
  form.appendChild(div);
  div.appendChild(edit);
  div.appendChild(save);
  div.appendChild(del);

  eventoEditar(id);
  eventoGuardar(id);
  eventoBorrar(id);
}

function creoTarjetaPublica(usuario){
  let id = "id" + usuario._id.toString()
  let ref = document.querySelector(".lista-usuarios");
  let form = document.createElement("form");
  form.setAttribute("id", id)
  ref.appendChild(form);

  let img = document.createElement("img");
  img.setAttribute("src", "./imgs/" + usuario.img)
  form.appendChild(img);
  
  let user = document.createElement("input");
  user.setAttribute("name", "user");
  user.setAttribute("type", "text");
  user.setAttribute("placeholder", "Usuario");
  user.disabled = "true";
  user.value = usuario.user;
  form.appendChild(user);

  let nombre = document.createElement("input");
  nombre.setAttribute("name", "nombre");
  nombre.setAttribute("type", "text");
  nombre.setAttribute("placeholder", "Nombre");
  nombre.disabled = "true";
  if(usuario.nombre != undefined){
    nombre.value = usuario.nombre;
    form.appendChild(nombre);
  }
  
  let primerApellido = document.createElement("input");
  primerApellido.setAttribute("name", "primerApellido");
  primerApellido.setAttribute("type", "text");
  primerApellido.setAttribute("placeholder", "Primer Apellido");
  primerApellido.disabled = "true";
  if(usuario.primerApellido != undefined){
    primerApellido.value = usuario.primerApellido;
    form.appendChild(primerApellido);
  }

  let segundoApellido = document.createElement("input");
  segundoApellido.setAttribute("name", "segundoApellido");
  segundoApellido.setAttribute("type", "text");
  segundoApellido.setAttribute("placeholder", "Segundo Apellido");
  segundoApellido.disabled = "true";
  if(usuario.segundoApellido != undefined){
    segundoApellido.value = usuario.segundoApellido;
    form.appendChild(segundoApellido);
  }

  let fechaNacimiento = document.createElement("input");
  fechaNacimiento.setAttribute("name", "fechaNacimiento");
  fechaNacimiento.setAttribute("type", "date");
  fechaNacimiento.disabled = "true";
  if(usuario.fechaNacimiento != undefined){
    fechaNacimiento.value = usuario.fechaNacimiento;
    form.appendChild(fechaNacimiento);
  }
}

async function cargarUsuario(){
  let datos = {
    endpoint: '/leertodo'
  }
  let usuarios = await comunicandoServer(datos);
  for(let usuario of usuarios.datos){
    creoTarjeta(usuario);
  }
}

async function enviarToken(){
  let token = localStorage.getItem("token");
  let datos = {
    endpoint: "/checktoken",
    tipoComunicacion: {method: "POST", headers: {"authorization": token}}
  }
  let result = await comunicandoServer(datos);
  console.log(result)
  if(result.user != ""){
    location.replace("./" + result.user);
  }
}

export {
  comunicandoServer,
  cargarUsuario, 
  creoTarjeta,
  creoTarjetaPublica,
  enviarToken
}