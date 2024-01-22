let jwt = require('jsonwebtoken');

const crearToken = (req, res, next)=>{
  let datos = {user: req.body.user, pwd: req.body.pwd};
  let token = jwt.sign({ dato: datos }, process.env.SECRETO);

  req.token = token;
  next();
  
}

const comprobarToken = (req,res,next)=>{
  console.log("req.headers.authorization: ",req.headers.authorization)
  const { authorization } = req.headers;
  console.log(`Estou en tesToken ${authorization} ${process.env.SECRETO}`);
  

  // Se authorization está vacío devolvo un erro
  if (!authorization) {
    console.log("Falta a cabeceira de autorización");
    // const error = new Error("Falta a cabeceira de autorización");
    // error.httpStatus = 401;
    // throw error;
  }

  let tokenInfo;
  
  try {
    tokenInfo = jwt.verify(authorization, process.env.SECRETO);
    return tokenInfo.dato.user
  } catch (e) {
    // const error = new Error("El token no es válido");
    // error.httpStatus = 401;
    // throw error;
  }
}

module.exports = {
  crearToken,
  comprobarToken
}