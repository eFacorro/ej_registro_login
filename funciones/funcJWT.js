let jwt = require('jsonwebtoken');

const crearToken = (req, res, next, datos)=>{
  console.log(req.headers.referer);
  let token = jwt.sign({ dato: datos }, process.env.SECRETO);
  req.token = token;
  next();
}

const comprobarToken = (token)=>{
  console.log("req.headers.authorization: ", token)
  console.log(`Estou en tesToken ${token} ${process.env.SECRETO}`);
  
  if (!token) {
    console.log("Falta a cabeceira de autorización");
  }

  let tokenInfo;
  
  try {
    tokenInfo = jwt.verify(token, process.env.SECRETO);
    return tokenInfo.dato
  } catch (e) {
  }
}

module.exports = {
  crearToken,
  comprobarToken
}