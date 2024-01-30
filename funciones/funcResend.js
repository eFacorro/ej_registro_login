const {
  jwtToken } = require("./funcJWT.js");

const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_TOKEN);

function emailVerificacion(mailTo){
  let urlVerificacion = process.env.DOMINIO + "/verificar/" + jwtToken({mail: mailTo});
  resend.emails.send({
    from: `"Mi app" <${process.env.MAIL_VERIFICACION}>`,
    to: mailTo,
    subject: "Verificacón de Correo",
    html: `<p>Verifica que el correo con es tuyo: <p><a href="${urlVerificacion}">verificar`
  });
}

module.exports = {
  emailVerificacion
}