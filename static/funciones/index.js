rexistrarUsuario.addEventListener("click", async (e) => {
    e.preventDefault();
    let response = await fetch("/rexistro", {method: "POST",body: new FormData(formRexistro) });
    let result = await response.json();
    console.log("resposta de rexistrarUsuario: ", result);
  });