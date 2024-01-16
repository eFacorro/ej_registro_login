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
  let ref = document.querySelector(".lista-usuarios");
  let form = document.createElement("form");
  
  let user = document.createElement("input");
  user.setAttribute("name", "user");
  user.setAttribute("type", "text");
  user.setAttribute("placeholder", "Usuario");
  user.value = usuario.user;

  ref.appendChild(form)
  form.appendChild(user);
  console.log(usuario.user)
}

export {
  comunicandoServer,
  creoTarjeta
}