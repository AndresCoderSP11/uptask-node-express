"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const authenticate = async (req, res, next) => {
    const bearer = req.headers.authorization; //Esto en caso si no encunetra ninnguna authorization
    if (!bearer) {
        const error = new Error('No autorizado');
        res.status(401).json({ error: error.message });
        return;
    }
    const token = bearer.split(' ')[1];
    try {
        //En la parte de util el momento de generar le jwt , te bota la cantidad de tipo de datos con el jwt 
        //Con ello se tiene que trabajar para que todo este okey :D
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === 'object' && decoded.id) {
            const user = await User_1.default.findById(decoded.id).select('id name email');
            if (user) {
                req.user = user;
                next();
            }
            else {
                res.status(500).json({ error: 'Token No Valido' });
            }
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Token No Valido' });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map