"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthEmail = void 0;
const nodemailer_1 = require("../config/nodemailer");
class AuthEmail {
    static sendConfirmationEmail = async (user) => {
        const info = await nodemailer_1.transporter.sendMail({
            from: 'Uptask <andres.salazar.p@uni.pe>',
            to: user.email,
            subject: 'UpTask - Confirma tu cuenta',
            text: 'Uptask - Confirma tu cuenta',
            html: `<p>Hola ${user.name}, has creado tu cuenta en Uptask
                        ${user.token}, ya casi esta todo listo, solo debes confirmar
                        tu cuenta</p>
                        <p>Visita el siguiente enlace:</p>
                        <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar Cuenta</a>
                        <p>E ingresa el código: <b>${user.token}</b></p>
                        `
        });
        console.log('Mensaje enviado', info.messageId);
    };
    static sendPasswordResetToken = async (user) => {
        const info = await nodemailer_1.transporter.sendMail({
            from: 'Uptask <andres.salazar.p@uni.pe>',
            to: user.email,
            subject: 'UpTask - Reestablace tu cuenta',
            text: 'Uptask - Reestablace tu cuenta',
            html: `<p>Hola ${user.name}, has creado tu cuenta en Uptask
                        ${user.token}, ya casi esta todo listo, solo debes confirmar
                        tu cuenta</p>
                        <p>Visita el siguiente enlace:</p>
                        <a href="${process.env.FRONTEND_URL}/auth/new-password">Confirmar Cuenta</a>
                        <p>E ingresa el código: <b>${user.token}</b></p>
                        `
        });
        console.log('Mensaje enviado', info.messageId);
    };
}
exports.AuthEmail = AuthEmail;
//# sourceMappingURL=AuthEmail.js.map