import {
  cargarUsuario,
  creoTarjeta } from "./helpers.js";

function botonRegistro(){
  registroSpan.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("registro")
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
    console.log("login")
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
    let response = await fetch("/login", {method: "POST",body: new FormData(formLogin) });
    let result = await response.json();
    console.log("resposta de loginUsuario: ", result);
    if (result.status == false){
      let ref = document.querySelector("#formLogin > span");
      ref.innerText = result.msg;
      ref.style.display = "block";
    }
  });
}

function registroUser(){
  rexistrarUsuario.addEventListener("click", async (e) => {
    e.preventDefault();
    let newUser = document.querySelector("#formRexistro > input[name='user']");
    let checkUser = await funcCheckNuewUser(newUser);
    let pass = document.querySelector("#formRexistro > input[name='pwd']");
    let checkPwd = await funcCheckPass(pass);
    if (checkUser && checkPwd){
      let response = await fetch("/rexistro", {method: "POST",body: new FormData(formRexistro) });
      let result = await response.json();
      console.log("resposta de rexistrarUsuario: ", result);
      if(e.srcElement.baseURI.includes("/admin")){
        creoTarjeta(result.user);
      }
      formRexistro.reset();
    }
  });
}

function checkNewUser(){
  let newUser = document.querySelector("#formRexistro > input[name='user']");
  newUser.addEventListener("change", (e) => {
    e.preventDefault();
    funcCheckNuewUser(newUser);
  });
}

async function funcCheckNuewUser(newUser){
  let result;
  let ref = document.querySelector("#formRexistro > span");
  if(newUser.value.length < 4) {
    ref.innerText = "El usuario minimo 4 caracteres";
    ref.style.display = "block";
    rexistrarUsuario.disabled = true;    //se pisa pass a user reestructurar esto el boton no funciona bien
    return false
  } else {
    let response = await fetch("/check", {method: "POST",body: new FormData(formRexistro) });
    result = await response.json();
    console.log("resposta de checkUser: ", result);
  }
  ref.innerText = result.msg;
  if (result.status){
    ref.style.display = "block";
    newUser.style.color = "red";
    rexistrarUsuario.disabled = true;
    return false
  } else {
    ref.style.display = "none";
    newUser.style.color = "black";
    rexistrarUsuario.disabled = false;
    return true
  }
}

function checkPass(){
  let pass = document.querySelector("#formRexistro > input[name='pwd']");
  pass.addEventListener("change", (e) => {
    e.preventDefault();
    funcCheckPass(pass);
  });
}

function funcCheckPass(pass){
  let ref = document.querySelector("#formRexistro > span:nth-child(4)");
  if(pass.value.length < 4){
    ref.innerText = "Contraseña minima 4 caracteres";
    ref.style.display = "block";
    rexistrarUsuario.disabled = true;
    return false
  } else {
    ref.style.display = "none";
    rexistrarUsuario.disabled = false;
    return true
  }
}

function eventoEditar(id){
  let botonEditar = document.querySelector("#" + id + " > div > input[value='Editar']");
  botonEditar.addEventListener("click", (e) => {
    e.preventDefault();
    let form = document.querySelectorAll("#" + id + " > input");
    for (let input of form){
      input.disabled = false;
    }
  })
}

function eventoGuardar(id){
  let botonEditar = document.querySelector("#" + id + " > div > input[value='Guardar']");
  botonEditar.addEventListener("click", async (e) => {
    e.preventDefault();
    let formulario = new FormData();
    formulario.append("_id", id.slice(2));

    let form = document.querySelectorAll("#" + id + " > input");
    for (let input of form){
      input.disabled = true;
      formulario.append(input.name, input.value);
    }
    
    let response = await fetch("/update", {method: "POST", body: formulario});
    let result = await response.json();
    console.log("resposta de guardarUsuario: ", result);
  })
}

function eventoBorrar(id){
  let botonEditar = document.querySelector("#" + id + " > div > input[value='Borrar']");
  botonEditar.addEventListener("click", async (e) => {
    e.preventDefault();

    let form = document.querySelector("#" + id);
    form.remove()

    let formulario = new FormData();
    formulario.append("_id", id.slice(2));
    let response = await fetch("/delete", {method: "POST", body: formulario});
    let result = await response.json();
    console.log("resposta de borrarUsuario: ", result);
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
  checkPass
}