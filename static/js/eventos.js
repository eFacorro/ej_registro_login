import {
  cargarUsuario} from "./helpers.js";

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
    let response = await fetch("/rexistro", {method: "POST",body: new FormData(formRexistro) });
    let result = await response.json();
    console.log("resposta de rexistrarUsuario: ", result);
  });
}

function checkNewUser(){
  let newUser = document.querySelector("#formRexistro > input[name='user']")
  newUser.addEventListener("change", async (e) => {
    e.preventDefault();
    let response = await fetch("/check", {method: "POST",body: new FormData(formRexistro) });
    let result = await response.json();
    console.log("resposta de checkUser: ", result);

    let ref = document.querySelector("#formRexistro > span");
    ref.innerText = result.msg;
    if (result.status == true){
      ref.style.display = "block";
      newUser.style.color = "red";
    } else {
      ref.style.display = "none";
      newUser.style.color = "black";
    }
  });
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
    let formularios = new FormData();
    formularios.append("_id", id.slice(2))

    let form = document.querySelectorAll("#" + id + " > input");
    for (let input of form){
      input.disabled = true;
      formularios.append(input.name, input.value);
    }
    for(let [name, value] of formularios) {
      console.log(`${name} = ${value}`); // key1 = value1, luego key2 = value2
    }
    
    let formId = document.querySelector("#" + id);
    console.log(formularios)
    let response = await fetch("/update", {method: "POST", body: formularios});
    let result = await response.json();
    console.log("resposta de guardarUsuario: ", result);
  })
}

function eventoBorrar(id){
  let botonEditar = document.querySelector("#" + id + " > div > input[value='Borrar']");
  botonEditar.addEventListener("click", (e) => {
    e.preventDefault();
    let form = document.querySelector("#" + id);
    form.remove()
    // borrar datos nuevos en base de datos
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
  eventoRecargar
}