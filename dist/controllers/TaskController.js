"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const Task_1 = __importDefault(require("../models/Task"));
class TaskController {
    static createTask = async (req, res) => {
        /* Valida la existencia  */
        try {
            const task = new Task_1.default(req.body);
            task.project = req.project.id;
            req.project.tasks.push(task.id);
            //Tener 2 await es una malapractica, en este caso ahora
            //procederemos a usar promesas
            /* await req.project.save();
            await task.save(); */
            await Promise.allSettled([task.save(), req.project.save()]);
            res.status(201).send('Tarea Creada Correctamente');
            return;
        }
        catch (error) {
            console.log(error);
        }
    };
    static getTasks = async (req, res) => {
        try {
            const tasks = await Task_1.default.find({ project: req.project.id }).populate('project');
            res.json(tasks);
        }
        catch (error) {
            res.status(500).send({ error: 'Hubo un Error' });
        }
    };
    static getTaskById = async (req, res) => {
        const { taskId } = req.params;
        try {
            const task = await Task_1.default.findById(req.task.id)
                .populate({ path: 'completedBy.user', select: 'id name email' })
                .populate({ path: 'notes', populate: { path: 'createdBy', select: 'id name email' } }); //Se peude hacer un popualte tras otro
            /* En este caso la parte de id se refier al toString
            task.project.id o task.project.toString()  */
            res.json(task);
        }
        catch (error) {
            res.status(500).send({ error: 'Hubo un Error' });
        }
    };
    static updateTask = async (req, res) => {
        const { taskId } = req.params;
        try {
            /* Determinar Data */
            /* if(req.task.project.toString()!==req.project.id){
                const error=new Error('Accion no valida');
                res.status(400).send({error:error.message});
                return
            } */
            const task = await Task_1.default.findByIdAndUpdate(taskId, req.body);
            if (!task) {
                const error = new Error('No ha sido posible actualizar la tarea');
                res.status(404).send({ error: error.message });
                return;
            }
            res.status(200).send('Tarea Actualizada Correctamente');
            return;
        }
        catch (error) {
            res.status(500).send({ error: 'Hubo un Error' });
        }
    };
    static deleteTask = async (req, res) => {
        const { taskId } = req.params;
        try {
            /* Determinar Data */
            if (req.task.project.toString() !== req.project.id) {
                const error = new Error('Accion no valida');
                res.status(400).send({ error: error.message });
                return;
            }
            req.project.tasks = req.project.tasks.filter((task) => task.toString() !== taskId);
            await Promise.allSettled([req.task.deleteOne(), req.project.save()]);
            res.status(200).send('Tarea Eliminada Correctamente');
        }
        catch (error) {
            res.status(500).send({ error: 'Hubo un Error' });
        }
    };
    static updateStatus = async (req, res) => {
        const { taskId } = req.params;
        try {
            /* if(req.task.project.toString()!==req.project.id){
                const error=new Error('Accion no valida');
                res.status(400).send({error:error.message});
                return
            }*/
            const { status } = req.body;
            req.task.status = status;
            const data = {
                user: req.user.id,
                status
            };
            req.task.completedBy.push(data);
            await req.task.save();
            res.send('Tarea Actualizada');
        }
        catch (error) {
            res.status(500).send({ error: 'Hubo un Error' });
        }
    };
}
exports.TaskController = TaskController;
//# sourceMappingURL=TaskController.js.map