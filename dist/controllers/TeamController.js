"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMemberController = void 0;
const User_1 = __importDefault(require("../models/User"));
const Project_1 = __importDefault(require("../models/Project"));
class TeamMemberController {
    static findMemberByEmail = async (req, res) => {
        const { email } = req.body;
        const user = await User_1.default.findOne({ email }).select('id email name');
        if (!user) {
            const error = new Error('El usuario no existe');
            res.status(403).json({ error: error.message });
            return;
        }
        res.send(user);
    };
    static getProjectTeam = async (req, res) => {
        /* Verificar la parte del Arreglo quien corresponde a este projecto */
        const project = await Project_1.default.findById(req.project.id).populate({
            path: 'team',
            select: 'id email name'
        });
        res.json(project.team);
    };
    static addMemberById = async (req, res) => {
        const { id } = req.body;
        const user = await User_1.default.findById(id).select('id');
        if (!user) {
            const error = new Error('El usuario no existe');
            res.status(403).json({ error: error.message });
            return;
        }
        console.log(req.project.manager.toString());
        console.log(req.user._id.toString());
        if (req.project.manager.toString() == user._id.toString()) {
            const error = new Error('El manager no puede ser colaborador');
            res.status(409).json({ error: error.message });
            return;
        }
        if (req.project.team.some(team => team.toString() === user.id.toString())) {
            const error = new Error('El usuario ya existe en el proyecto');
            res.status(409).json({ error: error.message });
            return;
        }
        req.project.team.push(user.id);
        await req.project.save();
        res.json(user);
    };
    static removeMemberId = async (req, res) => {
        const { userId } = req.params;
        if (!req.project.team.some(team => team.toString() === userId.toString())) {
            const error = new Error('El usuario no existe en el proyecto');
            res.status(409).json({ error: error.message });
            return;
        }
        req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== userId);
        await req.project.save();
        res.send('Usuario Eliminado Correctamente');
    };
}
exports.TeamMemberController = TeamMemberController;
//# sourceMappingURL=TeamController.js.map