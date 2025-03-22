"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const cors_1 = require("./config/cors");
const cors_2 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config(); //En este caso es para la variable de entorno DATABASE_URL este de forma gloabal
(0, db_1.connectDB)();
const app = (0, express_1.default)();
app.use((0, cors_2.default)(cors_1.corsConfig));
//Logging
app.use((0, morgan_1.default)('dev'));
//Habilita el body en formato JSON para obtener la respueta de los datos
app.use(express_1.default.json());
//Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/projects', projectRoutes_1.default);
exports.default = app;
//# sourceMappingURL=server.js.map