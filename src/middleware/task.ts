import type { Request,Response,NextFunction } from "express";
import Project, { ITask } from "../models/Task";

declare global{
    namespace Express{
        interface Request{
            task:ITask //En este caso la parte del IProject es del 
            // modelo brindado en el archivo models/Project.ts pero su Tipado
        }
    }
}

export async function taskExists(req:Request,res:Response,next:NextFunction){
    try {
        const {taskId}=req.params;
        const task=await Project.findById(taskId);
        if(!task){
            const error=new Error('Proyecto no encontrado');
            res.status(404).send({error:error.message});
            return;
        }
        req.task=task;
        next();
    } catch (error) {
        res.status(500).send({error:'Hubo un error'});
    }
}

/* Verifica si la tarea pertenece al mismo proyecto */
export function taskBelongsToProject(req:Request,res:Response,next:NextFunction){
    if(req.task.project.toString()!==req.project.id.toString()){
        const error = new Error('Accion no valida');
        res.status(400).send({error:error.message});
        return;
    }
    next();
}

export function hasAuthorization(req:Request,res:Response,next:NextFunction){
    /* Permite que no aplique ciertas validaciones o no pase hasta que se 
    valide que el creador no sea distinto */
    if(req.user.id.toString() !== req.project.manager.toString()){
        const error = new Error('Accion no valida');
        res.status(400).send({error:error.message});
        return;
    }
    next()
}