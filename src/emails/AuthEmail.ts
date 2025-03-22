import { token } from "morgan"
import { transporter } from "../config/nodemailer"
import User from "../models/User"

interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {

    static sendConfirmationEmail = async (user: IEmail) => {
        const info=await transporter.sendMail({
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
        })
        console.log('Mensaje enviado', info.messageId)
    }
 
    static sendPasswordResetToken = async (user: IEmail) => {
        const info=await transporter.sendMail({
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
        })
        console.log('Mensaje enviado', info.messageId)
    }
    

}