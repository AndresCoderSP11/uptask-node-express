"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const Project_1 = __importDefault(require("../models/Project"));
class ProjectController {
    static createProject = async (req, res) => {
        /* Recuerda que en la parte del try catch  */
        /* const project=new Project(req.body); */
        /* En ese caso inicialmente crea pero hay otro metodo */
        /* Cuando se trata de almacenamiento hace el tryCatch */
        const project = new Project_1.default(req.body);
        try {
            /* await project.save(); */
            project.manager = req.user.id;
            await project.save();
            res.status(201).send('Proyecto Creado Correctamente');
            return;
        }
        catch (error) {
            console.log(error);
        }
    };
    static getAllProjects = async (req, res) => {
        try {
            const projects = await Project_1.default.find({
                $or: [
                    /* Vas a mostrar al mannager y a los que pertenecen en el team */
                    { manager: { $in: req.user.id } },
                    { team: { $in: req.user.id } }
                ]
            });
            res.json(projects);
            return;
        }
        catch (error) {
            console.log(error);
        }
    };
    static getProjectById = async (req, res) => {
        try {
            const project = await Project_1.default.findById(req.params.id).populate('tasks');
            if (!project) {
                const error = new Error('Proyecto no encontrado');
                res.status(404).send({ error: error.message });
                return;
            }
            if (project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                const error = new Error('Accion No Valida');
                res.status(404).json({ error: error.message });
                return;
            }
            res.json(project);
        }
        catch (error) {
            console.log(error);
        }
    };
    static updateProject = async (req, res) => {
        const { id } = req.params;
        const { projectName, clientName, description } = req.body;
        try {
            const project = await Project_1.default.findByIdAndUpdate(id, req.body);
            if (!project) {
                const error = new Error('No ha sido posible actualizar el proyecto');
                res.status(404).send({ error: error.message });
                return;
            }
            if (project.manager.toString() !== req.user.id.toString()) {
                const error = new Error('Solo el Manager puede actualizar un Proyecto');
                res.status(404).json({ error: error.message });
                return;
            }
            await project.save();
            res.status(200).send('Proyecto Actualizado Correctamente');
            return;
        }
        catch (error) {
            console.log(error);
        }
        console.log('Desde put');
    };
    static deleteProject = async (req, res) => {
        const { id } = req.params;
        try {
            const project = await Project_1.default.findById(id);
            if (!project) {
                const error = new Error('No ha sido posible eliminar el proyecto');
                res.status(404).send({ error: error.message });
                return;
            }
            if (project.manager.toString() !== req.user.id.toString()) {
                const error = new Error('Solo el Manager puede Eliminar un Proyecto');
                res.status(404).json({ error: error.message });
                return;
            }
            await project.deleteOne();
            res.status(200).send('Proyecto Eliminado Correctamente');
            return;
        }
        catch (error) {
            console.log(error);
        }
    };
}
exports.ProjectController = ProjectController;
//# sourceMappingURL=ProjectController.js.map