import {
  cargarUsuario,
  creoTarjeta,
  comunicandoServer,
  configurador } from "./helpers.js";

let flatPwd = false;
let flatUser = false;
let flatMail = false;

function botonRegistro(){
  registroSpan.addEventListener("click", (e) => {
    e.preventDefault();
    formRexistro.style.display = "flex";
    registroSpan.style.opacity = 1;
    formLogin.style.display = "none";
    loginSpan.style.opacity = 0.5;
    formLogin.reset();
  })
}

function botonLogin(){
  loginSpan.addEventListener("click", (e) => {
    e.preventDefault();
    formRexistro.style.display = "none";
    registroSpan.style.opacity = 0.5;
    formLogin.style.display = "flex";
    loginSpan.style.opacity = 1;
    formRexistro.reset();
  })
}

function loginUser(){
  loginUsuario.addEventListener("click", async (e) => {
    e.preventDefault();
    let token = localStorage.getItem('token');
    let userOMail = document.querySelector("#formLogin > input[name='user']")
    if (!funcCheckMail(userOMail)){
      userOMail.setAttribute("name", "mail");
    }
    let datos = {
      endpoint: "/login",
      tipoComunicacion: {method: "POST", body: new FormData(formLogin), headers: {"authorization": token} }
    }
    let result = await comunicandoServer(datos);
    // console.log(result);
    if(result.token != undefined){
      localStorage.setItem('token', result.token);
      location.replace("/" + result.user.user);
    }
    configurador(result);
  });
}

function registroUser(){
  rexistrarUsuario.addEventListener("click", async (e) => {
    e.preventDefault();
    let newUser = document.querySelector("#formRexistro > input[name='user']");
    flatUser = await funcCheckNuewUser(newUser);
    let mail = document.querySelector("#formRexistro > input[name='mail']");
    flatMail = await funcCheckMail(mail);
    let pass = document.querySelector("#formRexistro > input[name='pwd']");
    flatPwd = await funcCheckPass(pass);
    funcCheckRegistro(flatUser, flatPwd, flatMail);
    if (!flatUser && !flatPwd && !flatMail){
      let datos = {
      endpoint: "/rexistro",
      tipoComunicacion: {method: "POST", body: new FormData(formRexistro)}
    }
    let result = await comunicandoServer(datos);
      // console.log("resposta de rexistrarUsuario: ", result);
      formRexistro.reset();
      if(rexistrarUsuario.value === "admin"){
        creoTarjeta(result.user);
      }
      else {
        localStorage.setItem('token', result.token);
        // location.replace("./" + result.user.user)  // insertar pagina despues de registrarse
        document.querySelector("html").innerHTML = result.html;
        salir();
      }
    }
  });
}

function checkNewUser(){
  let newUser = document.querySelector("#formRexistro > input[name='user']");
  newUser.addEventListener("change", async (e) => {
    e.preventDefault();
    flatUser = await funcCheckNuewUser(newUser);
    funcCheckRegistro(flatUser, flatPwd, flatMail);
  });
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

function checkPass(){
  let pass = document.querySelector("#formRexistro > input[name='pwd']");
  pass.addEventListener("change", (e) => {
    e.preventDefault();
    flatPwd = funcCheckPass(pass);
    funcCheckRegistro(flatUser, flatPwd, flatMail);
  });
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

function checkMail(){
  let mail = document.querySelector("#formRexistro > input[name='mail']");
  mail.addEventListener("change", async (e) => {
    e.preventDefault();
    flatMail = await funcCheckMail(mail);
    funcCheckRegistro(flatUser, flatPwd, flatMail);
  });
}

async function funcCheckMail(mail){
  console.log("funcCheckMail", mail.value);
  let result;
  let ref = document.querySelector("#formRexistro > span:nth-child(4)");

  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (mail.value.match(validRegex)) {
    console.log("formato de email correcto");
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
    console.log("formato de email incorrecto");
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

function eventoEditar(id){
  let botonEditar = document.querySelector("#" + id + " > div > input[value='Editar']");
  let editoImg = document.querySelector("#" + id + " > img");
  let file = document.querySelector("#" + id + "img");

  botonEditar.addEventListener("click", (e) => {
    e.preventDefault();
    let form = document.querySelectorAll("#" + id + " > input");
    editoImg.style.cursor = "pointer";
    editoImg.setAttribute("value", "edito");
    for (let input of form){
      input.disabled = false;
    }
  });

  editoImg.addEventListener("click", async (e) => {
    e.preventDefault();
    if(editoImg.getAttribute("value") == "edito"){
      file.click();
    }
  });

  file.addEventListener("change", (e) => {
    e.preventDefault();
    let imgFile = e.target.files[0];
    let datosImg = URL.createObjectURL(imgFile);
    console.log(datosImg)
    editoImg.setAttribute("src", datosImg);
  });
}

function eventoGuardar(id){
  let botonEditar = document.querySelector("#" + id + " > div > input[value='Guardar']");
  let editoImg = document.querySelector("#" + id + " > img");
  botonEditar.addEventListener("click", async (e) => {
    e.preventDefault();
    let formulario = new FormData();
    formulario.append("_id", id.slice(2));
    editoImg.style.cursor = "auto"; 
    editoImg.removeAttribute("value");
    let form = document.querySelectorAll("#" + id + " > input");
    let img = document.querySelector("#" + id + " > img");
    for (let input of form){
      input.disabled = true;
      if(input.name == "usuario"){
        formulario.append(input.name, input.files[0]);
      } else{
        formulario.append(input.name, input.value);
      }
    }
    let datos = {
      endpoint: "/update",
      tipoComunicacion: {method: "PUT", body: formulario, files: img.src}
    }
    let result = await comunicandoServer(datos);
    // console.log("resposta de guardarUsuario: ", result);
  })
}

function eventoBorrar(id){
  let botonBorrar = document.querySelector("#" + id + " > div > input[value='Borrar']");
  botonBorrar.addEventListener("click", async (e) => {
    e.preventDefault();
    let formulario = new FormData();
    formulario.append("_id", id.slice(2));
    let datos = {
      endpoint: "/delete",
      tipoComunicacion: {method: "POST", body: formulario}
    }
    let result = await comunicandoServer(datos);
    // console.log("resposta de borrarUsuario: ", result);

    let form = document.querySelector("#" + id);
    form.remove();
  })
}

function eventoRecargar(){
  recargar.addEventListener("click", (e) => {
    e.preventDefault();
    let form;
    do {
      form = document.querySelector(".lista-usuarios > form");
      form.remove()
    } while (document.querySelector(".lista-usuarios > form") != undefined);
    cargarUsuario();
  })
}

function salir(){
  loginOut.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    location.replace("./");
  })
}

export {
  botonRegistro,
  botonLogin,
  loginUser,
  registroUser,
  checkNewUser,
  eventoEditar,
  eventoGuardar,
  eventoBorrar,
  eventoRecargar,
  checkPass,
  salir,
  checkMail
}