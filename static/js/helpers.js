import { 
  eventoEditar,
  eventoGuardar,
  eventoBorrar,
  registroUser,
  checkNewUser,
  eventoRecargar,
  checkPass,
  checkMail,
  salir } from "./eventos.js"

const comunicandoServer = async (datos)=>{
  let response;
  if(datos.tipoComunicacion !== undefined){
      response = await fetch(datos.endpoint,datos.tipoComunicacion);
  }else{
      response = await fetch(datos.endpoint);
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

  let mail = document.createElement("input");
  mail.setAttribute("name", "mail");
  mail.setAttribute("type", "email");
  mail.setAttribute("placeholder", "mail");
  mail.disabled = "true";
  mail.value = usuario.mail;

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
  form.appendChild(mail);
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
  if(result.user != ""){
    location.replace("./" + result.user);
  }
}

function configurador(result){
  if (result.status){
    if(!result.public){
      if(result.user.admin){
        document.querySelector("html").innerHTML = result.html;
        cargarUsuario();
        registroUser();
        checkNewUser();
        eventoRecargar();
        checkPass();
        checkMail();
      } else {
        document.querySelector("html").innerHTML = result.html;
        document.querySelector("title").innerText = result.user.user;
        creoTarjeta(result.user);
      }
    }
  } else{
    if(result.public){
      location.replace("/")
    } else {
      let ref = document.querySelector("#formLogin > span");
      ref.innerText = result.msg;
      ref.style.display = "block";
      return
    }
  }
  let insertHtml = document.querySelector(".lista-usuarios");
  insertHtml.style.display = "flex";
  salir();
}

async function funcCheckNuewUser(newUser){
  let result;
  let ref = document.querySelector("#formRexistro > span");
  if(newUser.value == ""){
    ref.innerText = "El usuario es obligatorio";
    ref.style.display = "block";
    newUser.style.color = "red";
    return true
  } else {
    let datos = {
      endpoint: "/check",
      tipoComunicacion: {method: "POST", body: new FormData(formRexistro)}
    }
    result = await comunicandoServer(datos);
    ref.innerText = result.msg;
  }
  if (result.status){
    ref.style.display = "block";
    newUser.style.color = "red";
    return true
  } else {
    ref.style.display = "none";
    newUser.style.color = "black";
    return false
  }
}

function funcCheckPass(pass){
  let ref = document.querySelector("#formRexistro > span:nth-child(6)");
  if(pass.value.length < 4){
    ref.innerText = "Contraseña minima 4 caracteres";
    ref.style.display = "block";
    return true
  } else {
    ref.innerText = "";
    ref.style.display = "none";
    return false
  }
}

async function funcCheckMail(mail){
  let result;
  let ref = document.querySelector("#formRexistro > span:nth-child(4)");

  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (mail.value.match(validRegex)) {
    ref.innerText = "";
    ref.style.display = "none";
    let datos = {
      endpoint: "/checkMail",
      tipoComunicacion: {method: "POST", body: new FormData(formRexistro)}
    }
    result = await comunicandoServer(datos);
    if (result.status){
      ref.innerText = "Este email ya esta registrado";
      ref.style.display = "block";
      mail.style.color = "red";
      return true
    } else {
      ref.innerText = "";
      ref.style.display = "none";
      mail.style.color = "black";
      return false
    }
  } else {
    ref.innerText = "Formato de email incorrecto";
    ref.style.display = "block";
    return true
  }
}

function funcCheckRegistro(flatUser, flatPwd, flatMail){
  if(flatUser || flatPwd || flatMail){
    rexistrarUsuario.disabled = true;
  } else {
    rexistrarUsuario.disabled = false;
  }
}

export {
  comunicandoServer,
  cargarUsuario, 
  creoTarjeta,
  creoTarjetaPublica,
  enviarToken,
  configurador,
  funcCheckNuewUser,
  funcCheckPass,
  funcCheckMail,
  funcCheckRegistro
}