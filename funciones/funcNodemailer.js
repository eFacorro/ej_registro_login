const {
    jwtToken } = require("./funcJWT.js");
const nodemailer = require('nodemailer');
  
// let transporter = nodemailer.createTransport({   // https://www.youtube.com/watch?v=W3jGtgva46w
//   service: 'gmail',
//   auth: {
//     type: 'OAuth2',
//     user: process.env.MAIL_USERNAME,
//     clientId: process.env.OAUTH_CLIENTID,
//     clientSecret: process.env.OAUTH_CLIENT_SECRET,
//     refreshToken: process.env.OAUTH_REFRESH_TOKEN
//   }
// });

let transporter = nodemailer.createTransport({    // https://youtu.be/TvOfrZnaunQ?t=127
host: process.env.MAIL_HOST, // "stmp.google.com",
port: process.env.MAIL_PORT,
secure: true,
auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.PASS,
},
});

function emailVerificacion(mailTo){
  let urlVerificacion = process.env.DOMINIO + "/verificar/" + jwtToken({mail: mailTo});
  let mailOptions = {
    from: `"Mi app" <${process.env.MAIL_VERIFICACION}>`,
    to: mailTo,
    subject: "Verificacón de Correo",
    html: `<p>Verifica que el correo es tuyo: <p><a href="${urlVerificacion}">verificar</a>`// <p>${urlVerificacion}</p>`
  };

  transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
    }
  });
}

function emailPass(mailTo){
  let urlPass = process.env.DOMINIO + "/changepass/" + jwtToken({mail: mailTo});
  let mailOptions = {
    from: `"Mi app" <${process.env.MAIL_VERIFICACION}>`,
    to: mailTo,
    subject: "Cambio de Contraseña",
    html: `<p>Cambia tu contraseña aqui: <p><a href="${urlPass}">Cambiar Contraseña</a>`// <p>${urlPass}</p>`
  };

  transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
    }
  });
}

module.exports = {
emailVerificacion,
emailPass
}