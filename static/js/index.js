formRexistro.style.display = "none";
registroSpan.style.opacity = 0.5;
// formLogin.style.display = "none";

loginSpan.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("login")
  formRexistro.style.display = "none";
  registroSpan.style.opacity = 0.5;
  formLogin.style.display = "flex";
  loginSpan.style.opacity = 1;
  formRexistro.reset();
})

registroSpan.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("registro")
  formRexistro.style.display = "flex";
  registroSpan.style.opacity = 1;
  formLogin.style.display = "none";
  loginSpan.style.opacity = 0.5;
  formLogin.reset();
})

rexistrarUsuario.addEventListener("click", async (e) => {
  e.preventDefault();
  let response = await fetch("/rexistro", {method: "POST",body: new FormData(formRexistro) });
  let result = await response.json();
  console.log("resposta de rexistrarUsuario: ", result);
});

loginUsuario.addEventListener("click", async (e) => {
  e.preventDefault();
  let response = await fetch("/login", {method: "POST",body: new FormData(formLogin) });
  let result = await response.json();
  console.log("resposta de loginUsuario: ", result);[]
});

let newUser = document.querySelector("#formRexistro > input[name='user']")
newUser.addEventListener("change", async (e) => {
  e.preventDefault();
  let response = await fetch("/check", {method: "POST",body: new FormData(formRexistro) });
  let result = await response.json();
  console.log("resposta de checkUser: ", result);[]
});