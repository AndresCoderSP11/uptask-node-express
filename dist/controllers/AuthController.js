"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthConntroller = void 0;
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../utils/auth");
const Token_1 = __importDefault(require("../models/Token"));
const token_1 = require("../utils/token");
const AuthEmail_1 = require("../emails/AuthEmail");
const jwt_1 = require("../utils/jwt");
class AuthConntroller {
    static createAccount = async (req, res) => {
        const { password, email } = req.body;
        try {
            const verifyEmail = await User_1.default.findOne({ email });
            if (verifyEmail) {
                const error = new Error('Este usuario ya existe');
                res.status(409).send({ error: error.message });
                return;
            }
            const user = new User_1.default(req.body);
            //Proceso de colocar el password en hash en 10
            //Password
            const passwordHash = await (0, auth_1.hashPassword)(password);
            user.password = passwordHash;
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            /* await token.save();
            await user.save(); En este caso por doble de vida , se tiene
            que hacer uso de la promesa
                             */
            AuthEmail_1.AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            });
            await Promise.allSettled([user.save(), token.save()]);
            res.send('Creado correctamente, revisa tu Email');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un Error' });
        }
    };
    static confirmAccount = async (req, res) => {
        const { token } = req.body;
        try {
            const tokenExist = await Token_1.default.findOne({ token });
            if (!tokenExist) {
                const error = new Error('No existe este Token');
                res.status(401).send({ error: error.message });
                return;
            }
            const user = await User_1.default.findById(tokenExist.user);
            user.confirmed = true;
            /* En este caso no solo queremos que el token se quede, si no que eliminar el token */
            await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
            res.send('Usuario Validado correctamente');
            return;
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un Error' });
        }
    };
    static login = async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User_1.default.findOne({ email });
            if (!user) {
                const error = new Error('Email no existe');
                res.status(401).send({ error: error.message });
                return;
            }
            const isConfirmed = user.confirmed;
            if (!isConfirmed) {
                /* Si inicialmente encontramos un Token con este seria
                creo yo eliminnar , luego generar otro Token por tema de Seguridad */
                const token = new Token_1.default();
                token.user = user.id;
                token.token = (0, token_1.generateToken)();
                await token.save();
                AuthEmail_1.AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                });
                const error = new Error('Usuario no ha confirmado su cuenta, se ha enviado un token');
                res.status(404).send({ error: error.message });
                return;
            }
            /* Ahora toca verificar o validar el password */
            const isPasswordValid = await (0, auth_1.comparePassword)(password, user.password);
            if (!isPasswordValid) {
                /* Creamos un nuevo Objeto */
                const error = new Error('Credenciales Incorrectas');
                res.status(404).send({ error: error.message });
                return;
            }
            const token = (0, jwt_1.generateJWT)({ id: user.id });
            /* Aqui se genera el JWT */
            res.send(token);
            return;
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    static requestConfirmationCode = async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User_1.default.findOne({ email });
            if (!user) {
                const error = new Error('No existe este Email');
                res.status(403).send({ error: error.message });
                return;
            }
            if (user.confirmed) {
                const error = new Error('Este Usuario se encuentra confirmado no es necesario la solicitud');
                res.status(403).send({ error: error.message });
                return;
            }
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            AuthEmail_1.AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            });
            await token.save();
            res.status(200).send('Envio Ip de nuevo');
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    static forgotPassword = async (req, res) => {
        const { password, email } = req.body;
        try {
            const user = await User_1.default.findOne({ email });
            if (!user) {
                const error = new Error('Usuario no encontrado');
                res.status(403).send({ error: error.message });
                return;
            }
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            await token.save();
            AuthEmail_1.AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            });
            res.status(200).send('Token enviado correctamente, porfavor revisar tu correo');
            return;
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un Error' });
        }
    };
    static validateToken = async (req, res) => {
        try {
            const { token } = req.body;
            const tokenExist = await Token_1.default.findOne({ token });
            if (!tokenExist) {
                const error = new Error('No existe este Token');
                res.status(401).send({ error: error.message });
                return;
            }
            res.status(200).send('Verificado Correctamente');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static updatePasswordWithToken = async (req, res) => {
        try {
            const { token } = req.params;
            const { password } = req.body;
            const tokenExist = await Token_1.default.findOne({ token });
            if (!tokenExist) {
                const error = new Error('No existe este Token');
                res.status(401).send({ error: error.message });
                return;
            }
            const user = await User_1.default.findById(tokenExist.user);
            user.password = await (0, auth_1.hashPassword)(password);
            await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
            res.send('El password se modifico correctametne');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static user = async (req, res) => {
        res.send(req.user);
    };
    static updateProfile = async (req, res) => {
        const { name, email } = req.body;
        const findUser = await User_1.default.findOne({ email });
        /* Es como que valida que el email o ingrese de nuevo no habria problema,
        la unica cparte a actualizar es la parte del nombre, lo esta haciendo mediante
        datos */
        if (findUser && findUser.id.toString() !== req.user.id.toString()) {
            const error = new Error('Este usuario de email ya existe');
            res.status(409).send({ error: error.message });
            return;
        }
        req.user.email = email;
        req.user.name = name;
        try {
            await req.user.save();
            res.send('Usuario Actualizado Correctamente');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static updateCurrentUserPassword = async (req, res) => {
        const { current_password, password } = req.body;
        const user = await User_1.default.findById(req.user.id);
        const isPasswordValid = await (0, auth_1.comparePassword)(current_password, user.password);
        if (!isPasswordValid) {
            const error = new Error('Password Incorrecto');
            res.status(401).send({ error: error.message });
            return;
        }
        try {
            user.password = await (0, auth_1.hashPassword)(password);
            await user.save();
            res.send('Password Actualizado Correctamente');
            return;
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static checkPassword = async (req, res) => {
        const { password } = req.body;
        const user = await User_1.default.findById(req.user.id);
        const isPasswordValid = await (0, auth_1.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            const error = new Error('Password Incorrecto');
            res.status(401).send({ error: error.message });
            return;
        }
        res.send('Password Correcto');
    };
}
exports.AuthConntroller = AuthConntroller;
//# sourceMappingURL=AuthController.js.map