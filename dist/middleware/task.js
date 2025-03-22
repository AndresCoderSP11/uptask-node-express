"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskExists = taskExists;
exports.taskBelongsToProject = taskBelongsToProject;
exports.hasAuthorization = hasAuthorization;
const Task_1 = __importDefault(require("../models/Task"));
async function taskExists(req, res, next) {
    try {
        const { taskId } = req.params;
        const task = await Task_1.default.findById(taskId);
        if (!task) {
            const error = new Error('Proyecto no encontrado');
            res.status(404).send({ error: error.message });
            return;
        }
        req.task = task;
        next();
    }
    catch (error) {
        res.status(500).send({ error: 'Hubo un error' });
    }
}
/* Verifica si la tarea pertenece al mismo proyecto */
function taskBelongsToProject(req, res, next) {
    if (req.task.project.toString() !== req.project.id.toString()) {
        const error = new Error('Accion no valida');
        res.status(400).send({ error: error.message });
        return;
    }
    next();
}
function hasAuthorization(req, res, next) {
    /* Permite que no aplique ciertas validaciones o no pase hasta que se
    valide que el creador no sea distinto */
    if (req.user.id.toString() !== req.project.manager.toString()) {
        const error = new Error('Accion no valida');
        res.status(400).send({ error: error.message });
        return;
    }
    next();
}
//# sourceMappingURL=task.js.map